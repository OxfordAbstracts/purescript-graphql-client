import { writePursSchemas } from './write-purs-schema.mjs'
import { getGqlSchema } from './get-gql-schema.mjs'
import { promisify } from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
const rm = promisify(rimraf)

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