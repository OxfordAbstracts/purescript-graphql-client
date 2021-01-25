const { schemaFromGqlToPursForeignHasura } = require('../../gen-schema-bundled.js')
const fs = require('fs')
const { promisify } = require('util')
const write = promisify(fs.writeFile)

exports.writePursSchemas = async (opts, gqlSchemas) => {
  const { argsTypeError, parseError, result } =
    await schemaFromGqlToPursForeignHasura(opts)(gqlSchemas)()

  if (argsTypeError) {
    throw new Error(argsTypeError)
  }

  if (parseError) {
    throw new Error(parseError)
  }

  const { schemas, enums, symbols } = result

  return await Promise.all([...schemas, ...enums, symbols].map(({ path, code }) => write(path, code)))
}
