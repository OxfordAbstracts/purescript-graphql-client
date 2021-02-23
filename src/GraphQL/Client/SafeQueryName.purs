module GraphQL.Client.SafeQueryName (safeQueryName) where

import Prelude
import Data.Array (filter)
import Data.Char.Unicode (isAlphaNum)
import Data.String.CodeUnits (fromCharArray, toCharArray)

safeQueryName :: String -> String
safeQueryName name =
  name
    # toCharArray
    <#> (\ch -> if ch == ' ' then '_' else ch)
    # filter (isAlphaNum || eq '_')
    # fromCharArray
    # \s -> if s == "" then "unnamed_query" else s
