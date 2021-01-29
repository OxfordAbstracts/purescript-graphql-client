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

  const httpLink = new HttpLink({
    uri: opts.url,
    options: {
      authToken: opts.authToken,
      reconnect: true
    }
  })

  const wsLink = new WebSocketLink({
    uri: opts.websocketUrl,
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
            .query({ query: gql(query), fetchPolicy: opts.fetchPolicy })
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
  const { gql } = require('@apollo/client/core')

  return function (client) {
    return function (mutation) {
      return function (onError, onSuccess) {
        try {
          client
            .mutate({ mutation: gql(mutation), fetchPolicy: opts.fetchPolicy })
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
