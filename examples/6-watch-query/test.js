const { deepStrictEqual } = require('assert')
const exec = require('exec-sh').promise
const logs = []

console.log = (log) => {
  console.info(log)
  logs.push(log)
}

require('./server-fn')(async () => {
  try {
    await require('./generate-purs-schema')()
    await exec('npm run build', { stdio: 'pipe', stderr: 'pipe' })
    require('./output/Main').main()
    setTimeout(() => {
      deepStrictEqual(logs, [
        'Event recieved',
        '(Right { posts: [{ author: "author 1", comment: "comment 1" },{ author: "author 2", comment: "comment 2" }] })',
        'Event recieved',
        '(Right { posts: [{ author: "author 1", comment: "comment 1" },{ author: "author 2", comment: "comment 2" },{ author: "joe bloggs", comment: "good" }] })'
      ])
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
