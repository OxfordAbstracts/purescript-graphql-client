// In your code replace this line with the npm package:
// const { generateSchema } = require('purescript-graphql-client')
import { generateSchema } from '../../codegen/schema/index.mjs'

export default () =>
  generateSchema({
    dir: './src/generated',
    modulePath: ['Generated', 'Gql', 'Admin'],
    useNewtypesForRecords: false,
    url: 'http://localhost:4000/graphql'
  })
