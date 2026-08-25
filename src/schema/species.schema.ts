const ReadSpeciesSchema = {
  $id: "species-read",
  title: "Species",
  description: "A species of bird",
  type: "object",
  properties: {
    speciesId: {
      type: "string",
    },
    family: {
      type: "string",
    },
    genus: {
      type: "string",
    },
    localeName: { type: "string" },
    lengthMin: { type: "number" },
    lengthMax: { type: "number" },
    weightMin: { type: "number" },
    weightMax: { type: "number" },
    wingspanMin: { type: "number" },
    wingspanMax: { type: "number" },
    habitats: {
      type: "array",
      items: {
        $ref: "habitat#",
      },
    },
  },
} as const;

const CreateSpeciesSchema = {
  $id: "species-create",
  title: "Species",
  description: "A species of bird",
  type: "object",
  properties: {
    speciesId: {
      type: "string",
    },
    family: {
      type: "string",
    },
    genus: {
      type: "string",
    },
    localeName: { type: "string" },
    lengthMin: { type: "number" },
    lengthMax: { type: "number" },
    weightMin: { type: "number" },
    weightMax: { type: "number" },
    wingspanMin: { type: "number" },
    wingspanMax: { type: "number" },
    habitats: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
} as const;

export { ReadSpeciesSchema, CreateSpeciesSchema };
