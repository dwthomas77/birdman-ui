import type { Habitat } from "../types";
import type { ProblemDetailsResponse } from "../types";
import { ApiError } from "../classes";

// Async function to make a PUT request
async function createPut(data: Habitat, habitatId: string): Promise<Habitat> {
    const response = await fetch(`http://localhost:3000/habitats/${habitatId}`, {
      method: "PUT",
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

export default createPut;