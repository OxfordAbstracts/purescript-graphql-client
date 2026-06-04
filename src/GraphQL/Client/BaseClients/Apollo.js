import { createClient as createWsClient } from "graphql-ws";
import {
  gql,
  split,
  createHttpLink,
  InMemoryCache,
  ApolloClient,
} from "@apollo/client/core/index.js";
import { getMainDefinition } from "@apollo/client/utilities/index.js";
import { setContext } from "@apollo/client/link/context/index.js";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions/index.js";

// Build the HTTP link. When opts.operationTypeHeader is set, requests are
// split by operation type and the type ("query" or "mutation") is sent as
// the value of that header, so eg. a load balancer can route queries to a
// read replica.
const mkHttpLink = function (opts) {
  if (!opts.operationTypeHeader) {
    return createHttpLink({
      uri: opts.url,
    });
  }

  const linkForOperationType = function (operationType) {
    return createHttpLink({
      uri: opts.url,
      headers: { [opts.operationTypeHeader]: operationType },
    });
  };

  return split(
    function ({ query }) {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "query"
      );
    },
    linkForOperationType("query"),
    linkForOperationType("mutation"),
  );
};

const createClientWithoutWebsockets = function (opts) {
  const authLink = setContext(function (_, { headers }) {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: Object.assign(
        {},
        headers,
        opts.headers,
        opts.authToken ? { authorization: `Bearer ${opts.authToken}` } : {},
      ),
    };
  });

  const httpLink = mkHttpLink(opts);

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    options: {
      authToken: opts.authToken,
      reconnect: true,
    },
  });
};

const createClientWithWebsockets = function (opts) {
  const httpLink = mkHttpLink(opts);

  const wsLink = new GraphQLWsLink(
    createWsClient({
      webSocketImpl: globalThis.WebSocket,
      url: opts.websocketUrl,
      timeout: 30000,
      connectionParams: {
        headers: opts.authToken
          ? { Authorization: `Bearer ${opts.authToken}` }
          : {},
      },
    }),
  );

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink,
  );
  const authLink = setContext(function (_, { headers }) {
    // return the headers to the context so httpLink can read them
    return {
      headers: Object.assign(
        {},
        headers,
        opts.headers,
        opts.authToken ? { authorization: `Bearer ${opts.authToken}` } : {},
      ),
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(link),
  });
};

export function createClientImpl(opts) {
  return function () {
    return createClientWithoutWebsockets(opts);
  };
}

export function createSubscriptionClientImpl(opts) {
  return function () {
    return createClientWithWebsockets(opts);
  };
}

export function queryImpl(opts) {
  return function (client) {
    return function (query) {
      return function (variables) {
        return function (onError, onSuccess) {
          try {
            client
              .query({
                query: gql(query),
                variables: variables,

                errorPolicy: opts.errorPolicy,
                fetchPolicy: opts.fetchPolicy,
              })
              .then(onSuccess)
              .catch(onError);
          } catch (err) {
            onError(err);
          }
          return function (cancelError, onCancelerError, onCancelerSuccess) {
            onCancelerSuccess();
          };
        };
      };
    };
  };
}

export function mutationImpl(opts) {
  return function (client) {
    return function (mutation) {
      return function (variables) {
        return function (onError, onSuccess) {
          try {
            client
              .mutate({
                mutation: gql(mutation),
                errorPolicy: opts.errorPolicy,
                refetchQueries: opts.refetchQueries,
                optimisticResponse: opts.optimisticResponse,
                variables: variables,
                update: function () {
                  if (opts.update) {
                    opts.update();
                  }
                },
              })
              .then(onSuccess)
              .catch(onError);
          } catch (err) {
            onError(err);
          }
          return function (cancelError, onCancelerError, onCancelerSuccess) {
            onCancelerSuccess();
          };
        };
      };
    };
  };
}

export function subscriptionImpl(opts) {
  return function (client) {
    return function (query) {
      return function (variables) {
        return function (onData) {
          return function () {
            const subscription = client
              .subscribe({
                query: gql(query),
                variables: variables,
                errorPolicy: opts.errorPolicy,
                fetchPolicy: opts.fetchPolicy,
              })
              .subscribe(function (x) {
                onData(x)();
              });

            return function () {
              subscription.unsubscribe();
            };
          };
        };
      };
    };
  };
}

export function watchQueryImpl(opts) {
  return function (client) {
    return function (query) {
      return function (variables) {
        return function (onData) {
          return function () {
            const subscription = client
              .watchQuery({
                query: gql(query),
                variables: variables,

                errorPolicy: opts.errorPolicy,
                fetchPolicy: opts.fetchPolicy,
              })
              .subscribe(function (x) {
                onData(x)();
              });

            return function () {
              subscription.unsubscribe();
            };
          };
        };
      };
    };
  };
}

export function readQueryImpl(client) {
  return function (query) {
    return function () {
      return client.readQuery({ query: gql(query) });
    };
  };
}

export function writeQueryImpl(client) {
  return function (query) {
    return function (data) {
      return function () {
        client.writeQuery({
          query: gql(query),
          data: data,
        });

        return {};
      };
    };
  };
}
