const { deepStrictEqual } = require('assert')
const logs = []

console.log = (log) => {
  console.info(log)
  logs.push(log)
}

require('./server-fn')(require('./output/Main').main)

setTimeout(() => {
  deepStrictEqual(logs, [
    '["one"]',
    '(Right { widgets: [{ name: "one" }] })',
    'false',
    'false'
  ])
  console.info('tests passed')
  process.exit(0)
}, 250)
