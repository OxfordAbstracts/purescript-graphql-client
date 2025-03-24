module GraphQL.Client.Args where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Bifunctor (class Bifunctor)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Symbol (class IsSymbol)
import Data.Variant (Variant)
import GraphQL.Client.Args.AllowedMismatch (AllowedMismatch)
import GraphQL.Client.AsGql (AsGql)
import GraphQL.Client.NullArray (NullArray)
import GraphQL.Client.Variable (Var)
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex)
import Heterogeneous.Mapping (class HMapWithIndex, class MappingWithIndex)
import Prim.Row as Row
import Prim.TypeError as TE
import Type.Proxy (Proxy)

newtype NotNull t = NotNull t

data Args a t = Args a t

infixr 6 Args as =>>

type AndArg a b = AndArgs (Array a) b

andArg :: forall a b. a -> b -> AndArg a b
andArg a b = AndArgs [ a ] b

infixr 6 andArg as ++

data AndArgs a1 a2 = AndArgs a1 a2

infixr 6 AndArgs as +++

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

data IgnoreArg = IgnoreArg

guardArg :: forall a. Boolean -> a -> OrArg IgnoreArg a
guardArg b args =
  if b then
    ArgR args
  else
    ArgL IgnoreArg

onlyArgs :: forall a. a -> Args a Unit
onlyArgs a = Args a unit

class ArgGql :: forall param arg. param -> arg -> Constraint
class ArgGql params args

instance ArgGqlAt any params args => ArgGql params args

class ArgGqlAt :: forall param arg. Symbol -> param -> arg -> Constraint
class ArgGqlAt at params arg

instance argAsGql :: ArgGqlAt at param arg => ArgGqlAt at (AsGql gqlName param) arg
else instance argToGqlNotNull :: (IsNotNull at param arg, ArgGqlAt at param arg) => ArgGqlAt at (NotNull param) arg
else instance argToGqlIgnore :: ArgGqlAt at param IgnoreArg
else instance argToGqlVariant :: (Row.Union r () params) => ArgGqlAt at (Variant params) (Variant r)
else instance argVarJson :: ArgGqlAt at Json (Var sym Json) -- Json can only be used with a variable
else instance argToGqlJsonNotAllowed :: TE.Fail (TE.Text "A `Json` query argument can only be used as a variable ") => ArgGqlAt at Json Json
else instance argVar :: ArgGqlAt at param arg => ArgGqlAt at param (Var sym arg)
else instance argToGqlArrayNull :: ArgGqlAt at (Array param) NullArray
else instance argToGqlArrayAnds :: (ArgGqlAt at (Array param) a1, ArgGqlAt at (Array param) a2) => ArgGqlAt at (Array param) (AndArgs a1 a2)
else instance argToGqlOrArg :: (ArgGqlAt at param argL, ArgGqlAt at param argR) => ArgGqlAt at param (OrArg argL argR)
else instance argToGqlMaybe :: ArgGqlAt at param arg => ArgGqlAt at param (Maybe arg)
else instance argToGqlArray :: ArgGqlAt at param arg => ArgGqlAt at (Array param) (Array arg)
else instance argToGqlArrayOne :: ArgGqlAt at param arg => ArgGqlAt at (Array param) arg
else instance argToGqlRecord :: RecordArg p a u => ArgGqlAt at { | p } { | a }
else instance allowedArgMismatchSame :: ArgGqlAt at p (AllowedMismatch p a)
else instance allowedArgMismatchNested :: ArgGqlAt at p a => ArgGqlAt at p (AllowedMismatch schema a)
else instance argGqlIdentity :: ArgGqlAt at a a
else instance argToGqlNewtypeRecord :: (Newtype n { | p }, RecordArg p a u) => ArgGqlAt at n { | a }
else instance argMismatch ::
  ( TE.Fail
      ( TE.Above
          (TE.Text "Argument type mismatch: ")
          ( TE.Beside
              (TE.Text "  ")
              ( TE.Above
                  (TE.Beside (TE.Text "Schema: ") (TE.Quote param))
                  ( TE.Above (TE.Beside (TE.Text "Query: ") (TE.Quote arg))
                      (TE.Beside (TE.Text "At: ") (TE.Quote at))
                  )
              )
          )
      )
  ) =>
  ArgGqlAt at param arg

