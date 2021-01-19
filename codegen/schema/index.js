const { writePursSchemas } = require('./write-purs-schema')
const { getGqlSchema } = require('./get-gql-schema')

exports.generateSchemas = async (opts, gqlEndpoints) => {
  if (!Array.isArray(gqlEndpoints)) {
    gqlEndpoints = [gqlEndpoints]
  }

  const schemas = await Promise.all(gqlEndpoints.map(getGqlSchema))

  await writePursSchemas(opts, schemas)
}
