const { readdirSync } = require('fs')
const { promisify } = require('util')
const exec = require('exec-sh')
const { strictEqual } = require('assert')
const read = promisify(require('fs').readFile)

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const go = async () => {
  const packages = getDirectories('./should-fail-tests')
  let toTest = packages.length

  for (const p of packages) {
    try {
      const expectedError = (await read(`./should-fail-tests/${p}/expected-error.txt`)).toString()
      exec(`cd "./should-fail-tests/${p}" && spago build`, true,
        (_, _1, stderr) => {
          console.log(`testing: ${p}`)
          strictEqual(stderr.slice(0, 300), expectedError.slice(0, 300))
          console.log(`test passed: ${p}`)
          toTest--
          if(toTest === 0){
            console.log('all tests passed')
            process.exit(0)
          }
        })

    } catch (e) {
      console.log('error!', e)
      process.exit(1)
    }
  }
}

go()
