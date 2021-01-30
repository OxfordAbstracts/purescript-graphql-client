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

-- | A type class for making the graphql request. 
-- | If you wish to use a different base client, 
-- | you can create your own client, 
-- | make it an instance of `QueryClient`
-- | and pass it to query
class QueryClient baseClient queryOpts mutationOpts | baseClient -> queryOpts mutationOpts where
  clientQuery :: queryOpts -> baseClient -> String -> String -> Aff Json
  clientMutation :: mutationOpts -> baseClient -> String -> String -> Aff Json
  defQueryOpts :: baseClient -> queryOpts
  defMutationOpts :: baseClient -> mutationOpts

-- | A type class for making the graphql subscription. 
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

subscriptionEvent :: forall o c. SubscriptionClient c o => o -> c -> String -> Event Json
subscriptionEvent opts client query = makeEvent (clientSubscription opts client query)
