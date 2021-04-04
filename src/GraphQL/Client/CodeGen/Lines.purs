module GraphQL.Client.CodeGen.Lines where

import Prelude

import Data.Foldable (class Foldable, foldMap)
import Data.String (joinWith)
import Data.String.Regex (split)
import Data.String.Regex.Flags (global)
import Data.String.Regex.Unsafe (unsafeRegex)

docComment :: forall m. Foldable m => m String -> String
docComment = foldMap (\str -> "\n" <> prependLines " -- | " str <> "\n")

indent :: String -> String
indent = prependLines "  "

prependLines :: String -> String -> String
prependLines pre =
  toLines
    >>> map (\l -> if l == "" then l else pre <> l)
    >>> fromLines

toLines :: String -> Array String
toLines = split (unsafeRegex """\n""" global)

fromLines :: Array String -> String
fromLines = joinWith "\n"