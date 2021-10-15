module GraphQL.Client.ToGqlString where

import Prelude
import Data.Array (fold, foldMap, intercalate, length, mapWithIndex)
import Data.Array as Array
import Data.Date (Date)
import Data.DateTime (DateTime(..), Millisecond)
import Data.DateTime as DT
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Monoid (guard, power)
import Data.String (codePointFromChar, fromCodePointArray, joinWith, toCodePointArray)
import Data.String.CodeUnits as String
import Data.String.Regex (split)
import Data.String.Regex.Flags (global)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Time (Time)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (AndArgs(AndArgs), Args(..), IgnoreArg, OrArg(..))
import GraphQL.Client.Directive (ApplyDirective(..))
import GraphQL.Client.Variable (Var)
import GraphQL.Client.Variables (WithVars, getQuery)
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex, hfoldlWithIndex)
import Type.Proxy (Proxy(..))

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
else instance gqlQueryStringWithVars :: GqlQueryString query => GqlQueryString (WithVars query vars) where
  toGqlQueryStringImpl opts withVars = toGqlQueryStringImpl opts $ getQuery withVars
else instance gqlQueryStringApplyDirective ::
  ( IsSymbol name
  , HFoldlWithIndex PropToGqlArg String { | args } String
  , GqlQueryString query
  ) =>
  GqlQueryString (ApplyDirective name { | args } query) where
  toGqlQueryStringImpl opts (ApplyDirective args q) =
    "@"
      <> reflectSymbol (Proxy :: Proxy name)
      <> gqlArgStringRecordTopLevel args
      <> toGqlQueryStringImpl opts q
else instance gqlQueryStringSymbol :: IsSymbol s => GqlQueryString (Proxy s) where
  toGqlQueryStringImpl _ _ = ": " <> reflectSymbol (Proxy :: Proxy s)
else instance gqlQueryStringVar :: IsSymbol s => GqlQueryString (Var s a) where
  toGqlQueryStringImpl _ _ = "$" <> reflectSymbol (Proxy :: Proxy s)
else instance gqlQueryStringSpread ::
  ( IsSymbol alias
  , GqlQueryString (Args args fields)
  ) =>
  GqlQueryString (Spread (Proxy alias) args fields) where
  toGqlQueryStringImpl opts (Spread alias args fields) = indent opts $ " {" <> nl <> intercalate nl dynamicFields <> nl <> "}"
    where
    nl = if isJust opts.indentation then "\n" else " "

    dynamicFields =
      args
        # mapWithIndex \idx arg ->
            "_"
              <> show idx
              <> ": "
              <> reflectSymbol alias
              <> toGqlQueryStringImpl opts (Args arg fields)
else instance gqlQueryStringArgsScalar ::
  ( HFoldlWithIndex PropToGqlArg String (Record args) String
    ) =>
  GqlQueryString (Args { | args } Unit) where
  toGqlQueryStringImpl _ (Args args _) = gqlArgStringRecordTopLevel args
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
  FoldingWithIndex PropToGqlString (Proxy sym) String (Alias (Proxy alias) a) String where
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
  FoldingWithIndex PropToGqlString (Proxy sym) String a String where
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
gqlQueryStringRecord opts r = indent opts $ " {" <> hfoldlWithIndex (PropToGqlString opts) "" r <> nl <> "}"
  where
  multiline = isJust opts.indentation

  nl = guard multiline "\n"

indent ::
  forall r.
  { indentation :: Maybe Int
  | r
  } ->
  String -> String
indent opts str = case opts.indentation of
  Just indentation ->
    let
      lines = toLines str
    in
      lines
        # mapWithIndex (\i l -> if i == 0 || i == length lines - 1 then l else power " " indentation <> l)
        # joinWith nl
  _ -> str
  where
  multiline = isJust opts.indentation

  nl = guard multiline "\n"

toLines :: String -> Array String
toLines = split (unsafeRegex """\n""" global)

toGqlArgString :: forall q. GqlArgString q => q -> String
toGqlArgString = toGqlArgStringImpl

class GqlArgString q where
  toGqlArgStringImpl :: q -> String

instance gqlArgStringIgnoreArg :: GqlArgString IgnoreArg where
  toGqlArgStringImpl _ = ""
else instance gqlArgStringString :: GqlArgString String where
  toGqlArgStringImpl = show
else instance gqlArgStringInt :: GqlArgString Int where
  toGqlArgStringImpl = show
else instance gqlArgStringNumber :: GqlArgString Number where
  toGqlArgStringImpl = show
else instance gqlArgStringBoolean :: GqlArgString Boolean where
  toGqlArgStringImpl = show
else instance gqlArgStringDate :: GqlArgString Date where
  toGqlArgStringImpl = show <<< dateString
else instance gqlArgStringTime :: GqlArgString Time where
  toGqlArgStringImpl = show <<< timeString
else instance gqlArgStringDateTime :: GqlArgString DateTime where
  toGqlArgStringImpl (DateTime d t) = show $ dateString d <> "T" <> timeString t
else instance gqlArgStringMaybe :: GqlArgString a => GqlArgString (Maybe a) where
  toGqlArgStringImpl = maybe "null" toGqlArgStringImpl
