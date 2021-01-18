module GraphQL.Client.ToGqlString where

import Prelude
import Data.Array (intercalate, length, mapWithIndex)
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Monoid (guard, power)
import Data.String (joinWith)
import Data.String.Regex (split)
import Data.String.Regex.Flags (global)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Symbol (class IsSymbol, SProxy(..), reflectSymbol)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Args (AndArg(..), Args(..))
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex, hfoldlWithIndex)

-- | Generate a GraphQL query from its purs representation
toGqlQueryString :: forall q. GqlQueryString q => q -> String
toGqlQueryString =
  toGqlQueryStringImpl
    { indentation: Nothing
    }

-- | Generate a GraphQL query from its purs representation, formatted with indentation for human readability
toGqlQueryStringFormatted :: forall q. GqlQueryString q => q -> String
toGqlQueryStringFormatted =
  toGqlQueryStringImpl
    { indentation: Just 2
    }

type ToGqlQueryStringOptions
  = { indentation :: Maybe Int
    }

class GqlQueryString q where
  toGqlQueryStringImpl :: ToGqlQueryStringOptions -> q -> String

instance gqlQueryStringUnit :: GqlQueryString Unit where
  toGqlQueryStringImpl _ _ = ""
else instance gqlQueryStringSymbol :: IsSymbol s => GqlQueryString (SProxy s) where
  toGqlQueryStringImpl _ _ = ": " <> reflectSymbol (SProxy :: SProxy s)
else instance gqlQueryStringArgs ::
  ( HFoldlWithIndex PropToGqlArg String (Record args) String
  , GqlQueryString (Record body)
  ) =>
  GqlQueryString (Args { | args } (Record body)) where
  toGqlQueryStringImpl opts (Args args body) =
    gqlArgStringRecordTopLevel args
      <> toGqlQueryStringImpl opts body
else instance gqlQueryStringEmptyRecord ::
  HFoldlWithIndex PropToGqlString String (Record r) String =>
  GqlQueryString (Record r) where
  toGqlQueryStringImpl r = gqlQueryStringRecord r

data PropToGqlString
  = PropToGqlString ToGqlQueryStringOptions

instance propToGqlStringAlias ::
  ( GqlQueryString a
  , IsSymbol sym
  , IsSymbol alias
  ) =>
  FoldingWithIndex PropToGqlString (SProxy sym) String (Alias (SProxy alias) a) String where
  foldingWithIndex (PropToGqlString opts) prop str (Alias alias a) =
    str <> nl
      <> reflectSymbol prop
      <> ": "
      <> reflectSymbol alias
      <> toGqlQueryStringImpl opts a
    where
    nl = if isJust opts.indentation then "\n" else " "
else instance propToGqlString ::
  ( GqlQueryString a
  , IsSymbol sym
  ) =>
  FoldingWithIndex PropToGqlString (SProxy sym) String a String where
  foldingWithIndex (PropToGqlString opts) prop str a =
    str <> nl
      <> reflectSymbol prop
      <> toGqlQueryStringImpl opts a
    where
    nl = if isJust opts.indentation then "\n" else " "

gqlQueryStringRecord ::
  forall r.
  ToGqlQueryStringOptions ->
  HFoldlWithIndex PropToGqlString String { | r } String =>
  { | r } ->
  String
gqlQueryStringRecord opts r = indent $ " {" <> hfoldlWithIndex (PropToGqlString opts) "" r <> nl <> "}"
  where
  multiline = isJust opts.indentation

  nl = guard multiline "\n"

  indent :: String -> String
  indent str = case opts.indentation of
    Just indentation ->
      let
        lines = toLines str
      in
        lines
          # mapWithIndex (\i l -> if i == 0 || i == (length lines - 1) then l else (power " " indentation) <> l)
          # joinWith nl
    _ -> str

  toLines :: String -> Array String
  toLines = split (unsafeRegex """\n""" global)

toGqlArgString :: forall q. GqlArgString q => q -> String
toGqlArgString = toGqlArgStringImpl

class GqlArgString q where
  toGqlArgStringImpl :: q -> String

instance gqlArgStringString :: GqlArgString String where
  toGqlArgStringImpl = show
else instance gqlArgStringInt :: GqlArgString Int where
  toGqlArgStringImpl = show
else instance gqlArgStringNumber :: GqlArgString Number where
  toGqlArgStringImpl = show
else instance gqlArgStringBoolean :: GqlArgString Boolean where
  toGqlArgStringImpl = show
else instance gqlArgStringMaybe :: GqlArgString a => GqlArgString (Maybe a) where
  toGqlArgStringImpl = maybe "" toGqlArgStringImpl
else instance gqlArgStringArray :: GqlArgString a => GqlArgString (Array a) where
  toGqlArgStringImpl = map toGqlArgStringImpl >>> \as -> "[" <> intercalate ", " as <> "]"
else instance gqlArgStringAndArg ::
  ( GqlAndArgString (AndArg a1 a2)
  ) =>
  GqlArgString (AndArg a1 a2) where
  toGqlArgStringImpl andArg = "[" <> toGqlAndArgStringImpl andArg <> "]"
else instance gqlArgStringRecord_ :: HFoldlWithIndex PropToGqlArg String (Record r) String => GqlArgString (Record r) where
  toGqlArgStringImpl r = gqlArgStringRecord r

class GqlAndArgString q where
  toGqlAndArgStringImpl :: q -> String

instance gqlArgStringAndArgNotEnd ::
  ( GqlArgString a1
  , GqlAndArgString (AndArg a2 a3)
  ) =>
  GqlAndArgString (AndArg a1 (AndArg a2 a3)) where
  toGqlAndArgStringImpl (AndArg head tail) = toGqlArgStringImpl head <> ", " <> toGqlAndArgStringImpl tail
else instance gqlArgStringAndArgEnd ::
  ( GqlArgString a1
  , GqlArgString a2
  ) =>
  GqlAndArgString (AndArg a1 a2) where
  toGqlAndArgStringImpl (AndArg a1 a2) = toGqlArgStringImpl a1 <> ", " <> toGqlArgStringImpl a2 

data PropToGqlArg
  = PropToGqlArg

instance propToGqlArg ::
  ( GqlArgString a
  , IsSymbol sym
  ) =>
  FoldingWithIndex PropToGqlArg (SProxy sym) String a String where
  foldingWithIndex PropToGqlArg prop str a = pre <> reflectSymbol prop <> ": " <> toGqlArgStringImpl a
    where
    pre = if str == "" then "" else str <> ", "

gqlArgStringRecord ::
  forall r.
  HFoldlWithIndex PropToGqlArg String { | r } String =>
  { | r } ->
  String
gqlArgStringRecord r = "{" <> hfoldlWithIndex PropToGqlArg "" r <> "}"

gqlArgStringRecordTopLevel ::
  forall r.
  HFoldlWithIndex PropToGqlArg String { | r } String =>
  { | r } ->
  String
gqlArgStringRecordTopLevel r = "(" <> hfoldlWithIndex PropToGqlArg "" r <> ")"
