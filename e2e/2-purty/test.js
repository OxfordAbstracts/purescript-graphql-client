const exec = require('exec-sh').promise

require('./server-fn')(async () => {
  try {
    await require('./generate-purs-schema')()
    await exec('npm run format', { stdio: 'pipe', stderr: 'pipe' })
    await exec('npm run build', { stdio: 'pipe', stderr: 'pipe' })
    require('./output/Main').main()
    process.exit(0)
  } catch (err) {
    console.error('test error', err)
    process.exit(1)
  }
})

setTimeout(() => {
  console.error('Timeout')
  process.exit(1)
}, 60000)
