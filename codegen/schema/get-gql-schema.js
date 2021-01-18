const JWT = require('jsonwebtoken');
const execSh = require('exec-sh').promise;

exports.getGqlSchema = async ({ session }) => {
  
  const cmd = `gq ${process.env.GQL_URL} \\
      --introspect \\
      -H 'Authorization: Bearer ${session}'`;

  const {stdout: gql} = await execSh(cmd, { stdio: 'pipe' });

  return { app, gql };
};
