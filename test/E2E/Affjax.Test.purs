module E2E.Affjax.Test where

import Prelude

import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Array (filter)
import Data.Either (Either(..))
import Data.Maybe (isJust)
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Foreign.Object as FO
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.BaseClients.Affjax.Node (AffjaxNodeClient(..))
import GraphQL.Client.Query (query, queryFullRes)
import GraphQL.Client.Types (Client(..))
import Test.MSW (SchemaText(..), setupMsw)
import Test.Spec (Spec, SpecT, beforeAll_, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

type Schema =
  { prop :: String
  , widgets :: { id :: Int } -> Array Widget
  }

type Widget =
  { name :: String
  , id :: Int
  }

client
  :: Client AffjaxNodeClient
       { directives :: Proxy Nil'
       , query :: Schema
       , mutation :: Void
       , subscription :: Void
       }
client = (Client $ AffjaxNodeClient "http://localhost/graphql" [])

schema :: SchemaText
schema = SchemaText
  """
  type Query {
     prop: String
     widgets(id: Int): [Widget!]!
   }
 
   type Widget {
     id: Int
     name: String!
   }
   """

beforeAll :: Aff Unit
beforeAll = liftEffect do
  setupMsw @Schema schema
    { prop
    , widgets
    }

  where
  dat =
    { widgets:
        [ { id: 1, name: "one" }
        , { id: 2, name: "two" }
        ]
    }
  prop _ = pure "Hello world!"
  widgets (req :: { id :: Int }) = pure $ filter (_.id >>> eq req.id) dat.widgets

spec :: SpecT Aff Unit Aff Unit
spec = beforeAll_ beforeAll $ describe "AffjaxClient" do
  it "should support querying with Affjax" do
    { widgets } <-
      query client "Widget names with id 1"
        { widgets: { id: 1 } =>> { name: Proxy @"name" } }

    widgets `shouldEqual` [ { name: "one" } ]

    fullResult <-
      queryFullRes decodeJson identity client "Widget names with id 1"
        { widgets: { id: 1 } =>> { name: Proxy @"name" } }

    fullResult.data_ `shouldEqual` (Right { widgets: [ { name: "one" } ] })
    isJust fullResult.errors `shouldEqual` false
    isJust fullResult.errors_json `shouldEqual` false
