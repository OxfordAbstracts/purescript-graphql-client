require('./server-fn')((listener) => {
  // console.log('listener.route()', listener.route())
  console.log('listener', listener)
  console.log('listener.address()', listener.address())

  console.info(`Running a GraphQL API server at http://localhost:${listener.address().port}/graphql`)
})
