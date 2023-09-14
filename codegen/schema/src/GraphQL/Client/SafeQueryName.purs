module GraphQL.Client.SafeQueryName (safeQueryName) where

import Prelude
import Data.Array (filter)
import Data.CodePoint.Unicode (isAlphaNum)
import Data.String.CodeUnits (fromCharArray, toCharArray)
import Data.String.CodePoints (codePointFromChar)

safeQueryName :: String -> String
safeQueryName name =
  name
    # toCharArray
    <#> (\ch -> if ch == ' ' then '_' else ch)
    # filter ((codePointFromChar >>> isAlphaNum) || eq '_')
    # fromCharArray
    # \s -> if s == "" then "unnamed_query" else s
