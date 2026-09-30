import type { ProblemDetailsResponse, User, UserRequest } from "../types";
import { ApiError } from "../classes";

async function updateUser(data: UserRequest, userId: string): Promise<User> {
  const response = await fetch(`http://localhost:3000/users/${userId}`, {
    method: "PUT",
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

export default updateUser;
