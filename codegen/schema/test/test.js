require('env2')('./.env')
const { promisify } = require('util')
const mkdirp = require('mkdirp')
const rm = promisify(require('rimraf'))

const generateSchemas = require('../index.js')

const dir = 'src/test-output'

const go = async () => {
  try {
    console.log('removing dirs')
    await rm(dir)
    console.log('makings dirs')
    await mkdirp(dir)
    await mkdirp(dir + '/Schema')
    await mkdirp(dir + '/Enum')
    console.log('generating schema')
    await generateSchemas({
      dir,
      externalTypes: {},
      fieldTypeOverrides: require('./outside-types'),
      modulePath: ['Generated', 'Gql'],
      isHasura: true
    }, require('./gql-endpoints'))
    console.log('test done')
  } catch (err) {
    console.error(err)
  }
}
go()
