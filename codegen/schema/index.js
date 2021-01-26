const { writePursSchemas } = require('./write-purs-schema')
const { getGqlSchema } = require('./get-gql-schema')
const { promisify } = require('util')
const mkdirp = require('mkdirp')
const rm = promisify(require('rimraf'))

module.exports = async (opts, gqlEndpoints) => {
  if (!Array.isArray(gqlEndpoints)) {
    gqlEndpoints = [gqlEndpoints]
  }
  await rm(opts.dir)
  await mkdirp(opts.dir)
  await mkdirp(opts.dir + '/Schema')
  await mkdirp(opts.dir + '/Enum')
  const schemas = await Promise.all(gqlEndpoints.map(getGqlSchema))

  return await writePursSchemas(opts, schemas)
}
