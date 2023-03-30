module GraphQL.Client.GqlError where

import Data.Argonaut.Core (Json)
import Data.Either (Either)
import Data.Maybe (Maybe)
import Foreign.Object (Object)


type GqlError =
  { message :: String
  , locations :: ErrorLocations
  , path :: Maybe (Array (Either Int String))
  , extensions :: Maybe (Object Json)
  }

type ErrorLocations = Maybe (Array { line :: Int, column :: Int })
