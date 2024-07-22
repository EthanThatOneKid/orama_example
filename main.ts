import type { ExtractSchema } from "@orama/orama";
import { create, insert, search } from "@orama/orama";
import CLASS_DATA from "./classes.json" with { type: "json" };
import PROPERTY_DATA from "./properties.json" with { type: "json" };

export type PropertyDocument = ExtractSchema<typeof PROPERTY_SCHEMA>;

export const PROPERTY_SCHEMA = {
  schema: {
    itemID: "string",
    label: "string",
    comment: "string",
  },
} as const;

export type ClassDocument = ExtractSchema<typeof CLASS_SCHEMA>;

export const CLASS_SCHEMA = {
  schema: {
    ...PROPERTY_SCHEMA.schema,
    properties: "string[]",
  },
} as const;

const propertyDb = await create(PROPERTY_SCHEMA);
for (const doc of PROPERTY_DATA) {
  await insert(propertyDb, doc as never);
}

const classDb = await create(CLASS_SCHEMA);
for (const doc of CLASS_DATA) {
  await insert(classDb, doc as never);
}

const propertyResult = await search(
  propertyDb,
  { term: "movie" },
);
const classResult = await search(
  classDb,
  { term: "movie" },
);

console.log({ propertyResult, classResult });
