require('isomorphic-unfetch')
const { createClient, defaultExchanges, gql, subscriptionExchange } = require('@urql/core')
const { createClient: createWSClient } = require('graphql-ws')

let client = null
let wsClient = null

exports.createClientImpl = function (opts) {
  return function () {
    if (client) {
      return client
    }
    if (opts.websocketUrl) {
      wsClient = createWSClient({
        url: opts.websocketUrl
      })
    }

    client = createClient({
      url: opts.url,
      fetchOptions: { headers: opts.headers },
      exchanges: defaultExchanges.concat(opts.websocketUrl ? [
        subscriptionExchange({
          forwardSubscription (operation) {
            return {
              subscribe: sink => {
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
    return client
  }
}

exports.queryImpl = function (client) {
  return function (query) {
    return function (onError, onSuccess) {
      try {
        client
          // .query(gql(query))
          .query(query)
          .toPromise()
          .then(onSuccess)
          .catch(onError)
      } catch (err) {
        onError(err)
      }
      return function (cancelError, onCancelerError, onCancelerSuccess) {
        onCancelerSuccess()
      }
    }
  }
}
