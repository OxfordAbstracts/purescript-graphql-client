const { writePursSchemas } = require('./write-purs-schema')
const { getGqlSchema } = require('./get-gql-schema')
const { promisify } = require('util')
const mkdirp = require('mkdirp')
const rm = promisify(require('rimraf'))

const generateSchemas = async (opts, gqlEndpoints) => {
  if (!Array.isArray(gqlEndpoints)) {
    gqlEndpoints = [gqlEndpoints]
  }
  await rm(opts.dir)
  await mkdirp(opts.dir)
  await mkdirp(opts.dir + '/Schema')
  await mkdirp(opts.dir + '/Enum')
  await mkdirp(opts.dir + '/Directives')
  const schemas = await Promise.all(gqlEndpoints.map(getGqlSchema))

  return await writePursSchemas(opts, schemas)
}

const generateSchema = (opts) => {
  const { modulePath, url } = opts
  const moduleName = modulePath[modulePath.length - 1]

  return generateSchemas({ ...opts, modulePath: modulePath.slice(0, -1) }, [{ moduleName, url }])
}

module.exports = {
  generateSchema,
  generateSchemas
}
