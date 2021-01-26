const { readdirSync } = require('fs')
const { promisify } = require('util')
const exec = require('exec-sh')
const assert = require('assert')
const read = promisify(require('fs').readFile)

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const go = async () => {
  const packages = getDirectories('./should-fail-tests')

  for (const p of packages) {
    console.log(`Testing ${p}`)
    try {
      const expectedError = (await read(`./should-fail-tests/${p}/expected-error.txt`))
      exec(`cd "./should-fail-tests/${p}" && spago build`, true,
        (_, _1, stderr) => {
          console.log(`testing: ${p}`)
          assert.strictEqual(stderr.includes(expectedError), true)
          console.log(`test passed: ${p}`)
        })
    } catch (e) {
      console.log('error!', e)
      process.exit(1)
    }
  }
}

go()
