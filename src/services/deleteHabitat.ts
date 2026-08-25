import type { ProblemDetailsResponse } from "../types";
import { ApiError } from "../classes";

// Async function to make a DELETE request
async function deletePost(habitatId: string): Promise<string> {
    const response = await fetch(`http://localhost:3000/habitats/${habitatId}`, {
      method: "DELETE",
    });
    
    if (response.status >= 200 && response.status < 300) {
        return "Successfully deleted habitat with id: " + habitatId;
    }
    const problem: ProblemDetailsResponse = await response.json();
    console.log('throwing this error')
    console.log(problem)
    throw new ApiError(problem);
}

export default deletePost;