const { readdirSync } = require('fs')
const { promisify } = require('util')
const exec = promisify(require('exec-sh'))

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const go = async () => {
  const packages = getDirectories('./examples')

  for (const p of packages) {
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
