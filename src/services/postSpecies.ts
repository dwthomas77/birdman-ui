import type { Species } from "../types";
import type { ProblemDetailsResponse } from "../types";
import { ApiError } from "../classes";

// Async function to make a POST request
async function createPost(data: Species): Promise<Species> {
    const response = await fetch("http://localhost:3000/species", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (response.status >= 200 && response.status < 300) {
      const species: Species = await response.json();
      return species;
    }
    const problem: ProblemDetailsResponse = await response.json();
    throw new ApiError(problem);
}

export default createPost;