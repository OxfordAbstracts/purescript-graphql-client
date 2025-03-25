module GraphQL.Client.ArrayOf
  ( ArrayOf(..)
  , arrayOf
  ) where

import Data.Newtype (class Newtype)

-- | An array type for more control over type inference.
--
-- This is useful for distinguishing between `f (Array a)`` and `Array (f a)` in the return type,
-- where `f` is `Identity` or `ErrorBoundary`.
newtype ArrayOf a = ArrayOf a

derive instance newtypeArrayOf :: Newtype (ArrayOf a) _

arrayOf :: forall q. q -> ArrayOf q
arrayOf = ArrayOf
