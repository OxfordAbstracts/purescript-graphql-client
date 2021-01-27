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
          forwardSubscription(operation) {
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
  return function (op) {
    return function (query) {
      return function (onError, onSuccess) {
        try {
          let res; 
          
          if(op === "query"){
            res = client.query(query)
          }else if(op === "mutation"){
            res = client.mutation(query)
          }
          // else if(op === "subscription"){
          //   res = client.subscription(query)
          // }

          res
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
}
