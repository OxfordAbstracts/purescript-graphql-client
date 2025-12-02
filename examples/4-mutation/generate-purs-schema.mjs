// In your code replace this line with the npm package:
// import { generateSchemas } from 'purescript-graphql-client'
import { generateSchemas } from "../../codegen/schema/index.mjs";

export default () =>
  generateSchemas(
    {
      dir: "./src/generated",
      modulePath: ["Generated", "Gql"],
      useNewtypesForRecords: false,
    },
    [
      {
        url: "http://localhost:4892/graphql",
        moduleName: "Admin",
      },
    ],
  );
