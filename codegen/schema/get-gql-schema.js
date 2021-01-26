const exec = require('exec-sh').promise

exports.getGqlSchema = async ({ moduleName, cache, url, token }) => {
  try {
    const cmd = `gq ${url} \\
    --introspect \\
    ${token ? `-H 'Authorization: Bearer ${token}'` : ''}`

    const { stdout: schema } = await exec(cmd, { stdio: 'pipe' })

    return { moduleName, cache, schema }
  } catch (err) {
    console.error('failed to get gql schema', err)
    throw (err)
  }
}
