module GraphQL.Client.Directive.Definition (Directive, directive, getDescription, setDescription) where

import Type.Data.List
import Data.Maybe (Maybe(..))
import Data.Symbol (class IsSymbol)
import Prim.Boolean (False)

-- | A directive definition
data Directive :: forall k1 k2 k3. k1 -> k2 -> k3 -> Type
data Directive name arguments locations
  = Directive
    { description :: Maybe String }

directive ::
  forall name arguments location.
  IsSymbol name =>
  IsEmpty location False =>
  Directive name { | arguments } location
directive =
  Directive
    { description: Nothing }

setDescription ::
  forall name arguments location.
  Maybe String ->
  Directive name { | arguments } location -> Directive name { | arguments } location
setDescription description _ = Directive { description }

getDescription ::
  forall name arguments location.
  Directive name { | arguments } location ->
  Maybe String
getDescription (Directive { description }) = description
