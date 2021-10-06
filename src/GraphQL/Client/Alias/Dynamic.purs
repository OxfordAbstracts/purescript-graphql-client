module GraphQL.Client.Alias.Dynamic where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Argonaut.Decode.Decoders (decodeJObject)
import Data.Array as Array
import Data.Either (Either)
import Data.Generic.Rep (class Generic)
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)
import Data.Traversable (traverse)
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)

-- | Used for creating spread aliases dynamically
-- | eq: 
-- | mutation myUpdates {
-- |   _1: update_users(where: {id : 1}, _set: { value: 10 }) { affected_rows }
-- |   _2: update_users(where: {id : 2}, _set: { value: 15 }) { affected_rows }
-- |   _3: update_users(where: {id : 3}, _set: { value: 20 }) { affected_rows }
-- | }
data Spread alias args fields
  = Spread alias (Array args) fields

-- | The return type of a query made with a dynamic alias spread
newtype SpreadRes a
  = SpreadRes (Array a)

derive instance genericSpreadRes :: Generic (SpreadRes a) _

derive instance newtypeSpreadRes :: Newtype (SpreadRes a) _

derive instance eqSpreadRes :: Eq a => Eq (SpreadRes a)

derive instance ordSpreadRes :: Ord a => Ord (SpreadRes a)

instance showSpreadRes :: Show a => Show (SpreadRes a) where 
  show = genericShow

decodeSpreadRes :: forall a. (Json -> Either JsonDecodeError a) -> Json -> Either JsonDecodeError (SpreadRes a)
decodeSpreadRes decoder json = decodeJObject json <#> Array.fromFoldable >>= traverse decoder <#> SpreadRes

instance decodeHasuraSpreadRes :: DecodeHasura a => DecodeHasura (SpreadRes a) where
  decodeHasura = decodeSpreadRes decodeHasura

instance decodeJsonSpreadRes :: DecodeJson a => DecodeJson (SpreadRes a) where
  decodeJson = decodeSpreadRes decodeJson
