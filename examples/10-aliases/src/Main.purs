module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Data.Newtype (unwrap)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import GraphQL.Client.Alias ((:))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.BaseClients.Affjax.Node (query_)
import GraphQL.Client.Types (class GqlQuery)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { renamed } <-
      queryGql "widgets_aliased"
        { renamed: widgets : { id: 1 } =>> { name }
        }
    logShow $ map _.name renamed

    dynamic <-
      map unwrap $ queryGql "dynamic_alias"
        $ Spread widgets
            [ { id: 1 }, { id: 2 } ]
            { name }

    logShow dynamic

-- Run gql query
queryGql ::
  forall query returns.
  GqlQuery Nil' OpQuery Schema query returns =>
  DecodeJson returns =>
  String -> query -> Aff returns
queryGql = query_ "http://localhost:4000/graphql" (Proxy :: Proxy Schema)

-- Schema
type Schema
  = { prop :: String
    , widgets :: { id :: Int } -> Array Widget
    }

type Widget
  = { name :: String
    , id :: Int
    }

-- Symbols
prop :: Proxy "prop"
prop = Proxy

name :: Proxy "name"
name = Proxy

widgets :: Proxy "widgets"
widgets = Proxy
