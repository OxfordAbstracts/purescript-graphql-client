module.exports = (onListening) => {
  const express = require("express");
  const { graphqlHTTP } = require("express-graphql");
  const { buildSchema } = require("graphql");

  const schema = buildSchema(`
    type Query {
        character(id: Int): Character!
    }

    type Human {
      id: Int!
      name: String!
      height: Float!
    }

    type Droid {
      id: Int!
      name: String!
      primaryFunction: String!
    }

    union Character = Human | Droid
    `);

  const root = {
    character: ({ id }) => {
      if (id === 1) {
        return {
          __typename: "Human",
          name: "Han Solo",
          height: 1.8,
          id: 1,
        };
      } else {
        return {
          __typename: "Droid",
          name: "R2D2",
          height: 0.5,
          id: 2,
        };
      }
    },
  };

  const app = express();

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    }),
  );

  app.listen(4892, onListening);
};
