module GraphQl.Helpers where

import Prelude

import Data.Newtype (class Newtype, unwrap)
import Data.String (joinWith)

toPgIdArray :: forall a. Newtype a Int => Array a -> String
toPgIdArray ns = "{" <> (joinWith "," $ map (unwrap >>> show) ns) <> "}"
