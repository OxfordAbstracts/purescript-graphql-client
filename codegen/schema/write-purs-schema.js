const { schemaFromGqlToPursForeignHasura } = require('../../output/GraphQL.Client.CodeGen.Hasura')
const { schemasFromGqlToPursForeign } = require('../../output/GraphQL.Client.CodeGen.SchemaFromGqlToPurs')
const fs = require('fs')
const { promisify } = require('util')
const write = promisify(fs.writeFile)

exports.writePursSchemas = (opts, gqlSchemas) => {
  const { argsTypeError, parseError, result } =
    opts.isHasura
      ? schemaFromGqlToPursForeignHasura(opts)(gqlSchemas)
      : schemasFromGqlToPursForeign(opts)(gqlSchemas)

  if (argsTypeError) {
    throw new Error(argsTypeError)
  }

  if (parseError) {
    throw new Error(parseError)
  }

  const { schemas, enums, symbols } = result

  return Promise.all([...schemas, ...enums, symbols].map(({ path, code }) => write(path, code)))
}
