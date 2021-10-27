// run a command in every e2e, example and should-fail-test folder.
// Useful for installing or uninstalling packages

const { readdirSync } = require('fs')

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const exec = require('exec-sh')

const go = async () => {
  await Promise.all(getDirectories('./e2e').map((dir) => {
    return exec(`cd e2e/${dir} && ${process.env.CMD}`)
  }))
  await Promise.all(getDirectories('./examples').map((dir) => {
    return exec(`cd examples/${dir} && ${process.env.CMD}`)
  }))
  await Promise.all(getDirectories('./should-fail-tests').map((dir) => {
    return exec(`cd should-fail-tests/${dir} && ${process.env.CMD}`)
  }))
}
go()
