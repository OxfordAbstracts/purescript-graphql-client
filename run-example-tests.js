const { readdirSync } = require('fs')
const { promisify } = require('util')
const exec = promisify(require('exec-sh'))

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const go = async () => {
  const e2e = getDirectories('./e2e')

  for (const p of e2e) {
    console.log(`Testing ${p}`)
    try {
      await exec(`cd "./e2e/${p}" && npm t`)
    } catch (err) {
      console.error(`Test threw error: ${p}`)
      process.exit(1)
    }
  }

  const examples = getDirectories('./examples')

  for (const p of examples) {
    console.log(`Testing ${p}`)
    try {
      await exec(`cd "./examples/${p}" && npm t`)
    } catch (err) {
      console.error(`Test threw error: ${p}`)
      process.exit(1)
    }
  }
}

go()
