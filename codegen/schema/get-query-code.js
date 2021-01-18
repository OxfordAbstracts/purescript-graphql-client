exports.getQueryCode = (moduleName) => {

  const js = `exports.runGql${moduleName} = function(x) { return x(); };`;
  const purs = `module GeneratedGql.${moduleName}.Query where

import Affjax.RequestHeader (RequestHeader(..))
import Control.Alt ((<|>))
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import Effect.Aff (Aff)
import GeneratedGql.${moduleName}.Schema (QueryRoot)
import GraphQL.Client.Query (class GqlQuery)
import GraphQL.Client.Query as GQL
import Type.Proxy (Proxy(..))

class Gql${moduleName}

foreign import runGql${moduleName} :: forall a. (Gql${moduleName} => a) -> (a)

gqlQuery${moduleName} ::
  forall returns query.
  Gql${moduleName} =>
  GqlQuery QueryRoot query returns =>
  DecodeHasura returns =>
  String -> query -> Aff returns
gqlQuery${moduleName} name query = queryRegular <|> queryProxy
  where 
    queryRegular = 
      mkQuery
      "${hasuraUrl}"

    queryProxy = 
      mkQuery
      "/hasura-proxy"

    mkQuery url = 
      GQL.queryWithDecoder
        decodeHasura
        (Proxy :: Proxy QueryRoot)
        url
        headers
        name
        query

    headers = 
      [ RequestHeader "X-Hasura-Role" "${moduleName}"
      ]
  
`;

  return { js, purs };
};
