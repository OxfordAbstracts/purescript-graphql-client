import { setupServer } from "msw/node";
import { graphql, HttpResponse } from "msw";
import { graphql as executeGraphql, buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    prop: String
    widgets(id: Int): [Widget!]!
  }

  type Widget {
    id: Int
    name: String!
  }
`);

const widgets = [
  { id: 1, name: "one" },
  { id: 2, name: "two" },
];

const handlers = [
  graphql.operation(async ({ query, variables }) => {
    const { data, errors } = await executeGraphql({
      schema,
      source: query,
      variableValues: variables,
      rootValue: {
        prop: () => {
          return "Hello world!";
        },
        widgets: ({ id }) => widgets.filter((w) => !id || id === w.id),
      },
    });

    return HttpResponse.json({ errors, data });
  }),
];

export function setupMsw() {
  const server = setupServer(...handlers);
  server.listen();
}
