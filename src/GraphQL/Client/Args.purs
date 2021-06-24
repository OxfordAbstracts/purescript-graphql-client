module GraphQL.Client.Args where

import Prelude
import Data.Bifunctor (class Bifunctor)
import Data.Date (Date)
import Data.DateTime (DateTime)
import Data.Maybe (Maybe)
import Data.Symbol (class IsSymbol)
import Data.Time (Time)
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex)
import Heterogeneous.Mapping (class HMapWithIndex, class MappingWithIndex)
import Prim.Row as Row
import Prim.TypeError as TE
import Type.Proxy (Proxy)

data Params :: forall k1 k2. k1 -> k2 -> Type
data Params p t

infixr 6 type Params as ==>

newtype NotNull t
  = NotNull t

newtype ParamNew t
  = ParamNew t

data Args a t
  = Args a t

infixr 6 Args as =>>

data AndArg a1 a2
  = AndArg a1 a2

infixr 6 AndArg as ++

data OrArg argL argR
  = ArgL argL
  | ArgR argR

derive instance functorOrArg :: Functor (OrArg argL)

instance bifunctorOrArg :: Bifunctor OrArg where
  bimap lf rf =
    map rf
      >>> case _ of
          ArgL l -> ArgL $ lf l
          ArgR r -> ArgR r

data IgnoreArg
  = IgnoreArg

guardArg :: forall a. Boolean -> a -> OrArg IgnoreArg a
guardArg b args =
  if b then
    ArgR args
  else
    ArgL IgnoreArg

onlyArgs :: forall a. a -> Args a Unit
onlyArgs a = Args a unit

class ArgGql :: forall k1 k2. k1 -> k2 -> Constraint
class ArgGql params arg

instance argToGqlNotNull :: (IsNotNull param arg, ArgGql param arg) => ArgGql (NotNull param) arg
else instance argToGqlMaybe :: ArgGql param arg => ArgGql param (Maybe arg)
else instance argToGqlArray :: ArgGql param arg => ArgGql (Array param) (Array arg)
else instance argToGqlArrayAnd :: (ArgGql param a1, ArgGql (Array param) a2) => ArgGql (Array param) (AndArg a1 a2)
else instance argToGqlArrayOne :: ArgGql param arg => ArgGql (Array param) arg
else instance argToGqlOrArg :: (ArgGql param argL, ArgGql param argR) => ArgGql param (OrArg argL argR)
else instance argToGqlIgnore :: ArgGql param IgnoreArg


class IsNotNull :: forall k1 k2. k1 -> k2 -> Constraint
class IsNotNull param arg 

instance
    ( TE.Fail
        ( TE.Above
            (TE.Text "A `Maybe` query argument cannot be used with with required schema argument: ")
            ( TE.Beside
                (TE.Text "  ")
                ( TE.Above
                       (TE.Beside (TE.Text "Schema: ") (TE.Quote param))
                       (TE.Beside (TE.Text "Query: ") (TE.Quote (Maybe arg)))
                )
            )
        )
    ) => IsNotNull param (Maybe arg)

else instance
    ( TE.Fail
        ( TE.Above
            (TE.Text "An `IgnoreArg` query argument cannot be used with with required schema argument: ")
            ( TE.Beside
                (TE.Text "  ")
                ( TE.Above
                       (TE.Beside (TE.Text "Schema: ") (TE.Quote param))
                       (TE.Beside (TE.Text "Query: ") (TE.Quote IgnoreArg))
                )
            )
        )
    ) => IsNotNull param IgnoreArg
else instance
  ( IsNotNull param l
  , IsNotNull param r
  ) => IsNotNull param (OrArg l r)
else instance IsNotNull param arg


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
  MappingWithIndex (ArgPropToGql params) (Proxy sym) arg Unit where
  mappingWithIndex (ArgPropToGql _) _ _ = unit

class SatisifyNotNullParam (param :: Type) (arg :: Type) | param -> arg

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
  FoldingWithIndex (ArgsSatisifyNotNullsProps args) (Proxy sym) Unit (NotNull param) Unit where
  foldingWithIndex (ArgsSatisifyNotNullsProps _) _ _ _ = unit
else instance argsSatisifyOthers_ ::
  FoldingWithIndex (ArgsSatisifyNotNullsProps args) (Proxy sym) Unit param Unit where
  foldingWithIndex (ArgsSatisifyNotNullsProps _) _ _ _ = unit
