const JWT = require('jsonwebtoken')
const { get, set } = require('./cache')

const getToken = app => JWT.sign(
  {
    'X-Hasura-Allowed-Roles': [app],
    'X-Hasura-Default-Role': app
  }, process.env.JWT_SECRET)

module.exports = [
  {
    url: 'http://localhost:8080/v1/graphql',
    moduleName: 'ProgramPublic',
    token: getToken('ProgramPublic'),
    cache: { get, set }
  }
]
