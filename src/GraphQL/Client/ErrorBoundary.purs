module GraphQL.Client.ErrorBoundary
  ( BoundaryResult(..)
  , ErrorBoundary(..)
  , PropPutErrorsInPaths(..)
  , class PutErrorsInPaths
  , decodeWith
  , putErrorsInPath
  , putErrorsInPathsImpl
  , toEither
  )
  where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Array (filter, length, take)
import Data.Either (Either(..), either)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Generic.Rep (class Generic)
import Data.Maybe (Maybe, maybe)
import Data.Show.Generic (genericShow)
import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.GqlError (GqlError)
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import Heterogeneous.Mapping (class HMapWithIndex, class MappingWithIndex, hmapWithIndex)
import Type.Proxy (Proxy)

newtype ErrorBoundary a =
  ErrorBoundary a

data BoundaryResult err a
  = Result a
  | Error JsonDecodeError err

toEither :: forall err a. BoundaryResult err a -> Either err a
toEither (Result a) = Right a
toEither (Error _ e) = Left e

decodeWith :: forall res m. Applicative m => (Json -> Either JsonDecodeError res) -> Json -> m (BoundaryResult Unit res)
decodeWith decode = decode >>> either (\err -> Error err unit) Result >>> pure

instance DecodeJson a => DecodeJson (BoundaryResult Unit a) where
  decodeJson = decodeWith decodeJson

instance DecodeHasura a => DecodeHasura (BoundaryResult Unit a) where
  decodeHasura = decodeWith decodeHasura

derive instance Functor (BoundaryResult err)
derive instance (Eq err, Eq a) => Eq (BoundaryResult err a)
derive instance Generic (BoundaryResult err a) _

instance (Show err, Show a) => Show (BoundaryResult err a) where
  show = genericShow

putErrorsInPath :: forall a b. PutErrorsInPaths a b => Array GqlError -> a -> b
putErrorsInPath = putErrorsInPathsImpl []

class PutErrorsInPaths a b | a -> b where
  putErrorsInPathsImpl :: (Array (Either Int String)) -> Array GqlError -> a -> b

instance PutErrorsInPaths a b => PutErrorsInPaths (BoundaryResult err a) (BoundaryResult (Array GqlError) b) where
  putErrorsInPathsImpl path errors (Result a) = Result $ putErrorsInPathsImpl path errors a
  putErrorsInPathsImpl path errors (Error decodeErr _) = Error decodeErr $ errors # filter
    ( _.path
        >>> map (take (length path))
        >>> maybe false (eq path)
    )

else instance (PutErrorsInPaths a b) => PutErrorsInPaths (Array a) (Array b) where
  putErrorsInPathsImpl path errors = mapWithIndex \idx -> (putErrorsInPathsImpl (path <> [ Left idx ]) errors)

else instance (PutErrorsInPaths a b) => PutErrorsInPaths (Maybe a) (Maybe b) where
  putErrorsInPathsImpl path errors = map (putErrorsInPathsImpl path errors)

else instance HMapWithIndex (PropPutErrorsInPaths) { | a } { | b } => PutErrorsInPaths { | a } { | b } where
  putErrorsInPathsImpl path errors = hmapWithIndex (PropPutErrorsInPaths { path, errors })

else instance (PutErrorsInPaths a b) => PutErrorsInPaths (Either err a) (Either err b) where
  putErrorsInPathsImpl path errors = map (putErrorsInPathsImpl path errors)

else instance PutErrorsInPaths a a where
  putErrorsInPathsImpl _ _ a = a

newtype PropPutErrorsInPaths = PropPutErrorsInPaths
  { path :: Array (Either Int String)
  , errors :: Array GqlError
  }

instance propToSchemaTypeAlias ::
  ( IsSymbol sym
  , PutErrorsInPaths a b
  ) =>
  MappingWithIndex (PropPutErrorsInPaths) (Proxy sym) a b where
  mappingWithIndex (PropPutErrorsInPaths { path, errors }) proxy =
    putErrorsInPathsImpl (path <> [ Right $ reflectSymbol proxy ]) errors