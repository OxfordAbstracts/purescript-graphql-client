module GraphQL.Client.Union where

import Prelude

import Data.Argonaut.Core (Json, caseJsonObject, fromObject, fromString, toString)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError(..))
import Data.Argonaut.Decode.Class (decodeJson)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Variant (Variant, expand, inj)
import Foreign.Object (lookup)
import Prim.Row (class Cons, class Lacks, class Union)
import Prim.RowList as RL
import Type.Proxy (Proxy(..))

newtype GqlUnion r = GqlUnion (Record r)

derive instance newtypeGqlUnion :: Newtype (GqlUnion r) _

newtype UnionReturned r = UnionReturned (Variant r)

derive instance newtypeGqlUnionReturned :: Newtype (UnionReturned r) _

instance (RL.RowToList r rl, DecodeUnion rl r) => DecodeJson (UnionReturned r) where
  decodeJson = decodeJsonUnionWith (decodeUnion :: _ -> _ -> Proxy rl -> _)

decodeJsonUnionWith
  :: forall (rl :: RL.RowList Type) (r :: Row Type)
   . (String -> Json -> Proxy rl -> Either JsonDecodeError (Variant r))
  -> Json
  -> Either JsonDecodeError (UnionReturned r)
decodeJsonUnionWith decode =
  caseJsonObject (Left $ TypeMismatch "object") \obj ->
    case lookup __typename obj of
      Nothing -> Left $ AtKey __typename $ MissingValue
      Just ty -> case toString ty of
        Nothing -> Left $ AtKey __typename $ TypeMismatch "string"
        Just ty' -> map UnionReturned $
          decode ty' (fromObject obj) (Proxy :: Proxy rl)

class DecodeUnion (rl :: RL.RowList Type) r where
  decodeUnion :: String -> Json -> Proxy rl -> Either JsonDecodeError (Variant r)

instance
  ( IsSymbol l
  , Lacks l r
  , DecodeJson ty
  , DecodeUnion rl r
  , Cons l ty r r'
  , Cons l ty () rd
  , Union r rd r'
  ) =>
  DecodeUnion (RL.Cons l ty rl) r' where
  decodeUnion = decodeUnionWith decodeUnion decodeJson

instance DecodeUnion RL.Nil r where
  decodeUnion ty _ _ = Left $ AtKey __typename $ UnexpectedValue $ fromString ty

decodeUnionWith :: forall r rl l ty r' rd. IsSymbol l => Cons l ty r r' => Cons l ty () rd => Union r rd r' =>
  (String -> Json -> Proxy rl -> Either JsonDecodeError (Variant r)) -> (Json -> Either JsonDecodeError ty) -> String -> Json -> Proxy (RL.Cons l ty rl) -> Either JsonDecodeError (Variant r')
decodeUnionWith decodeUnion' decodeJson' ty json _ = 
  if reflectSymbol l == ty then map (inj l) $ decodeJson' json
  else map expand (decodeUnion' ty json (Proxy :: Proxy rl) :: Either JsonDecodeError (Variant r))
  where
  l :: Proxy l
  l = Proxy

__typename :: String
__typename = "__typename"

