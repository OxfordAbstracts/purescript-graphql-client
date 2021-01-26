// In your code replace this line with the npm package:
// const generateSchemas = require('purescript-graphql-client')
const generateSchemas = require('../../codegen/schema')

module.exports = () =>
  generateSchemas({
    dir: './src/generated',
    modulePath: ['Generated', 'Gql'],
    useNewtypesForRecords: false
  }, [
    {
      url: 'http://localhost:4000/graphql',
      moduleName: 'Admin'
    }
  ])
