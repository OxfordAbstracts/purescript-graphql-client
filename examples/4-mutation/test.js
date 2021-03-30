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
      console.info('logs', logs)
      deepStrictEqual(logs, ['[RED]', '1', '[GREEN]', '[GREEN]'])
      console.info('tests passed')
      process.exit(0)
    }, 400)
  } catch (err) {
    console.error('test error', err)
    process.exit(1)
  }
})

setTimeout(() => {
  console.error('Timeout')
  process.exit(1)
}, 60000)
