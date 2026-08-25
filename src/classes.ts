import type { ProblemDetailsResponse } from "./types";

export class ApiError extends Error {
    public readonly problem: ProblemDetailsResponse;
    constructor(problem: ProblemDetailsResponse) {
        super(problem.detail);
        this.name = "ApiError";
        this.problem = problem;
        // Fix prototype chain for instanceof checks
        Object.setPrototypeOf(this, ApiError.prototype);
    }
    get status(): number {
        return this.problem.status;
    }
    get title(): string {
        return this.problem.title;
    }
    get type(): string {
        return this.problem.type;
    }
    get detail(): string {
        return this.problem.detail;
    }
    get errors(): Record<string, string> {
        return this.problem.errors;
    }
}