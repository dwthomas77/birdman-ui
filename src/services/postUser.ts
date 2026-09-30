import type { ProblemDetailsResponse, User, UserRequest } from "../types";
import { ApiError } from "../classes";

async function createUser(data: UserRequest): Promise<User> {
  const response = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response.json() as Promise<User>;
  }

  const problem: ProblemDetailsResponse = await response.json();
  throw new ApiError(problem);
}

export default createUser;
