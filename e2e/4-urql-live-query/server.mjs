import serverFn from './server-fn.mjs'
serverFn(() => {
  console.info('Running a GraphQL API server at http://localhost:4000/graphql')
})
