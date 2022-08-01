import { deepStrictEqual } from 'assert'
import execSh from 'exec-sh';
const {promise: exec} = execSh;

const logs = []

console.log = (log) => {
  console.info(log)
  logs.push(log)
}

import serverFn from './server-fn.js'
serverFn(async () => {
  try {
    import gps from './generate-purs-schema.js'
    await gps()
    await exec('npm run build', { stdio: 'pipe', stderr: 'pipe' })
    require('./output/Main').main()
    setTimeout(() => {
      deepStrictEqual(logs, [
        'Event recieved',
        '(Right { posts: [{ author: "author 1", comment: "comment 1" },{ author: "author 2", comment: "comment 2" }] })',
        'updating cache',
        'Event recieved',
        '(Right { posts: [{ author: "author 1", comment: "comment 1" },{ author: "author 2", comment: "comment 2" },{ author: "joe bloggs", comment: "good" }] })',
        'updating cache'
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
