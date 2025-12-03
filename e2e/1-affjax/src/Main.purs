module Main where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode.Class (class EncodeJson, encodeJson)
import Data.Either (Either(..))
import Data.Maybe (isJust)
import Data.Symbol (class IsSymbol)
import Effect (Effect)
import Effect.Aff (launchAff_)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.BaseClients.Affjax.Node (AffjaxNodeClient(..))
import GraphQL.Client.Query (query, queryFullRes)
import GraphQL.Client.Types (Client(..))
import Prim.Row as Row
import Prim.RowList (class RowToList, RowList)
import Prim.RowList as RL
import Record as Record
import Test.Spec.Assertions (shouldEqual)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

foreign import setupMsw :: Effect Unit

-- | Maps a record of functions (Json -> a) to (Json -> Json)
-- | by composing each function with encodeJson
class MapEncodeJson :: RowList Type -> Row Type -> Row Type -> Constraint
class MapEncodeJson rl r_in r_out | rl -> r_in r_out where
  mapEncodeJsonImpl :: Proxy rl -> Record r_in -> Record r_out

instance mapEncodeJsonNil :: MapEncodeJson RL.Nil () () where
  mapEncodeJsonImpl _ _ = {}

instance mapEncodeJsonCons ::
  ( IsSymbol sym
  , EncodeJson a
  , Row.Cons sym (Json -> a) r_in' r_in
  , Row.Cons sym (Json -> Json) r_out' r_out
  , Row.Lacks sym r_out'
  , MapEncodeJson tail r_in r_out'
  ) =>
  MapEncodeJson (RL.Cons sym (Json -> a) tail) r_in r_out where
  mapEncodeJsonImpl _ rec =
    let
      tail = mapEncodeJsonImpl (Proxy :: Proxy tail) rec
      sym = Proxy :: Proxy sym
      fn = Record.get sym rec
      encodedFn = fn >>> encodeJson
    in
      Record.insert sym encodedFn tail

mapEncodeJson ::
  forall r_in r_out rl.
  RowToList r_in rl =>
  MapEncodeJson rl r_in r_out =>
  Record r_in ->
  Record r_out
mapEncodeJson = mapEncodeJsonImpl (Proxy :: Proxy rl)

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

main :: Effect Unit
main = do
  setupMsw
  launchAff_ do
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
