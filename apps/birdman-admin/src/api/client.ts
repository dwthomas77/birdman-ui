import { ApiError } from "@birdman/shared-types";
import type { ProblemDetailsResponse } from "@birdman/shared-types";

export interface ApiClientOptions {
  baseUrl: string;
  getAuthHeaders?: () => HeadersInit | Promise<HeadersInit>;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getAuthHeaders?: ApiClientOptions["getAuthHeaders"];

  constructor({ baseUrl, getAuthHeaders }: ApiClientOptions) {
    const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, "");
    let parsedBaseUrl: URL;

    try {
      parsedBaseUrl = new URL(normalizedBaseUrl);
    } catch (error) {
      throw new Error(`Invalid API base URL: "${baseUrl}"`, { cause: error });
    }

    if (parsedBaseUrl.protocol !== "http:" && parsedBaseUrl.protocol !== "https:") {
      throw new Error("API base URL must use HTTP or HTTPS.");
    }

    this.baseUrl = normalizedBaseUrl;
    this.getAuthHeaders = getAuthHeaders;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: "GET" });
  }

  post<T, TBody>(path: string, body: TBody): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T, TBody>(path: string, body: TBody): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete(path: string): Promise<void> {
    await this.request<void>(path, { method: "DELETE" }, true);
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    allowEmptyResponse = false,
  ): Promise<T> {
    const headers = new Headers({
      Accept: "application/json",
    });

    if (init.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    const authHeaders = await this.getAuthHeaders?.();
    new Headers(authHeaders).forEach((value, key) => headers.set(key, value));

    const response = await fetch(
      `${this.baseUrl}/${path.replace(/^\/+/, "")}`,
      {
        ...init,
        headers,
        credentials: "same-origin",
      },
    );

    const responseText = await response.text();
    if (!response.ok) {
      this.throwResponseError(response.status, response.statusText, responseText);
    }

    if (response.status === 204 || (allowEmptyResponse && !responseText)) {
      return undefined as T;
    }
    if (!responseText) {
      throw new Error(`API returned an empty response for ${init.method} ${path}.`);
    }

    try {
      return JSON.parse(responseText) as T;
    } catch (error) {
      throw new Error(
        `API returned invalid JSON for ${init.method} ${path}.`,
        { cause: error },
      );
    }
  }

  private throwResponseError(
    status: number,
    statusText: string,
    responseText: string,
  ): never {
    let responseBody: unknown;
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = undefined;
    }

    if (isProblemDetailsResponse(responseBody)) {
      throw new ApiError(responseBody);
    }

    const bodyMessage = responseText ? ` - ${responseText}` : "";
    throw new Error(`Request failed: ${status} ${statusText}${bodyMessage}`);
  }
}

function isProblemDetailsResponse(
  value: unknown,
): value is ProblemDetailsResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const problem = value as Partial<ProblemDetailsResponse>;
  return (
    typeof problem.type === "string" &&
    typeof problem.title === "string" &&
    typeof problem.status === "number" &&
    typeof problem.detail === "string" &&
    !!problem.errors &&
    typeof problem.errors === "object"
  );
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  return new ApiClient(options);
}
