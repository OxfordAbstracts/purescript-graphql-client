const { readdirSync } = require('fs')
const {promisify} = require('util')
const exec = promisify(require("exec-sh"))

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const go = async () => {

    const packages = getDirectories('./examples');

    console.log(packages)

    for(let package of packages){
        await exec(`cd "./examples/${package}" && npm t`)
    }
}

go()