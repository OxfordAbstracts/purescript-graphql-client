module GraphQL.Client.Types where

import Prelude

import Data.Argonaut.Core (Json)
import Effect (Effect)
import Effect.Aff (Aff)
import FRP.Event (Event, makeEvent)
import GraphQL.Client.QueryReturns (class QueryReturns)
import GraphQL.Client.ToGqlString (class GqlQueryString)

class
  ( QueryReturns schema query returns
  , GqlQueryString query
  ) <= GqlQuery schema query returns | schema query -> returns

instance queriable ::
  ( QueryReturns schema query returns
  , GqlQueryString query
  ) =>
  GqlQuery schema query returns

newtype Client baseClient querySchema mutationSchema subscriptionSchema
  = Client baseClient

-- | A type class for making a graphql request client.
-- | Apollo, urql and xhr2/Affjax baseClients are provided.
-- | If you wish to use a different base client, 
-- | you can create your own client, 
-- | make it an instance of `QueryClient`
-- | and pass it to query
class QueryClient baseClient queryOpts mutationOpts | baseClient -> queryOpts mutationOpts where
  clientQuery :: queryOpts -> baseClient -> String -> String -> Aff Json
  clientMutation :: mutationOpts -> baseClient -> String -> String -> Aff Json
  defQueryOpts :: baseClient -> queryOpts
  defMutationOpts :: baseClient -> mutationOpts

-- | A type class for making graphql subscriptions. 
-- | If you wish to use a different underlying client, 
-- | you can create your own client, 
-- | make it an instance of `SubscriptionClient`
-- | and pass it to `subscription`
class SubscriptionClient baseClient opts | baseClient -> opts where
  clientSubscription ::
    opts -> 
    baseClient ->
    String ->
    (Json -> Effect Unit) ->
    Effect (Effect Unit)
  defSubOpts :: baseClient -> opts

subscriptionEventOpts :: forall opts c. SubscriptionClient c opts => (opts -> opts) -> c -> String -> Event Json
subscriptionEventOpts optsF client query = makeEvent (clientSubscription (optsF (defSubOpts client)) client query)

subscriptionEvent :: forall opts c. SubscriptionClient c opts => c -> String -> Event Json
subscriptionEvent = subscriptionEventOpts identity

-- | A type class for making graphql watch queries (observable queries). 
-- | If you wish to use a different underlying client, 
-- | you can create your own client, 
-- | make it an instance of `WatchQueryClient`
-- | and pass it to `watchQuery`
class WatchQueryClient baseClient opts | baseClient -> opts where
  clientWatchQuery ::
    opts -> 
    baseClient ->
    String ->
    (Json -> Effect Unit) ->
    Effect (Effect Unit)
  defWatchOpts :: baseClient -> opts

watchQueryEventOpts :: forall opts c. WatchQueryClient c opts => (opts -> opts) -> c -> String -> Event Json
watchQueryEventOpts optsF client query = makeEvent (clientWatchQuery (optsF (defWatchOpts client)) client query)

watchQueryEvent :: forall opts c. WatchQueryClient c opts => c -> String -> Event Json
watchQueryEvent = watchQueryEventOpts identity