else instance gqlArgStringArray :: GqlArgString a => GqlArgString (Array a) where
  toGqlArgStringImpl = map toGqlArgStringImpl >>> \as -> "[" <> intercalate ", " as <> "]"
else instance gqlArgStringVar :: IsSymbol sym => GqlArgString (Var sym a) where
  toGqlArgStringImpl _ = "$" <> reflectSymbol (Proxy :: Proxy sym)
else instance gqlArgStringOrArg ::
  (GqlArgString argL, GqlArgString argR) =>
  GqlArgString (OrArg argL argR) where
  toGqlArgStringImpl = case _ of
    ArgL a -> toGqlArgStringImpl a
    ArgR a -> toGqlArgStringImpl a
else instance gqlArgStringAndArgs ::
  ( GqlAndArgsString (AndArgs a1 a2)
    ) =>
  GqlArgString (AndArgs a1 a2) where
  toGqlArgStringImpl andArg = "[" <> toGqlAndArgsStringImpl andArg <> "]"
else instance gqlArgStringRecord_ :: HFoldlWithIndex PropToGqlArg String (Record r) String => GqlArgString (Record r) where
  toGqlArgStringImpl r = gqlArgStringRecord r

dateString :: Date -> String
dateString date =
  fold
    [ showInt $ DT.year date
    , "-"
    , padl 2 '0' $ showInt $ DT.month date
    , "-"
    , padl 2 '0' $ showInt $ DT.day date
    ]

timeString :: Time -> String
timeString time =
  fold
    [ padl 2 '0' $ showInt $ DT.hour time
    , ":"
    , padl 2 '0' $ showInt $ DT.minute time
    , ":"
    , padl 2 '0' $ showInt $ DT.second time
    , "."
    , removeTrailingZeros $ padMilli $ DT.millisecond time
    , "Z"
    ]

showInt :: forall a. BoundedEnum a => a -> String
showInt = show <<< fromEnum

padl :: Int -> Char -> String -> String
padl n chr str =
  String.fromCharArray
    $ padl' (n - String.length str) chr (String.toCharArray str)

padl' :: Int -> Char -> Array Char -> Array Char
padl' n chr chrs
  | n <= 0 = chrs
  | otherwise = padl' (n - 1) chr (chr `Array.cons` chrs)

-- | Remove trailing zeros from a millisecond value.
removeTrailingZeros :: String -> String
removeTrailingZeros "000" = "0"

removeTrailingZeros s =
  fromCodePointArray
    <<< Array.reverse
    <<< Array.dropWhile (_ == codePointFromChar '0')
    <<< Array.reverse
    $ toCodePointArray s

-- | Pad an integer from a millisecond value with enough zeros so it is three
-- digits.
padMilli :: Millisecond -> String
padMilli = padl 3 '0' <<< show <<< fromEnum

class GqlAndArgsString q where
  toGqlAndArgsStringImpl :: q -> String

instance gqlArgStringAndArgsNotEnd ::
  ( GqlArgString a1
  , GqlAndArgsString (AndArgs a2 a3)
  ) =>
  GqlAndArgsString (AndArgs (Array a1) (AndArgs a2 a3)) where
  toGqlAndArgsStringImpl (AndArgs head tail) = foldMap (toGqlArgStringImpl >>> \s -> s <> ", ") head <> toGqlAndArgsStringImpl tail
else instance gqlArgStringAndArgsEndArray ::
  ( GqlArgString a1
  , GqlArgString a2
  ) =>
  GqlAndArgsString (AndArgs (Array a1) (Array a2)) where
  toGqlAndArgsStringImpl (AndArgs a1 a2) = intercalate ", " (map toGqlArgStringImpl a1 <> map toGqlArgStringImpl a2)
else instance gqlArgStringAndArgsEnd ::
  ( GqlArgString a1
  , GqlArgString a2
  ) =>
  GqlAndArgsString (AndArgs (Array a1) a2) where
  toGqlAndArgsStringImpl (AndArgs a1 a2) = intercalate ", " (map toGqlArgStringImpl a1 <> [ toGqlArgStringImpl a2 ])

data PropToGqlArg
  = PropToGqlArg

instance propToGqlArg ::
  ( GqlArgString a
  , IsSymbol sym
  , IsIgnoreArg a
  ) =>
  FoldingWithIndex PropToGqlArg (Proxy sym) String a String where
  foldingWithIndex PropToGqlArg prop str a =
    if isIgnoreArg a then
      str
    else
      pre <> reflectSymbol prop <> ": " <> toGqlArgStringImpl a
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

class IsIgnoreArg a where
  isIgnoreArg :: a -> Boolean

instance isIgnoreArgIgnoreArg :: IsIgnoreArg IgnoreArg where
  isIgnoreArg _ = true
else instance isIgnoreArgOrArg :: (IsIgnoreArg l, IsIgnoreArg r) => IsIgnoreArg (OrArg l r) where
  isIgnoreArg = case _ of
    ArgL l -> isIgnoreArg l
    ArgR r -> isIgnoreArg r
else instance isIgnoreArgOther :: IsIgnoreArg a where
  isIgnoreArg _ = false
