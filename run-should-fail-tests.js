const { readdirSync } = require('fs')
const { promisify } = require('util')
const exec = require('exec-sh').promise
const { ok } = require('assert')
const read = promisify(require('fs').readFile)

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const go = async () => {
  const packages = getDirectories('./should-fail-tests')
  let toTest = packages.length

  for (const p of packages) {
    const expectedError = (await read(`./should-fail-tests/${p}/expected-error.txt`)).toString()

    try {
      console.log(`testing: ${p}`)

      await exec(`cd "./should-fail-tests/${p}" && spago install`, true)
      await exec(`cd "./should-fail-tests/${p}" && spago build --no-install`, true)

      console.error(`${p} compiled. Test failed`)
      process.exit(1)
    } catch (err) {
      const { stderr } = err
      try {
        ok(simplify(stderr, 0, 100).includes(simplify(expectedError, 4, 20)))
      } catch (e) {
        console.log('stderr: \n', stderr)
        throw e
      }
      console.log(`test passed: ${p}`)
      toTest--
      if (toTest === 0) {
        console.log('all tests passed')
        process.exit(0)
      }
    }
  }
}

const simplify = (str, startLine, endLine) =>
  str
    .trim()
    .split('\n')
    .map(l => l.trim())
    .filter(l => l)
    .filter(l => !l.includes('Compiling '))
    .slice(startLine, endLine)
    .join('\n')
    .trim()

go()
