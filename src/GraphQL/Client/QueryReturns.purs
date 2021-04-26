module GraphQL.Client.QueryReturns (queryReturns, class QueryReturns, queryReturnsImpl, PropToSchemaType) where

import Prelude

import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Symbol (class IsSymbol)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Args (class SatisifyNotNullParam, ArgPropToGql, Args(..), Params)
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

class QueryReturns schema query returns | schema query -> returns where
  -- | Do not use this. Use `queryReturns` instead. Only exported due to compiler restrictions
  queryReturnsImpl :: schema -> query -> returns -- TODO: use Proxies here so undefined is not needed

instance queryReturnsArray :: QueryReturns a q t => QueryReturns (Array a) q (Array t) where
  queryReturnsImpl _ q = pure $ queryReturnsImpl (undefined :: a) q
else instance queryReturnsMaybe :: QueryReturns a q t => QueryReturns (Maybe a) q (Maybe t) where
  queryReturnsImpl _ q = pure $ queryReturnsImpl (undefined :: a) q
else instance queryReturnsParamsArgs ::
  ( QueryReturns t q result
  , HMapWithIndex (ArgPropToGql params) { | args } s
  , SatisifyNotNullParam {|params} {|args}
  ) =>
  QueryReturns (Params  {|params} t) (Args {|args} q) result where
  queryReturnsImpl _ (Args _ q) = queryReturnsImpl (undefined :: t) q
else instance queryReturnsParamsNoArgs ::
  ( QueryReturns t q result
  , SatisifyNotNullParam {|params} {}
  ) =>
  QueryReturns (Params  {|params} t) q result where
  queryReturnsImpl _ q = queryReturnsImpl (undefined :: t) q
else instance queryReturnsRecord ::
  HMapWithIndex (PropToSchemaType schema) query returns =>
  QueryReturns { | schema } query returns where
  queryReturnsImpl = propToSchemaType
else instance queryReturnsNewtype ::
  ( Newtype newtypeSchema {|schema}
  , QueryReturns {|schema} {|query} returns
  ) =>
  QueryReturns newtypeSchema {|query} returns where
  queryReturnsImpl sch query = queryReturnsImpl (unwrap sch) query
else instance queryReturnsAll :: QueryReturns a q a where
  queryReturnsImpl a _ = a
  
-- | For internal use only but must be exported for other modules to compile
newtype PropToSchemaType schema
  = PropToSchemaType { | schema }

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

propToSchemaType ::
  forall query returns schema.
  HMapWithIndex (PropToSchemaType schema) query returns =>
  Record schema -> query -> returns
propToSchemaType schema query_ = hmapWithIndex (PropToSchemaType schema) query_


foreign import undefined :: forall a. a