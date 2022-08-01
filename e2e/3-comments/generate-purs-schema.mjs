// In your code replace this line with the npm package:
// const { generateSchemas } = require('purescript-graphql-client')
import { generateSchemas } from '../../codegen/schema/index.mjs'

export default () =>
  generateSchemas({
    dir: './src/generated',
    modulePath: ['Generated', 'Gql'],
    useNewtypesForRecords: true
  }, [
    {
      url: 'http://localhost:4000/graphql',
      moduleName: 'Admin'
    }
  ])
