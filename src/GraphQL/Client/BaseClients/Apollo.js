require('isomorphic-unfetch')

const createClientWithoutWebsockets = function (opts) {
  const { ApolloClient, InMemoryCache } = require('@apollo/client/core')

  return new ApolloClient({
    uri: opts.url,
    cache: new InMemoryCache(),
    options: {
      authToken: opts.authToken,
      reconnect: true
    }
  })
}

const createClientWithWebsockets = function (opts) {
  const { WebSocketLink } = require('@apollo/client/link/ws')
  const { split, HttpLink, InMemoryCache, ApolloClient } = require('@apollo/client/core')
  const { getMainDefinition } = require('@apollo/client/utilities')
  const ws = require('isomorphic-ws');

  const httpLink = new HttpLink({
    uri: opts.url,
    options: {
      authToken: opts.authToken,
      reconnect: true
    }
  })

  const wsLink = new WebSocketLink({
    uri: opts.websocketUrl,
    webSocketImpl: ws,
    options: {
      authToken: opts.authToken,
      reconnect: true
    }
  })

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: link
  })
}

exports.createClientImpl = function (opts) {
  return function () {
    return createClientWithoutWebsockets(opts)
  }
}

exports.createSubscriptionClientImpl = function (opts) {
  return function () {
    return createClientWithWebsockets(opts)
  }
}

exports.queryImpl = function (opts) {
  const { gql } = require('@apollo/client/core')

  return function (client) {
    return function (query) {
      return function (onError, onSuccess) {
        try {
          client
            .query({
              query: gql(query),
              errorPolicy: opts.errorPolicy,
              fetchPolicy: opts.fetchPolicy
            })
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

exports.mutationImpl = function (opts) {

  return function (client) {
    return function (mutation) {
      return function (onError, onSuccess) {
        const { gql } = require('@apollo/client/core')

        try {
          client
            .mutate({
              mutation: gql(mutation),
              errorPolicy: opts.errorPolicy
            })
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


exports.subscriptionImpl = function (opts) {
  return function (client) {
    return function (query) {
      return function (onData) {
        console.info('onData', onData);

        return function () {
          console.info('onData 2', onData);

          const { gql } = require('@apollo/client/core')

          const subscription =
            client
              .subscribe({
                query: gql(query),
                errorPolicy: opts.errorPolicy,
                fetchPolicy: opts.fetchPolicy
              })
              .subscribe(function (d) { 
                console.info('d', d);
                onData(d) 
              })

          return function () { subscription.unsubscribe() }
        }
      }
    }
  }
}
