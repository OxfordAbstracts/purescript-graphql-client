module GraphQL.Client.Args where

import Prelude

import Data.Date (Date)
import Data.DateTime (DateTime)
import Data.Maybe (Maybe)
import Data.Symbol (class IsSymbol, SProxy)
import Data.Time (Time)
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex)
import Heterogeneous.Mapping (class HMapWithIndex, class MappingWithIndex)
import Prim.Row as Row

data Params p t

infixr 6 type Params as ==>

newtype NotNull t
  = NotNull t

newtype ParamNew t
  = ParamNew t

data Args a t
  = Args a t

infixr 6 Args as =>>

data AndArg a1 a2 = AndArg a1 a2

infixr 6 AndArg as ++

class ArgGql params arg

instance argToGqlNotNull :: ArgGql param arg => ArgGql (NotNull param) arg
instance argToGqlMaybe :: ArgGql param arg => ArgGql (Maybe param) arg
instance argToGqlArray :: ArgGql param arg => ArgGql (Array param) (Array arg)
else instance argToGqlArrayAnd :: (ArgGql param a1, ArgGql (Array param) a2) => ArgGql (Array param) (AndArg a1 a2)
else instance argToGqlArrayOne :: ArgGql param arg => ArgGql (Array param) arg

instance argToGqlInt :: ArgGql Int Int
instance argToGqlNumber :: ArgGql Number Number
instance argToGqlString :: ArgGql String String
instance argToGqlBoolean :: ArgGql Boolean Boolean
instance argToGqlDate :: ArgGql Date Date
instance argToGqlTime :: ArgGql Time Time
instance argToGqlDateTime :: ArgGql DateTime DateTime
instance argToGqlRecord :: RecordArg p a u => ArgGql { | p } { | a }

class HMapWithIndex (ArgPropToGql p) { | a } u <= RecordArg p a u

instance recordArg :: HMapWithIndex (ArgPropToGql p) { | a } u => RecordArg p a u

newtype ArgPropToGql params
  = ArgPropToGql { | params }

instance argPropToGql_ ::
  ( IsSymbol sym
  , Row.Cons sym param rest params
  , ArgGql param arg
  , SatisifyNotNullParam param arg
  ) =>
  MappingWithIndex (ArgPropToGql params) (SProxy sym) arg Unit where
  mappingWithIndex (ArgPropToGql params) sym arg = unit

class SatisifyNotNullParam param arg | param -> arg

instance satisfyNotNullParamRecord ::
  HFoldlWithIndex (ArgsSatisifyNotNullsProps arg) Unit { | param } Unit =>
  SatisifyNotNullParam { | param } { | arg }
else instance satisfyNotNullParamNotNull :: SatisifyNotNullParam param arg => SatisifyNotNullParam (NotNull param) arg
else instance satisfyNotNullParamOther :: SatisifyNotNullParam param arg

newtype ArgsSatisifyNotNullsProps args
  = ArgsSatisifyNotNullsProps { | args }

instance argsSatisifyNotNulls_ ::
  ( IsSymbol sym
  , SatisifyNotNullParam param arg
  , Row.Cons sym arg rest args
  ) =>
  FoldingWithIndex (ArgsSatisifyNotNullsProps args) (SProxy sym) Unit (NotNull param) Unit where
  foldingWithIndex (ArgsSatisifyNotNullsProps args) _ sym param = unit
else instance argsSatisifyOthers_ ::
  FoldingWithIndex (ArgsSatisifyNotNullsProps args) (SProxy sym) Unit param Unit where
  foldingWithIndex (ArgsSatisifyNotNullsProps args) _ sym param = unit
