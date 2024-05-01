module GraphQL.Client.QueryReturns
  ( PropToSchemaType
  , class QueryReturns
  , class QueryReturnsAt
  , queryReturns
  , queryReturnsAtImpl
  ) where

import Prelude

import Data.Identity (Identity(..))
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Symbol (class IsSymbol)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Alias.Dynamic (Spread, SpreadRes)
import GraphQL.Client.Args (class SatisifyNotNullParam, ArgPropToGql, Args(..))
import GraphQL.Client.AsGql (AsGql)
import GraphQL.Client.Directive (ApplyDirective)
import GraphQL.Client.ErrorBoundary (BoundaryResult, ErrorBoundary)
import GraphQL.Client.ErrorBoundary as ErrorBoundary
import GraphQL.Client.Union (GqlUnion, UnionReturned)
import GraphQL.Client.Variable (Var)
import GraphQL.Client.Variables (WithVars)
import Heterogeneous.Mapping (class HMapWithIndex, class MappingWithIndex, hmapWithIndex)
import Prim.Row as Row
import Prim.TypeError as TE
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

class QueryReturns :: forall k1 k2 k3. k1 -> k2 -> k3 -> Constraint
class QueryReturns schema query returns | schema query -> returns

instance QueryReturnsAt any schema query returns => QueryReturns schema query returns

class QueryReturnsAt :: Symbol -> Type -> Type -> Type -> Constraint
class QueryReturnsAt at schema query returns | schema query -> returns where
  -- | Do not use this. Use `queryReturns` instead. Only exported due to compiler restrictions
  queryReturnsAtImpl :: Proxy at -> schema -> query -> returns -- TODO: use Proxies or remove member here so undefined is not needed

instance queryReturnsWithVars :: QueryReturnsAt at a q t => QueryReturnsAt at a (WithVars q vars) t where
  queryReturnsAtImpl at a _ = queryReturnsAtImpl at a (undefined :: q)
else instance queryReturnsVar :: QueryReturnsAt at a q t => QueryReturnsAt at a (Var name q) t where
  queryReturnsAtImpl at a _ = queryReturnsAtImpl at a (undefined :: q)
else instance queryReturnsGqlType :: QueryReturnsAt at a q t => QueryReturnsAt at (AsGql gql a) q t where
  queryReturnsAtImpl at _ q = queryReturnsAtImpl at (undefined :: a) q
else instance queryReturnsApplyDirective :: QueryReturnsAt at a q t => QueryReturnsAt at a (ApplyDirective name args q) t where
  queryReturnsAtImpl at a _ = queryReturnsAtImpl at a (undefined :: q)
else instance queryReturnsIdentity :: QueryReturnsAt at a q t => QueryReturnsAt at a (Identity q) (Identity t) where
  queryReturnsAtImpl at a _ = Identity $ queryReturnsAtImpl at a (undefined :: q)  
else instance queryReturnErrorBoundary :: QueryReturnsAt at a q t => QueryReturnsAt at a (ErrorBoundary q) (BoundaryResult Unit t) where
  queryReturnsAtImpl at a _ = ErrorBoundary.Result $ queryReturnsAtImpl at a (undefined :: q)
else instance queryReturnsSpread ::
  ( IsSymbol alias
  , Row.Cons alias subSchema rest schema
  , QueryReturnsAt at subSchema (Args args q) returns
  ) =>
  QueryReturnsAt at { | schema } (Spread (Proxy alias) args q) (SpreadRes returns) where
  queryReturnsAtImpl at _ _ = undefined
else instance queryReturnsSpreadNewtype ::
  ( QueryReturnsAt at { | schema } (Spread (Proxy alias) args q) (SpreadRes returns)
  , Newtype newtypeSchema { | schema }
  ) =>
  QueryReturnsAt at newtypeSchema (Spread (Proxy alias) args q) (SpreadRes returns) where
  queryReturnsAtImpl at _ _ = undefined
else instance queryReturnsArray :: QueryReturnsAt at a q t => QueryReturnsAt at (Array a) q (Array t) where
  queryReturnsAtImpl at _ q = pure $ queryReturnsAtImpl at (undefined :: a) q
