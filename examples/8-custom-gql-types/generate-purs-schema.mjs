// In your code replace this line with the npm package:
// import { generateSchema } = from 'purescript-graphql-client'
import { generateSchema } from "../../codegen/schema/index.mjs";

export default () =>
  generateSchema({
    dir: "./src/generated",
    modulePath: ["Generated", "Gql", "Admin"],
    useNewtypesForRecords: false,
    url: "http://localhost:4892/graphql",
    gqlToPursTypes: {
      GqlTypeThatIsAString: { typeName: "String", moduleName: "" },
      GqlTypeThatIsAnInt: { typeName: "Int", moduleName: "" },
    },
  });
