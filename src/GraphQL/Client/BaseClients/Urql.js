import 'isomorphic-unfetch';
import { createClient as createWsClient } from 'graphql-ws';
import { subscribe, pipe, filter, tap } from 'wonka'

import {
  Client,
  subscriptionExchange,
  fetchExchange,
  cacheExchange,
  dedupExchange,
} from "@urql/core";

import { getOperationAST } from "graphql";
import { isLiveQueryOperationDefinitionNode } from "@n1ru4l/graphql-live-query";
import { Repeater } from "@repeaterjs/repeater";

import { applyLiveQueryJSONDiffPatch } from "@n1ru4l/graphql-live-query-patch-jsondiffpatch";
import {
  applyAsyncIterableIteratorToSink,
} from "@n1ru4l/push-pull-async-iterable-iterator";

import EventSource from 'eventsource'

function applySourceToSink(
  source,
  sink
) {
  return applyAsyncIterableIteratorToSink(
    applyLiveQueryJSONDiffPatch(source),
    sink
  );
}

function makeEventStreamSource(url) {
  return new Repeater(async (push, end) => {
    const eventsource = new EventSource(url);
    eventsource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      push(data);
      if (eventsource.readyState === 2) {
        end();
      }
    };
    eventsource.onerror = function (error) {
      end(error);
    };
    await end;
    eventsource.close();
  });
}

const createClient_ = function (opts) {

  let wsClient = null

  if (opts.websocketUrl) {
    wsClient = createWsClient({
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

export function createGlobalClientUnsafeImpl (opts) {
  return function () {
    if (globalClient) {
      return globalClient
    }
    globalClient = createClient_(opts)

    return globalClient
  }
}

export function createClientImpl (opts) {
  return function () {
    return createClient_(opts)
  }
}

export function createSubscriptionClientImpl (opts) {
  return function () {
    return createClient_(opts)
  }
}

export function createLiveQueryClientImpl (opts) {
  return function () {
    return new Client({
      url: opts.url,
      exchanges: [
        cacheExchange,
        dedupExchange,
        subscriptionExchange({
          isSubscriptionOperation: ({ query, variables }) => {
            const definition = getOperationAST(query);
            const isSubscription =
              definition?.kind === "OperationDefinition" &&
              definition.operation === "subscription";
  
            const isLiveQuery =
              !!definition &&
              isLiveQueryOperationDefinitionNode(definition, variables);
  
            return isSubscription || isLiveQuery;
          },
          forwardSubscription(operation) {
            const targetUrl = new URL(opts.url);
            targetUrl.searchParams.append("query", operation.query);
            if (operation.variables) {
              targetUrl.searchParams.append(
                "variables",
                JSON.stringify(operation.variables)
              );
            }
  
            return {
              subscribe: (sink) => ({
                unsubscribe: applySourceToSink(
                  makeEventStreamSource(targetUrl.toString()),
                  sink
                ),
              }),
            };
          },
          enableAllOperations: true,
        }),
        fetchExchange,
      ],
    });
  }
}

export function queryImpl (client) {
  return function (query) {
    return function (variables) {
      return function (onError, onSuccess) {

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

export function mutationImpl (client) {
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

export function subscriptionImpl (client) {

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

export function liveQueryImpl (client) {
  return function (query) {
    return function (variables) {
      return function (callback) {
        return function () {
          const { unsubscribe } = pipe(
            client.query(query, variables),
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
