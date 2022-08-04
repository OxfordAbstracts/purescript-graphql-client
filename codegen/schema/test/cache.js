const fs = require('fs')
const { promisify } = require('util')
const write = promisify(fs.writeFile)
const read = promisify(fs.readFile)
import mkdirp from 'mkdirp';


mkdirp('./cache')

exports.set = async ({ key, val }) =>
  write(fileName(key), JSON.stringify(val))

exports.get = async (key) => {
  try {
    const json = (await read(fileName(key))).toString()
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

const fileName = key => `./cache/${hash(key)}`

const hash = key => crypto
  .createHash('md5')
  .update(JSON.stringify(key))
  .digest('hex')
