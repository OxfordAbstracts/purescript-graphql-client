import serverFn from "./server-fn.js";
serverFn(() => {
  console.info("Running a GraphQL API server at http://localhost:4892/graphql");
});
