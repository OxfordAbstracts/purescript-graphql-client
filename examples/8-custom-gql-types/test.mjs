import { deepStrictEqual } from 'assert'
import execSh from 'exec-sh';
const {promise: exec} = execSh;

const logs = []

console.log = (log) => {
  console.info(log)
  logs.push(log)
}

import serverFn from './server-fn.js'
import gps from './generate-purs-schema.mjs'
import { handleTestError } from '../handle-test-error.js';
serverFn(async () => {
  try {
    await gps()
    await exec('npm run build', { stdio: 'pipe' })
    const { main } = await import('./output/Main/index.js')

    main()
    setTimeout(() => {
      deepStrictEqual(logs, ['["one"]'])
      console.info('tests passed')
      process.exit(0)
    }, 500)
  } catch (err) {
    handleTestError(err)
    process.exit(1)
  }
})

setTimeout(() => {
  console.error('Timeout')
  process.exit(1)
}, 60000)
