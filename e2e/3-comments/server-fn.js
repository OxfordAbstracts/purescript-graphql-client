
module.exports = (onListening) => {
  const express = require('express')
  const { graphqlHTTP } = require('express-graphql')
  const { buildSchema } = require('graphql')

  const schema = buildSchema(`
    type Query {
        prop: String
        widgets(colour: Colour): [Widget!]!
        character: Character!
    }
    #Comment here
    type Widget {
        id: Int
        name: String!
        colour: Colour!
    }
    "colour description"
    enum Colour {
      "red description"
      RED
      GREEN
      BLUE
      yellow
    }

    type Human {
      name: String!
      height: Float!
    }

    type Droid {
      name: String!
      primaryFunction: String!
    }

    union Character = Human | Droid

    `)

  const root = {
    prop: () => {
      return 'Hello world!'
    },
    widgets: ({ colour }) =>
      widgets.filter(w => !colour || colour === w.colour),
    character: () => { return {
      __typename: "Human",
      name: "Han Solo",
      height: 1.8,
    }},
  }

  const widgets = [
    { id: 1, name: 'one', colour: 'RED' },
    { id: 2, name: 'two', colour: 'GREEN' }
  ]

  const app = express()

  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  }))

  app.listen(4000, onListening)
}
