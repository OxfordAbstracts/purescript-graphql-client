exports.getQueryCode = (app) => {

  const js = `exports.runGql${app} = function(x) { return x(); };`;
  const purs = `module GeneratedGql.${app}.Query where

import Affjax.RequestHeader (RequestHeader(..))
import Control.Alt ((<|>))
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import Effect.Aff (Aff)
import GeneratedGql.${app}.Schema (QueryRoot)
import GraphQL.Client.Query (class GqlQuery)
import GraphQL.Client.Query as GQL
import Type.Proxy (Proxy(..))

class Gql${app}

foreign import runGql${app} :: forall a. (Gql${app} => a) -> (a)

gqlQuery${app} ::
  forall returns query.
  Gql${app} =>
  GqlQuery QueryRoot query returns =>
  DecodeHasura returns =>
  String -> query -> Aff returns
gqlQuery${app} name query = queryRegular <|> queryProxy
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
      [ RequestHeader "X-Hasura-Role" "${app}"
      ]
  
`;

  return { js, purs };
};
