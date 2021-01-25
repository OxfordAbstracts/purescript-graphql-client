const { readdirSync } = require('fs')
const {promisify} = require('util')
const exec = promisify(require("exec-sh"))

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const go = async () => {

    const packages = getDirectories('./examples');

    for(let package of packages){
        console.log(`Testing ${package}`);
        await exec(`cd "./examples/${package}" && npm t`)
    }
}

go()