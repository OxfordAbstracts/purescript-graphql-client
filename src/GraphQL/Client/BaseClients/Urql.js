require('isomorphic-unfetch')

const createClient_ = function (opts) {
  const { createClient, defaultExchanges, subscriptionExchange } = require('@urql/core')
  const { createClient: createWSClient } = require('graphql-ws')

  let wsClient = null

  if (opts.websocketUrl) {
    wsClient = createWSClient({
      url: opts.websocketUrl
    })
  }

  const otherExchanges = opts.websocketUrl
    ? [
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
      ]
    : []

  return createClient({
    url: opts.url,
    fetchOptions: { headers: opts.headers },
    exchanges: defaultExchanges.concat(otherExchanges)
  })
}
let globalClient

exports.createGlobalClientUnsafeImpl = function (opts) {
  return function () {
    if (globalClient) {
      return globalClient
    }
    globalClient = createClient_(opts)

    return globalClient
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

exports.queryImpl = function (client) {
  return function (query) {
    return function (variables) {
      return function (onError, onSuccess) {
        console.info('query', query)
        console.info('variables', variables)

        try {
          client
            .query(query, variables)
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

exports.mutationImpl = function (client) {
  return function (mutation) {
    return function (variables) {
      return function (onError, onSuccess) {
        try {
          client
            .mutation(mutation, variables)
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

exports.subscriptionImpl = function (client) {
  const { subscribe, pipe } = require('wonka')

  return function (query) {
    return function (variables) {
      return function (callback) {
        return function () {
          const { unsubscribe } = pipe(
            client.subscription(query, variables),
            subscribe(function (value) {
              callback(value)()
            })
          )
          return unsubscribe
        }
      }
    }
  }
}
