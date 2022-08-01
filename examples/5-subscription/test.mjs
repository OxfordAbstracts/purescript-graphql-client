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
serverFn(async () => {
  try {
    await gps()
    await exec('npm run build', { stdio: 'pipe', stderr: 'pipe' })
    const { main } = await import('./output/Main/index.js')

    main()
    setTimeout(() => {
      deepStrictEqual(logs, [
        'Event recieved',
        '(Right { postAdded: { author: "joe bloggs", comment: "great" } })',
        'Event recieved',
        '(Right { postAdded: { author: "joe bloggs", comment: "bad" } })'
      ])
      console.info('tests passed')
      process.exit(0)
    }, 500)
  } catch (err) {
    console.error('test error', err)
    process.exit(1)
  }
})

setTimeout(() => {
  console.error('Timeout')
  process.exit(1)
}, 60000)
