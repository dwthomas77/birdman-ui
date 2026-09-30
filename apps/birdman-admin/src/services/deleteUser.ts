import type { ProblemDetailsResponse } from "../types";
import { ApiError } from "../classes";

async function deleteUser(userId: string): Promise<string> {
  const response = await fetch(`http://localhost:3000/users/${userId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    return `Successfully deleted user with id: ${userId}`;
  }

  const problem: ProblemDetailsResponse = await response.json();
  throw new ApiError(problem);
}

export default deleteUser;
