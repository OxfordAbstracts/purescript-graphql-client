import { setupServer } from "msw/node";
import { graphql, HttpResponse } from "msw";
import { graphql as executeGraphql, buildSchema } from "graphql";

export const setupMswImpl = (schemaText) => (rootValue) => () => {
  const schema = buildSchema(schemaText);
  const server = setupServer(
    graphql.operation(async ({ query, variables }) => {
      const { data, errors } = await executeGraphql({
        schema,
        source: query,
        variableValues: variables,
        rootValue,
      });

      return HttpResponse.json({ errors, data });
    }),
  );
  server.listen();
};
