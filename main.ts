import type { ExtractSchema, Orama } from "@orama/orama";
import { create, insert, search } from "@orama/orama";
import { createRouter } from "@fartlabs/rt";
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

async function handleSearch<T>(url: URL, db: Orama<T>): Promise<Response> {
  const term = url.searchParams.get("term");
  if (!term) {
    return new Response("Missing term", { status: 400 });
  }

  const searchResult = await search(db, { term });
  return new Response(
    JSON.stringify(searchResult),
    {
      headers: { "content-type": "application/json" },
    },
  );
}

const router = createRouter()
  .get("/properties", (ctx) => handleSearch(ctx.url, propertyDb))
  .get("/classes", (ctx) => handleSearch(ctx.url, classDb));

if (import.meta.main) {
  Deno.serve((request) => router.fetch(request));
}
