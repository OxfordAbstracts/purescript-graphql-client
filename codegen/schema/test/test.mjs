require('env2')('./.env')
const { get, set } = require('./cache')

const generateSchemas = require('../index.js')

const dir = '../src/test-output'

const go = async () => {
  try {
    await generateSchemas({
      dir,
      externalTypes: {},
      fieldTypeOverrides: require('./outside-types'),
      modulePath: ['Generated', 'Gql'],
      cache: { get, set }
    }, require('./gql-endpoints'))
    console.log('test done')
  } catch (err) {
    console.error(err)
    throw err
  }
}
go()
