module.exports = (onListening) => {
  const express = require("express");
  const { graphqlHTTP } = require("express-graphql");
  const { buildSchema } = require("graphql");

  const schema = buildSchema(`
    type Query {
        prop: String
        widgets(id: Int): [Widget!]!
    }

    type Widget {
        id: Int
        name: String!
        contains_bad_type: BadType
    }

    type BadType {
      id: Int!
      incorrect_type: Int!
    }
    `);

  const root = {
    prop: () => {
      return "Hello world!";
    },
    widgets: ({ id }) => widgets.filter((w) => !id || id === w.id),
  };

  const contains_bad_type = {
    id: 1,
    incorrect_type: () => {
      throw new Error("OOOPS!");
    },
  };

  const widgets = [
    { id: 1, name: "one", contains_bad_type },
    { id: 2, name: "two", contains_bad_type },
  ];

  const app = express();

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );

  app.listen(4892, onListening);
};
