module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console (logShow)
import Generated.Gql.Schema.Admin (Query)
import Generated.Gql.Schema.Admin.Enum.Colour (Colour(..))
import Generated.Gql.Symbols (colour, widgets)
import GraphQL.Client.Alias ((:))
import GraphQL.Client.Args (NotNull, (=>>))
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.Query (query_)
import GraphQL.Client.Types (class Queriable)
import GraphQL.Client.Variable (Var(..))
import GraphQL.Client.Variables (withVars)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { red_widgets, widgets } <-
      queryGql "get_widgets"
        $
          { red_widgets: widgets
              :
                { colour: Var :: _ "colourVar" Colour
                , ids_2: Var :: _ "ids_2" ((Array Int))
                }
              =>> { colour }
          , widgets:
              { ids: Var :: _ "ids" (Array Int)
              , ids_2: Var :: _ "ids_2" ((Array Int))
              } =>> { id: unit }
          }
            `withVars`
              { colourVar: RED
              , ids: [ 1, 2 ]
              , ids_2: [ 3, 4 ]
              }
    -- Will log [ RED ] as there is one red widget
    logShow $ map _.colour red_widgets

    logShow widgets

-- Run gql query
queryGql
  :: forall query returns
   . Queriable Nil' OpQuery Query query returns
  => DecodeJson returns
  => String
  -> query
  -> Aff returns
queryGql = query_ "http://localhost:4000/graphql" (Proxy :: Proxy Query)
