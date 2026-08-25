import type { Habitat } from "../types";
import type { ProblemDetailsResponse } from "../types";
import { ApiError } from "../classes";

// Async function to make a POST request
async function createPost(data: Habitat): Promise<Habitat> {
    const response = await fetch("http://localhost:3000/habitats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (response.status >= 200 && response.status < 300) {
      const habitat: Habitat = await response.json();
      return habitat;
    }
    const problem: ProblemDetailsResponse = await response.json();
    throw new ApiError(problem);
}

export default createPost;