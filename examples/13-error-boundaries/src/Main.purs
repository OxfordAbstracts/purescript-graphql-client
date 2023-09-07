module Main where

import Prelude

import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Either (Either(..))
import Data.Foldable (fold)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class (liftEffect)
import Effect.Class.Console (logShow)
import GraphQL.Client.Args ((=>>))
import GraphQL.Client.BaseClients.Urql (UrqlClient, createClient)
import GraphQL.Client.ErrorBoundary (BoundaryResult(..), ErrorBoundary(..), putErrorsInPaths)
import GraphQL.Client.Operation (OpQuery)
import GraphQL.Client.Query (queryFullRes)
import GraphQL.Client.Types (class GqlQuery, Client, GqlRes)
import Type.Data.List (Nil')
import Type.Proxy (Proxy(..))

main :: Effect Unit
main =
  launchAff_ do
    { data_, errors } <-
      queryGql "widgets_aliased"
        { widgets:
            { id: 1
            } =>>
              { name
              , contains_bad_type: ErrorBoundary
                  { id: unit
                  , incorrect_type: unit
                  }
              }
        }
    logShow data_ -- will log the data with tge decode error at the error boundary but without error details

    let
      withErrors = putErrorsInPaths (fold errors) data_ -- will contain the data with the decode error and gql error details at the error boundaries

      errorPath = case withErrors of
        Right { widgets: [ { contains_bad_type: Error _ [ { path } ] } ] } -> path
        _ -> Nothing

    logShow errorPath -- will log the error path from the gql error details

-- Run gql query
queryGql
  :: forall query returns
   . GqlQuery Nil' OpQuery Schema query returns
  => DecodeJson returns
  => String
  -> query
  -> Aff (GqlRes returns)
queryGql name_ q = do
  client <-
    liftEffect
      $ createClient
          { url: "http://localhost:4000/graphql"
          , headers: []
          }
  queryFullRes decodeJson identity (client :: Client UrqlClient { directives :: Proxy Nil', query :: Schema | _ }) name_ q

-- Schema
type Schema =
  { prop :: String
  , widgets :: { id :: Int } -> Array Widget
  }

type Widget =
  { name :: String
  , id :: Int
  , contains_bad_type :: BadType
  }

type BadType =
  { id :: Int
  , incorrect_type :: Int
  }

-- Symbols
prop :: Proxy "prop"
prop = Proxy

name :: Proxy "name"
name = Proxy

widgets :: Proxy "widgets"
widgets = Proxy
