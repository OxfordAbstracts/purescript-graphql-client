
module GraphQL.Client.QueryReturns (queryReturns, class QueryReturns, queryReturnsImpl, PropToSchemaType) where

import Prelude

import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Symbol (class IsSymbol)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Alias.Dynamic (Spread, SpreadRes)
import GraphQL.Client.Args (class SatisifyNotNullParam, ArgPropToGql, Args, Params)
import GraphQL.Client.Variable (Var)
import GraphQL.Client.Variables (WithVars)
import Heterogeneous.Mapping (class HMapWithIndex, class MappingWithIndex, hmapWithIndex)
import Prim.Row as Row
import Record as Record
import Type.Proxy (Proxy(..))

-- | Get the type that a query returns. 
queryReturns ::
  forall schema query returns.
  QueryReturns schema query returns =>
  Proxy schema -> query -> Proxy returns
queryReturns _ _ = Proxy

class QueryReturns :: forall k1 k2 k3. k1 -> k2 -> k3 -> Constraint
class QueryReturns schema query returns | schema query -> returns where
  queryReturnsImpl :: Proxy schema -> Proxy query -> Proxy returns 

instance queryReturnsWithVars :: QueryReturns a q t => QueryReturns a (WithVars q vars) t where
  queryReturnsImpl a _ = queryReturnsImpl a (Proxy :: _ q)
else instance queryReturnsVar :: QueryReturns a q t => QueryReturns a (Var name q) t where
  queryReturnsImpl a _ = queryReturnsImpl a (Proxy :: _ q)
else instance queryReturnsSpread ::
  ( IsSymbol alias
  , Row.Cons alias subSchema rest schema
  , QueryReturns subSchema q returns
  ) =>
  QueryReturns { | schema } (Spread (Proxy alias) args q) (SpreadRes returns) where
  queryReturnsImpl _ _ = Proxy
else instance queryReturnsArray :: QueryReturns a q t => QueryReturns (Array a) q (Array t) where
  queryReturnsImpl _ q = pure <$> queryReturnsImpl (Proxy :: _ a) q
else instance queryReturnsMaybe :: QueryReturns a q t => QueryReturns (Maybe a) q (Maybe t) where
  queryReturnsImpl _ q = pure <$> queryReturnsImpl (Proxy :: _ a) q
else instance queryReturnsParamsArgs ::
  ( QueryReturns t q result
  , HMapWithIndex (ArgPropToGql params) { | args } s
  , SatisifyNotNullParam { | params } { | args }
  ) =>
  QueryReturns (Params { | params } t) (Args { | args } q) result where
  queryReturnsImpl _ _ = queryReturnsImpl (Proxy :: _ t) (Proxy :: _ q)

else instance queryReturnsParamsNoArgs ::
  ( QueryReturns t q result
  , SatisifyNotNullParam { | params } {}
  ) =>
  QueryReturns (Params { | params } t) q result where
  queryReturnsImpl _ _ = queryReturnsImpl (Proxy :: _ t) (Proxy :: _ q)

else instance queryReturnsRecord ::
  HMapWithIndex (PropToSchemaType schema) (Proxy query) (Proxy returns) =>
  QueryReturns { | schema } query returns where
  queryReturnsImpl = propToSchemaType
else instance queryReturnsNewtype ::
  ( Newtype newtypeSchema { | schema }
  , QueryReturns { | schema } { | query } returns
  ) =>
  QueryReturns newtypeSchema { | query } returns where
  queryReturnsImpl _ query = queryReturnsImpl (Proxy :: _ { | schema }) query
else instance queryReturnsAll :: QueryReturns a q a where
  queryReturnsImpl a _ = a

-- | For internal use only but must be exported for other modules to compile

newtype PropToSchemaType schema
  = PropToSchemaType (Proxy { | schema })

instance propToSchemaTypeAlias ::
  ( IsSymbol sym
  , IsSymbol al
  , Row.Cons al subSchema rest schema
  , QueryReturns subSchema val returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) (Alias (Proxy al) val) (Proxy returns) where
  mappingWithIndex (PropToSchemaType schema) _ (Alias al val) =
    let
      subSchema = Record.get al <$> schema
    in
      queryReturns subSchema val
else instance propToSchemaTypeProxyAlias ::
  ( IsSymbol sym
  , IsSymbol val
  , Row.Cons val subSchema rest schema
  , QueryReturns subSchema (Proxy val) returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) (Proxy val) (Proxy returns) where
  mappingWithIndex (PropToSchemaType schema) _ val =
    let
      subSchema = Record.get val <$> schema
    in
      queryReturns subSchema val
else instance propToSchemaType_ ::
  ( IsSymbol sym
  , Row.Cons sym subSchema rest schema
  , QueryReturns subSchema val returns
  ) =>
  MappingWithIndex (PropToSchemaType schema) (Proxy sym) val (Proxy returns) where
  mappingWithIndex (PropToSchemaType schema) sym val =
    let
      subSchema = Record.get sym <$> schema
    in
      queryReturns subSchema val
      
propToSchemaType ::
  forall query returns schema.
  HMapWithIndex (PropToSchemaType schema) query returns =>
  Proxy (Record schema) -> query -> returns
propToSchemaType schema query_ = hmapWithIndex (PropToSchemaType schema) query_
