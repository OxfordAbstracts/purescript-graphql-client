const { readdirSync } = require('fs')
const { promisify } = require('util')
const exec = require('exec-sh')
const { strictEqual, ok } = require('assert')
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
          try{
            ok(simplify(stderr, 0, 25).includes(simplify(expectedError, 4, 20)))
          }catch(e){
            console.log('stderr: \n', stderr)
            throw e
          }
          console.log(`test passed: ${p}`)
          toTest--
          if (toTest === 0) {
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

const simplify = (str, startLine, endLine) =>
  str
    .trim()
    .split('\n')
    .map(l => l.trim())
    .slice(startLine, endLine)
    .filter(l => l)
    .join('\n')
    .trim()

go()
