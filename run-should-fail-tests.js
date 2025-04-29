import { readdirSync } from 'fs'
import { readFile } from 'fs/promises'
import execSh from 'exec-sh'
const { promise: exec } = execSh

import { ok } from 'assert'

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const go = async () => {
  const packages = getDirectories('./should-fail-tests')
  let toTest = packages.length

  for (const p of packages) {
    const expectedError = (await readFile(`./should-fail-tests/${p}/expected-error.txt`)).toString()

    try {
      console.log(`testing: ${p}`)

      await exec(`cd "./should-fail-tests/${p}" && spago install`, true)
      await exec(`cd "./should-fail-tests/${p}" && spago build`, true)

      console.error(`${p} compiled. Test failed`)
      process.exit(1)
    } catch (err) {
      const { stderr } = err
      try {
        ok(simplify(stderr, 0, 100).includes(simplify(expectedError, 4, 20)))
      } catch (e) {
        console.log('stderr: \n', stderr)
        console.info('simplified error', simplify(stderr, 0, 100))
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
