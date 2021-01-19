const execSh = require('exec-sh').promise

exports.getGqlSchema = async ({ moduleName, url, token }) => {
  try {
    const cmd = `gq ${url} \\
    --introspect \\
    ${token ? `-H 'Authorization: Bearer ${token}'` : ''}`

    const { stdout: gql } = await execSh(cmd, { stdio: 'pipe' })

    return { moduleName, gql }
  } catch (err) {
    console.error('failed to get gql schema', err)
    throw (err)
  }
}
