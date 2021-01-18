const JWT = require('jsonwebtoken');
const execSh = require('exec-sh').promise;

exports.getGqlSchema = async ({ moduleName, url, bearerToken }) => {
  
  const cmd = `gq ${url} \\
      --introspect \\
      -H 'Authorization: Bearer ${bearerToken}'`;

  const {stdout: gql} = await execSh(cmd, { stdio: 'pipe' });

  return { moduleName, gql };
};
