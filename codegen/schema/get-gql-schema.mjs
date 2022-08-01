import fetch from 'node-fetch';
import {
  getIntrospectionQuery,
  printSchema,
  buildClientSchema
} from 'graphql';

export async function getGqlSchema ({ moduleName, cache, url, token }) {
  try {
    const introspectionQuery = getIntrospectionQuery()

    const response = await fetch(
      url,
      {
        method: 'POST',
        headers:
          token
            ? {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            : {
                'Content-Type': 'application/json'
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
