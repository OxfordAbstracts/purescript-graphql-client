const { schemaFromGqlToPursJsHasura } = require('../../output/GraphQL.Client.CodeGen.Hasura')
const { schemasFromGqlToPursJs } = require('../../output/GraphQL.Client.CodeGen.SchemaFromGqlToPurs')
const fs = require('fs')
const { promisify } = require('util')
const write = promisify(fs.writeFile)

exports.writePursSchemas = (opts, gqlSchemas) => {
  const { parseError, result } =
    opts.isHasura
      ? schemaFromGqlToPursJsHasura(opts)(gqlSchemas)
      : schemasFromGqlToPursJs(opts)(gqlSchemas)

  if (parseError) {
    throw new Error(parseError)
  }

  const { schemas, enums, symbols } = result

  return Promise.all([...schemas, ...enums, symbols].map(({ path, code }) => write(path, code)))
}
