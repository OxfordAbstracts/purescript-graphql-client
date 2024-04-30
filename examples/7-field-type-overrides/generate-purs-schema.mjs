// In your code replace this line with the npm package:
// import { generateSchema } = from 'purescript-graphql-client'
import { generateSchema } from "../../codegen/schema/index.mjs";

export default () =>
  generateSchema({
    dir: "./src/generated",
    modulePath: ["Generated", "Gql", "Admin"],
    useNewtypesForRecords: false,
    url: "http://localhost:4892/graphql",
    fieldTypeOverrides: {
      Widget: {
        special_string: { moduleName: "DataTypes", typeName: "MyNewtype" },
      },
    },
  });
