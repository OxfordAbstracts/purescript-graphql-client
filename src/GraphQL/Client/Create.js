require('isomorphic-unfetch')
const { createClient, defaultExchanges, subscriptionExchange } = require('@urql/core')
const { createClient: createWSClient } = require('graphql-ws')

const createClient_ = function (opts) {
  let wsClient = null

  if (opts.websocketUrl) {
    wsClient = createWSClient({
      url: opts.websocketUrl
    })
  }

  return createClient({
    url: opts.url,
    // fetchOptions: { headers: opts.headers },
    exchanges: defaultExchanges.concat(opts.websocketUrl ? [
      subscriptionExchange({
        forwardSubscription (operation) {
          return {
            subscribe: function (sink) {
              const dispose = wsClient.subscribe(operation, sink)
              return {
                unsubscribe: dispose
              }
            }
          }
        }
      })
    ] : [])
  })
}
let client

exports.createGlobalClientUnsafeImpl = function (opts) {
  return function () {
    if (client) {
      return client
    }
    client = createClient_(opts)

    return client
  }
}

exports.createClientImpl = function (opts) {
  return function () {
    return createClient_(opts)
  }
}

exports.createSubscriptionClientImpl = function (opts) {
  return function () {
    return createClient_(opts)
  }
}
