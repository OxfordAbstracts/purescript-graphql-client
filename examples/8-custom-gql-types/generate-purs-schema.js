// In your code replace this line with the npm package:
// const { generateSchema } = require('purescript-graphql-client')
const { generateSchema } = require('../../codegen/schema')

module.exports = () =>
  generateSchema({
    dir: './src/generated',
    modulePath: ['Generated', 'Gql', 'Admin'],
    useNewtypesForRecords: false,
    url: 'http://localhost:4000/graphql',
    gqlToPursTypes: {
      GqlTypeThatIsAString: 'String',
      GqlTypeThatIsAnInt: 'Int'
    }
  })