else instance queryReturnsMaybe :: QueryReturnsAt at a q t => QueryReturnsAt at (Maybe a) q (Maybe t) where
  queryReturnsAtImpl at _ q = pure $ queryReturnsAtImpl at (undefined :: a) q
else instance queryReturnsUnion ::
  HMapWithIndex (PropToSchemaType schema) { | query} { | returns } =>
  QueryReturnsAt at (GqlUnion schema) (GqlUnion query) (UnionReturned returns) where
  queryReturnsAtImpl _ _ _ = undefined
else instance queryReturnsParamsArgs ::
  ( QueryReturnsAt at t q result
  , HMapWithIndex (ArgPropToGql params) { | args } s
  , SatisifyNotNullParam { | params } { | args }
  ) =>
  QueryReturnsAt at ({ | params } -> t) (Args { | args } q) result where
  queryReturnsAtImpl at _ (Args _ q) = queryReturnsAtImpl at (undefined :: t) q
else instance queryReturnsParamsNoArgs ::
  ( QueryReturnsAt at t q result
  , SatisifyNotNullParam { | params } {}
  ) =>
  QueryReturnsAt at ({ | params } -> t) q result where
  queryReturnsAtImpl at _ q = queryReturnsAtImpl at (undefined :: t) q
else instance queryReturnsRecord ::
  HMapWithIndex (PropToSchemaType schema) query returns =>
  QueryReturnsAt at { | schema } query returns where
  queryReturnsAtImpl at = propToSchemaType
else instance queryReturnsNewtype ::
  ( Newtype newtypeSchema { | schema }
  , QueryReturnsAt at { | schema } { | query } returns
  ) =>
  QueryReturnsAt at newtypeSchema { | query } returns where
  queryReturnsAtImpl at sch query = queryReturnsAtImpl at (unwrap sch) query
else instance queryReturnsAll :: QueryReturnsAt at a q a where
  queryReturnsAtImpl _ a _ = a
else instance queryReturnsMismatch ::
  ( TE.Fail
      ( TE.Above
          (TE.Text "Query return type mismatch: ")
          ( TE.Beside
              (TE.Text "  ")
              ( TE.Above
                  (TE.Beside (TE.Text "Schema type: ") (TE.Quote schema))
                  ( TE.Above (TE.Beside (TE.Text "Incorrect return type: ") (TE.Quote returns))
                      (TE.Beside (TE.Text "At: ") (TE.Quote at))
                  )

              )
          )
      )
  ) =>
  QueryReturnsAt at schema query returns where
  queryReturnsAtImpl _ _ _ = undefined

-- | For internal use only but must be exported for other modules to compile
newtype PropToSchemaType schema = PropToSchemaType { | schema }

instance propToSchemaTypeAlias ::
  ( IsSymbol sym
  , IsSymbol al
  , Row.Cons al subSchema rest schema
  , QueryReturnsAt sym subSchema val returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) (Alias (Proxy al) val) returns where
  mappingWithIndex (PropToSchemaType schema) _ (Alias al val) =
    let
      subSchema = Record.get al schema
    in
      queryReturnsAtImpl (Proxy :: _ sym) subSchema val
else instance propToSchemaTypeProxyAlias ::
  ( IsSymbol sym
  , IsSymbol val
  , Row.Cons val subSchema rest schema
  , QueryReturnsAt sym subSchema (Proxy val) returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) (Proxy val) returns where
  mappingWithIndex (PropToSchemaType schema) _ val =
    let
      subSchema = Record.get val schema
    in
      queryReturnsAtImpl (Proxy :: _ sym) subSchema val
else instance propToSchemaType_ ::
  ( IsSymbol sym
  , Row.Cons sym subSchema rest schema
  , QueryReturnsAt sym subSchema val returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) val returns where
  mappingWithIndex (PropToSchemaType schema) sym val =
    let
      subSchema = Record.get sym schema
    in
      queryReturnsAtImpl (Proxy :: _ sym) subSchema val

propToSchemaType
  :: forall query returns schema
   . HMapWithIndex (PropToSchemaType schema) query returns
  => Record schema
  -> query
  -> returns
propToSchemaType schema query_ = hmapWithIndex (PropToSchemaType schema) query_

undefined :: forall a. a
undefined = unsafeCoerce unit