class IsNotNull :: forall k1 k2. Symbol -> k1 -> k2 -> Constraint
class IsNotNull at param arg

instance
  ( TE.Fail
      ( TE.Above
          (TE.Text "A `Maybe` query argument cannot be used with with required schema argument: ")
          ( TE.Beside
              (TE.Text "  ")
              ( TE.Above
                  (TE.Beside (TE.Text "Schema: ") (TE.Quote param))
                  ( TE.Above (TE.Beside (TE.Text "Query: ") (TE.Quote arg))
                      (TE.Beside (TE.Text "At: ") (TE.Quote at))
                  )
              )
          )
      )
  ) =>
  IsNotNull at param (Maybe arg)

else instance
  ( TE.Fail
      ( TE.Above
          (TE.Text "An `IgnoreArg` query argument cannot be used with with required schema argument: ")
          ( TE.Beside
              (TE.Text "  ")
              ( TE.Above
                  (TE.Beside (TE.Text "Schema: ") (TE.Quote param))
                  ( TE.Above (TE.Beside (TE.Text "Query: ") (TE.Quote IgnoreArg))
                      (TE.Beside (TE.Text "At: ") (TE.Quote at))
                  )
              )
          )
      )
  ) =>
  IsNotNull at param IgnoreArg
else instance
  ( IsNotNull at param arg
  ) =>
  IsNotNull at (AsGql gqlName param) arg
else instance
  ( IsNotNull at param l
  , IsNotNull at param r
  ) =>
  IsNotNull at param (OrArg l r)
else instance IsNotNull at param arg

class HMapWithIndex (ArgPropToGql p) { | a } u <= RecordArg p a u

instance recordArg :: HMapWithIndex (ArgPropToGql p) { | a } u => RecordArg p a u

newtype ArgPropToGql params = ArgPropToGql { | params }

instance
  ( IsSymbol sym
  , Row.Cons sym param rest params
  , ArgGqlAt sym param arg
  , SatisfyNotNullParam param arg
  ) =>
  MappingWithIndex (ArgPropToGql params) (Proxy sym) arg Unit where
  mappingWithIndex (ArgPropToGql _) _ _ = unit

class SatisfyNotNullParam (param :: Type) (arg :: Type) | param -> arg

instance satisfyNotNullParamRecord ::
  HFoldlWithIndex (ArgsSatisfyNotNullsProps arg) Unit { | param } Unit =>
  SatisfyNotNullParam { | param } { | arg }
else instance satisfyNotNullParamNotNull :: SatisfyNotNullParam param arg => SatisfyNotNullParam (NotNull param) arg
else instance satisfyNotNullParamOther :: SatisfyNotNullParam param arg

newtype ArgsSatisfyNotNullsProps args = ArgsSatisfyNotNullsProps { | args }

instance argsSatisfyNotNulls_ ::
  ( IsSymbol sym
  , SatisfyNotNullParam param arg
  , Row.Cons sym arg rest args
  ) =>
  FoldingWithIndex (ArgsSatisfyNotNullsProps args) (Proxy sym) Unit (NotNull param) Unit where
  foldingWithIndex (ArgsSatisfyNotNullsProps _) _ _ _ = unit
else instance argsSatisfyOthers_ ::
  FoldingWithIndex (ArgsSatisfyNotNullsProps args) (Proxy sym) Unit param Unit where
  foldingWithIndex (ArgsSatisfyNotNullsProps _) _ _ _ = unit

