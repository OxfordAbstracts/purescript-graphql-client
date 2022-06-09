const { schemasFromGqlToPursJs } = require('../../gen-schema-bundled.js')
const fs = require('fs')
const { promisify } = require('util')
const getDirName = require('path').dirname;

const writeFileRec =  promisify((path, contents, cb) => {
  fs.mkdir(getDirName(path), { recursive: true}, function (err) {
    if (err) return cb(err);

    fs.writeFile(path, contents, cb);
  });
})

exports.writePursSchemas = async (opts, gqlSchemas) => {
  const { argsTypeError, parseError, result } =
    await schemasFromGqlToPursJs(opts, gqlSchemas)()

  if (argsTypeError) {
    throw new Error(argsTypeError)
  }

  if (parseError) {
    throw new Error(parseError)
  }

  const { schemas, enums, symbols } = result

  await Promise.all([...schemas, ...enums, symbols].map(({ path, code }) => writeFileRec(path, code)))

  return result
}
