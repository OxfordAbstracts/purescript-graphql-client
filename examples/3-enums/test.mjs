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
import {main} from './output/Main/index.js'
serverFn(async () => {
  try {
    await gps()
    await exec('npm run build', { stdio: 'pipe', stderr: 'pipe' })
    main()
    setTimeout(() => {
      deepStrictEqual(logs, ['[RED]'])
      console.info('tests passed')
      process.exit(0)
    }, 250)
  } catch (err) {
    console.error('test error', err)
    process.exit(1)
  }
})

setTimeout(() => {
  console.error('Timeout')
  process.exit(1)
}, 60000)
