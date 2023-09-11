module GraphQL.Client.GqlQueryVars where

import Prelude

import Data.List (List(..))
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (Args(..))
import GraphQL.Client.Directive (ApplyDirective(..))
import GraphQL.Client.ErrorBoundary (ErrorBoundary(..))
import GraphQL.Client.GqlType (class BoolRuntime, class GqlType, AsGql, printGqlType)
import GraphQL.Client.Union (GqlUnion(..))
import GraphQL.Client.Variable (Var)
import GraphQL.Client.Variables (WithVars(..))
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex, hfoldlWithIndex)
import Prim.Row as Row
import Type.Proxy (Proxy(..))

-- | The vars in the query and their GraphQL type

type GqlQueryVars = List { varName :: String, varType :: String }

newtype GqlQueryVarsN = GqlQueryVarsN GqlQueryVars

-- | Get 
class GetGqlQueryVars :: forall k. k -> Type -> Constraint
class GetGqlQueryVars schema query where
  getGqlQueryVars :: Proxy schema -> query -> GqlQueryVars

instance queryVarsWithVars :: GetGqlQueryVars a q => GetGqlQueryVars a (WithVars q vars) where
  getGqlQueryVars a (WithVars _ q _) = getGqlQueryVars a q
else instance queryVarsVar ::
  ( GetGqlQueryVars a q
  , IsSymbol name
  , GqlType a gqlName nullable
  , IsSymbol gqlName
  , BoolRuntime nullable
  ) =>
  GetGqlQueryVars a (Var name q) where
  getGqlQueryVars _ _ = pure
    { varName: reflectSymbol (Proxy :: Proxy name)
    , varType: printGqlType (Proxy :: _ a)
    }
else instance queryVarsGqlType :: GetGqlQueryVars a q => GetGqlQueryVars (AsGql gql a) q where
  getGqlQueryVars _ q = getGqlQueryVars (Proxy :: Proxy a) q
else instance queryVarsApplyDirective :: GetGqlQueryVars a q => GetGqlQueryVars a (ApplyDirective name args q) where
  getGqlQueryVars a (ApplyDirective args q) = getGqlQueryVars a q
else instance queryReturnErrorBoundary :: GetGqlQueryVars a q => GetGqlQueryVars a (ErrorBoundary q) where
  getGqlQueryVars a (ErrorBoundary q) = getGqlQueryVars a q
else instance queryVarsSpread ::
  ( IsSymbol alias
  , Row.Cons alias subSchema rest schema
  , GetGqlQueryVars subSchema (Args (Array args) q)
  ) =>
  GetGqlQueryVars { | schema } (Spread (Proxy alias) args q) where
  getGqlQueryVars _ (Spread alias args fields) =
    getGqlQueryVars (Proxy :: Proxy subSchema) (Args args fields)
else instance queryVarsSpreadNewtype ::
  ( GetGqlQueryVars { | schema } (Spread (Proxy alias) args q)
  , Newtype newtypeSchema { | schema }
  ) =>
  GetGqlQueryVars newtypeSchema (Spread (Proxy alias) args q) where
  getGqlQueryVars _ _ = getGqlQueryVars (Proxy :: Proxy { | schema }) (Proxy :: Proxy (Spread (Proxy alias) args q))
else instance queryVarsArray :: GetGqlQueryVars a q => GetGqlQueryVars (Array a) q where
  getGqlQueryVars _ q = getGqlQueryVars (Proxy :: Proxy a) q
else instance queryVarsMaybe :: GetGqlQueryVars a q => GetGqlQueryVars (Maybe a) q where
  getGqlQueryVars _ q = getGqlQueryVars (Proxy :: Proxy a) q
else instance queryVarsUnion ::
  HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN =>
  GetGqlQueryVars (GqlUnion schema) (GqlUnion query) where
  getGqlQueryVars _ (GqlUnion q) = propGetVars (Proxy :: Proxy { | schema }) q
else instance queryVarsParamsArgs ::
  ( GetGqlQueryVars t q
  ) =>
  GetGqlQueryVars ({ | params } -> t) (Args { | args } q) where
  getGqlQueryVars _ (Args _ q) = getGqlQueryVars (Proxy :: Proxy t) q
else instance queryVarsParamsNoArgs ::
  ( GetGqlQueryVars t q
  ) =>
  GetGqlQueryVars ({ | params } -> t) q where
  getGqlQueryVars _ q = getGqlQueryVars (Proxy :: Proxy t) q
else instance queryVarsRecord ::
  HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN =>
  GetGqlQueryVars { | schema } { | query } where
  getGqlQueryVars = propGetVars
else instance queryVarsNewtype ::
  ( Newtype newtypeSchema { | schema }
  , HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN
  , GetGqlQueryVars { | schema } (Proxy { | query })
  ) =>
  GetGqlQueryVars newtypeSchema { | query } where
  getGqlQueryVars _sch query = getGqlQueryVars (Proxy :: Proxy { | schema }) query

else instance queryVarsAll :: GetGqlQueryVars a q where
  getGqlQueryVars _a _ = Nil

-- -- | For internal use only but must be exported for other modules to compile
data PropGetVars :: forall k. k -> Type
data PropGetVars schema = PropGetVars

instance propGetVarsAlias ::
  ( IsSymbol sym
  , IsSymbol al
  , Row.Cons al subSchema rest schema
  , GetGqlQueryVars subSchema val
  ) =>
  FoldingWithIndex (PropGetVars { | schema }) (Proxy sym) GqlQueryVarsN ((Alias (Proxy al) val)) GqlQueryVarsN where
  foldingWithIndex (PropGetVars) _sym (GqlQueryVarsN qv) (Alias _ val) =
    GqlQueryVarsN $ qv <> getGqlQueryVars (Proxy :: Proxy subSchema) val
else instance propGetVarsProxy ::
  ( IsSymbol sym
  ) =>
  FoldingWithIndex (PropGetVars {|schema}) (Proxy sym) GqlQueryVarsN (Proxy val) GqlQueryVarsN where
  foldingWithIndex (PropGetVars) _ (GqlQueryVarsN qv) _ =
    GqlQueryVarsN qv
else instance propGetVars_ ::
  ( IsSymbol sym
  , Row.Cons sym subSchema rest schema
  , GetGqlQueryVars subSchema val
  ) =>
  FoldingWithIndex (PropGetVars { | schema }) (Proxy sym) GqlQueryVarsN val GqlQueryVarsN where
  foldingWithIndex (PropGetVars) _sym (GqlQueryVarsN qv) val =
    GqlQueryVarsN $ qv <> getGqlQueryVars (Proxy :: Proxy subSchema) val

propGetVars
  :: forall query schema
   . HFoldlWithIndex (PropGetVars schema) GqlQueryVarsN (query) GqlQueryVarsN
  => Proxy schema
  -> query
  -> GqlQueryVars
propGetVars _schema _q = unwrapGqlQueryVars $
  hfoldlWithIndex (PropGetVars :: PropGetVars schema) (GqlQueryVarsN mempty) _q
  where
  unwrapGqlQueryVars :: GqlQueryVarsN -> GqlQueryVars
  unwrapGqlQueryVars (GqlQueryVarsN qv) = qv
