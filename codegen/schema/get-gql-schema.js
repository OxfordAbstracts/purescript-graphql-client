const fetch = require('node-fetch')
const {
  getIntrospectionQuery,
  printSchema,
  buildClientSchema
} = require('graphql')

exports.getGqlSchema = async ({ moduleName, cache, url, token }) => {
  try {
    const introspectionQuery = getIntrospectionQuery()

    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query: introspectionQuery })
      }
    )

    const { data } = await response.json()

    const schema = printSchema(buildClientSchema(data))

    return { moduleName, cache, schema }
  } catch (err) {
    console.error('failed to get gql schema', err)
    throw (err)
  }
}
