module GraphQL.Client.Directive.Definition (Directive, directive) where

import Type.Data.List

import Data.Maybe (Maybe(..))
import Data.Symbol (class IsSymbol)
import GraphQL.Client.Directive.Location (QUERY)
import Prim.Boolean (False)




-- | A directive definition
data Directive :: forall k1 k2 k3. k1 -> k2 -> k3 -> Type
data Directive name arguments locations
  = Directive
    -- { description :: Maybe String
    -- }

directive ::
  forall name arguments location.
  IsSymbol name =>
  IsEmpty location False =>
  Directive name { | arguments } location
directive = Directive 


-- setDescription :: forall name arguments location.
--   Directive name { | arguments } location -> Maybe String -> Directive name { | arguments } location 
-- setDescription _ description = Directive { description }

test :: Directive "cache" { } (QUERY :> Nil')
test = directive

-- testInclude :: forall a. Directive "include" { if :: Boolean } (FIELD a (Maybe a) :> Nil')
-- testInclude = directive