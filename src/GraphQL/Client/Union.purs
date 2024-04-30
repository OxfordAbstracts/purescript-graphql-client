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
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import Prim.Row (class Cons, class Lacks, class Union)
import Prim.RowList as RL
import Type.Proxy (Proxy(..))

newtype GqlUnion r = GqlUnion (Record r)

derive newtype instance Eq (Record r) => Eq (GqlUnion r)
derive newtype instance Ord (Record r) => Ord (GqlUnion r)
derive instance Newtype (GqlUnion r) _

newtype UnionReturned r = UnionReturned (Variant r)

derive instance Newtype (UnionReturned r) _

instance (RL.RowToList r rl, DecodeUnion rl r) => DecodeJson (UnionReturned r) where
  decodeJson = decodeJsonUnionWith (decodeUnion :: _ -> _ -> Proxy rl -> _)

instance (RL.RowToList r rl, DecodeHasuraUnion rl r) => DecodeHasura (UnionReturned r) where
  decodeHasura = decodeJsonUnionWith (decodeHasuraUnion :: _ -> _ -> Proxy rl -> _)

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
  decodeUnion = failedAtTypename

class DecodeHasuraUnion (rl :: RL.RowList Type) r where
  decodeHasuraUnion :: String -> Json -> Proxy rl -> Either JsonDecodeError (Variant r)

instance
  ( IsSymbol l
  , Lacks l r
  , DecodeHasura ty
  , DecodeHasuraUnion rl r
  , Cons l ty r r'
  , Cons l ty () rd
  , Union r rd r'
  ) =>
  DecodeHasuraUnion (RL.Cons l ty rl) r' where
  decodeHasuraUnion = decodeUnionWith decodeHasuraUnion decodeHasura

instance DecodeHasuraUnion RL.Nil r where
  decodeHasuraUnion = failedAtTypename

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

decodeUnionWith
  :: forall r rl l ty r' rd
   . IsSymbol l
  => Cons l ty r r'
  => Cons l ty () rd
  => Union r rd r'
  => (String -> Json -> Proxy rl -> Either JsonDecodeError (Variant r))
  -> (Json -> Either JsonDecodeError ty)
  -> String
  -> Json
  -> Proxy (RL.Cons l ty rl)
  -> Either JsonDecodeError (Variant r')
decodeUnionWith decodeUnion' decodeJson' ty json _ =
  if reflectSymbol l == ty then map (inj l) $ decodeJson' json
  else map expand (decodeUnion' ty json (Proxy :: Proxy rl) :: Either JsonDecodeError (Variant r))
  where
  l :: Proxy l
  l = Proxy

failedAtTypename :: forall x y a. String -> x -> y -> Either JsonDecodeError a
failedAtTypename ty _ _ = Left $ AtKey __typename $ UnexpectedValue $ fromString ty

__typename :: String
__typename = "__typename"
