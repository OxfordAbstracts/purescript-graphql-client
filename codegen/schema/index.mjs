const { writePursSchemas } = require('./write-purs-schema.mjs')
const { getGqlSchema } = require('./get-gql-schema.mjs')
const { promisify } = require('util')
import mkdirp from 'mkdirp';

const rm = promisify(require('rimraf'))

export async function generateSchemas  (opts, gqlEndpoints) {
  if (!Array.isArray(gqlEndpoints)) {
    gqlEndpoints = [gqlEndpoints]
  }
  await rm(opts.dir)
  await mkdirp(opts.dir)
  await mkdirp(opts.dir + '/Schema')
  const schemas = await Promise.all(gqlEndpoints.map(getGqlSchema))

  return await writePursSchemas(opts, schemas)
}

export async function generateSchema (opts) {
  const { modulePath, url } = opts
  const moduleName = modulePath[modulePath.length - 1]

  return generateSchemas({ ...opts, modulePath: modulePath.slice(0, -1) }, [{ moduleName, url }])
}