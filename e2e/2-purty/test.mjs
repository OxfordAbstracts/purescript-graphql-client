import execSh from 'exec-sh';
const {promise: exec} = execSh;
import { writePursSchemas } from '../../codegen/schema/write-purs-schema.mjs';
import mkdirp from 'mkdirp';
import { main } from './output/Main/index.js';


const go = async () => {
  try {
    await mkdirp('./src/generated/Schema')
    await mkdirp('./src/generated/Directives')
    await writePursSchemas({
      dir: './src/generated',
      modulePath: ['Generated', 'Gql'],
      useNewtypesForRecords: true
    }, [
      {
        moduleName: 'Admin',
        schema: '# Exposes a URL that specifies the behaviour of this scalar.\n' +
          'directive @specifiedBy(\n' +
          '  # The URL that specifies the behaviour of this scalar.\n' +
          '  url: String!\n' +
          ') on SCALAR\n' +
          '\n' +
          'type Query {\n' +
          '  prop: String\n' +
          '\n' +
          '  "This comment should not break on purty formatting"\n' +
          '  widgets(opts: WidgetInput): [Widget!]!\n' +
          '}\n' +

          '\n"""widget description"""' +
          'type Widget {\n' +
          '  id: Int\n' +
          '\n' +
          '  "This comment should not break on purty formatting"\n' +
          '  name: String!\n' +
          '}\n' +
          '\n' +
          'input WidgetInput {\n' +
          '  id: Int\n' +
          '\n' +
          '  "This comment should not break on purty formatting"\n' +
          '  int: Int!\n' +
          '}\n' +
          '\n'
      }
    ])
    await exec('npm run format', { stdio: 'pipe', stderr: 'pipe' })
    await exec('npm run format', { stdio: 'pipe', stderr: 'pipe' })
    await exec('npm run build', { stdio: 'pipe', stderr: 'pipe' })
    main();
    process.exit(0)
  } catch (err) {
    console.error('test error', err)
    process.exit(1)
  }
}
go()

setTimeout(() => {
  console.error('Timeout')
  process.exit(1)
}, 60000)
