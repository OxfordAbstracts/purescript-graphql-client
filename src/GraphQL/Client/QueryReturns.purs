module GraphQL.Client.QueryReturns (queryReturns, class QueryReturns, queryReturnsImpl, PropToSchemaType) where

import Prelude

import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Symbol (class IsSymbol)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Alias.Dynamic (Spread, SpreadRes)
import GraphQL.Client.Args (class SatisifyNotNullParam, ArgPropToGql, Args(..))
import GraphQL.Client.Directive (ApplyDirective)
import GraphQL.Client.ErrorBoundary (BoundaryResult, ErrorBoundary)
import GraphQL.Client.ErrorBoundary as ErrorBoundary
import GraphQL.Client.GqlType (class GqlType, AsGql)
import GraphQL.Client.Union (GqlUnion, UnionReturned)
import GraphQL.Client.Variable (Var)
import GraphQL.Client.Variables (WithVars)
import Heterogeneous.Mapping (class HMapWithIndex, class MappingWithIndex, hmapWithIndex)
import Prim.Row as Row
import Record as Record
import Type.Proxy (Proxy(..))
import Unsafe.Coerce (unsafeCoerce)

-- | Get the type that a query returns.
queryReturns
  :: forall schema query returns
   . QueryReturns schema query returns
  => Proxy schema
  -> query
  -> Proxy returns
queryReturns _ _ = Proxy

class QueryReturns schema query returns | schema query -> returns where
  -- | Do not use this. Use `queryReturns` instead. Only exported due to compiler restrictions
  queryReturnsImpl :: schema -> query -> returns -- TODO: use Proxies or remove member here so undefined is not needed

instance queryReturnsWithVars :: QueryReturns a q t => QueryReturns a (WithVars q vars) t where
  queryReturnsImpl a _ = queryReturnsImpl a (undefined :: q)
else instance queryReturnsVar :: QueryReturns a q t => QueryReturns a (Var name q) t where
  queryReturnsImpl a _ = queryReturnsImpl a (undefined :: q)
else instance queryReturnsGqlType :: QueryReturns a q t => QueryReturns (AsGql gql a) q t where
  queryReturnsImpl _ q = queryReturnsImpl (undefined :: a) q
else instance queryReturnsApplyDirective :: QueryReturns a q t => QueryReturns a (ApplyDirective name args q) t where
  queryReturnsImpl a _ = queryReturnsImpl a (undefined :: q)
else instance queryReturnErrorBoundary :: QueryReturns a q t => QueryReturns a (ErrorBoundary q) (BoundaryResult Unit t) where
  queryReturnsImpl a _ = ErrorBoundary.Result $ queryReturnsImpl a (undefined :: q)
else instance queryReturnsSpread ::
  ( IsSymbol alias
  , Row.Cons alias subSchema rest schema
  , QueryReturns subSchema (Args args q) returns
  ) =>
  QueryReturns { | schema } (Spread (Proxy alias) args q) (SpreadRes returns) where
  queryReturnsImpl _ _ = undefined
else instance queryReturnsSpreadNewtype ::
  ( QueryReturns { | schema } (Spread (Proxy alias) args q) (SpreadRes returns)
  , Newtype newtypeSchema { | schema }
  ) =>
  QueryReturns newtypeSchema (Spread (Proxy alias) args q) (SpreadRes returns) where
  queryReturnsImpl _ _ = undefined
else instance queryReturnsArray :: QueryReturns a q t => QueryReturns (Array a) q (Array t) where
  queryReturnsImpl _ q = pure $ queryReturnsImpl (undefined :: a) q
else instance queryReturnsMaybe :: QueryReturns a q t => QueryReturns (Maybe a) q (Maybe t) where
  queryReturnsImpl _ q = pure $ queryReturnsImpl (undefined :: a) q
else instance queryReturnsUnion ::
  HMapWithIndex (PropToSchemaType schema) (Record query) (Record returns) =>
  QueryReturns (GqlUnion schema) (GqlUnion query) (UnionReturned returns) where
  queryReturnsImpl _ _ = undefined
else instance queryReturnsParamsArgs ::
  ( QueryReturns t q result
  , HMapWithIndex (ArgPropToGql params) { | args } s
  , SatisifyNotNullParam { | params } { | args }
  ) =>
  QueryReturns ({ | params } -> t) (Args { | args } q) result where
  queryReturnsImpl _ (Args _ q) = queryReturnsImpl (undefined :: t) q
else instance queryReturnsParamsNoArgs ::
  ( QueryReturns t q result
  , SatisifyNotNullParam { | params } {}
  ) =>
  QueryReturns ({ | params } -> t) q result where
  queryReturnsImpl _ q = queryReturnsImpl (undefined :: t) q
else instance queryReturnsRecord ::
  HMapWithIndex (PropToSchemaType schema) query returns =>
  QueryReturns { | schema } query returns where
  queryReturnsImpl = propToSchemaType
else instance queryReturnsNewtype ::
  ( Newtype newtypeSchema { | schema }
  , QueryReturns { | schema } { | query } returns
  ) =>
  QueryReturns newtypeSchema { | query } returns where
  queryReturnsImpl sch query = queryReturnsImpl (unwrap sch) query
else instance queryReturnsAll :: QueryReturns a q a where
  queryReturnsImpl a _ = a

-- | For internal use only but must be exported for other modules to compile
newtype PropToSchemaType schema = PropToSchemaType { | schema }

instance propToSchemaTypeAlias ::
  ( IsSymbol sym
  , IsSymbol al
  , Row.Cons al subSchema rest schema
  , QueryReturns subSchema val returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) (Alias (Proxy al) val) returns where
  mappingWithIndex (PropToSchemaType schema) _ (Alias al val) =
    let
      subSchema = Record.get al schema
    in
      queryReturnsImpl subSchema val
else instance propToSchemaTypeProxyAlias ::
  ( IsSymbol sym
  , IsSymbol val
  , Row.Cons val subSchema rest schema
  , QueryReturns subSchema (Proxy val) returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) (Proxy val) returns where
  mappingWithIndex (PropToSchemaType schema) _ val =
    let
      subSchema = Record.get val schema
    in
      queryReturnsImpl subSchema val
else instance propToSchemaType_ ::
  ( IsSymbol sym
  , Row.Cons sym subSchema rest schema
  , QueryReturns subSchema val returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) val returns where
  mappingWithIndex (PropToSchemaType schema) sym val =
    let
      subSchema = Record.get sym schema
    in
      queryReturnsImpl subSchema val

propToSchemaType
  :: forall query returns schema
   . HMapWithIndex (PropToSchemaType schema) query returns
  => Record schema
  -> query
  -> returns
propToSchemaType schema query_ = hmapWithIndex (PropToSchemaType schema) query_

undefined :: forall a. a
undefined = unsafeCoerce unit
