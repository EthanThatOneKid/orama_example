import { create, insert, search } from "@orama/orama";
import PROPERTY_DATA from "./properties.json" with { type: "json" };

const db = await create({
  schema: {
    itemID: "string",
    label: "string",
    comment: "string",
  },
});

for (const doc of PROPERTY_DATA) {
  await insert(db, doc as never);
}

const searchResult = await search(db, {
  term: "movie",
});
console.log(searchResult);

// TODO: Separate example searching for classes.
