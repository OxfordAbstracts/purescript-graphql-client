-- | Get the graphql fields from a data type
module GraphQL.Client.GetFields (class GetFieldsStandard, PropGetFieldsStandard, getFieldsStandard) where

import Prelude

import Data.HeytingAlgebra (class HeytingAlgebraRecord, tt)
import Data.Maybe (Maybe)
import Heterogeneous.Mapping (class HMap, class Mapping, hmap)
import Prim.RowList (class RowToList)
import Type.Proxy (Proxy(..))

class GetFieldsStandard :: forall k. k -> Type -> Constraint
class GetFieldsStandard t fields | t -> fields where
  getFieldsStandard :: Proxy t -> fields

data PropGetFieldsStandard
  = PropGetFieldsStandard

data PropToProxy
  = PropToProxy

instance getFieldsStandardRecord ::
  ( RowToList r t
  , HeytingAlgebraRecord t r r
  , HMap PropGetFieldsStandard { | r } fields
  , HMap PropGetFieldsStandard { | input } { | r }
  ) =>
  GetFieldsStandard { | input } fields where
  getFieldsStandard _ = recordGetFieldsStandard (tt :: { | r })
else instance getFieldsStandardMaybe :: GetFieldsStandard a fields => GetFieldsStandard (Maybe a) fields where
  getFieldsStandard _ = getFieldsStandard (Proxy :: _ a)
else instance getFieldsStandardArray :: GetFieldsStandard a fields => GetFieldsStandard (Array a) fields where
  getFieldsStandard _ = getFieldsStandard (Proxy :: _ a)
else instance getFieldsStandardLeaf :: GetFieldsStandard a Unit where
  getFieldsStandard _ = unit


instance propToProxy ::
  Mapping PropToProxy t (Proxy t) where
  mapping PropToProxy _ = Proxy

recordGetFieldsStandard ::
  forall t fields.
  HMap PropGetFieldsStandard ({ | t }) fields => { | t } -> fields
recordGetFieldsStandard = hmap PropGetFieldsStandard


instance propGetFieldsStandard ::
  (GetFieldsStandard t fields) =>
  Mapping PropGetFieldsStandard t fields where
  mapping PropGetFieldsStandard _ = getFieldsStandard (Proxy :: _ t)

