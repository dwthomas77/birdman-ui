// Array of anything
type AnyList = any[];

interface GetOptions {
  bearerToken?: string;
  headers?: Record<string, string>;
}

export async function httpGet<T>(
  url: string,
  options: GetOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options.headers,
  };

  if (options.bearerToken) {
    headers.Authorization = `Bearer ${options.bearerToken}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `GET ${url} failed: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as T;
}
