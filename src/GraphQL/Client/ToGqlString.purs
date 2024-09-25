module GraphQL.Client.ToGqlString
  ( KeyVals(..)
  , KeyVals_
  , PropToGqlArg(..)
  , PropToGqlString(..)
  , ToGqlQueryStringOptions
  , class GqlAndArgsString
  , class GqlArgString
  , class GqlQueryString
  , class IsIgnoreArg
  , dateString
  , emptyKeyVals
  , gqlArgStringRecord
  , gqlArgStringRecordBody
  , gqlArgStringRecordTopLevel
  , gqlQueryStringRecord
  , indent
  , isIgnoreArg
  , padMilli
  , padl
  , padl'
  , removeTrailingZeros
  , showInt
  , timeString
  , toGqlAndArgsStringImpl
  , toGqlArgString
  , toGqlArgStringImpl
  , toGqlQueryString
  , toGqlQueryStringFormatted
  , toGqlQueryStringImpl
  , toLines
  ) where

import Prelude

import Data.Array (fold, foldMap, intercalate, length, mapWithIndex)
import Data.Array as Array
import Data.Date (Date)
import Data.DateTime (DateTime(..), Millisecond)
import Data.DateTime as DT
import Data.Enum (class BoundedEnum, fromEnum)
import Data.FoldableWithIndex (foldlWithIndex)
import Data.Function (on)
import Data.Identity (Identity(..))
import Data.List (List)
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Monoid (guard, power)
import Data.Newtype (unwrap)
import Data.String (codePointFromChar, fromCodePointArray, joinWith, toCodePointArray)
import Data.String.CodeUnits as String
import Data.String.Regex (split)
import Data.String.Regex.Flags (global)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Time (Time)
import Data.Variant (Unvariant(..), Variant, unvariant)
import Foreign (Foreign)
import Foreign.Object (Object)
import Foreign.Object as Object
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (AndArgs(AndArgs), Args(..), IgnoreArg, OrArg(..))
import GraphQL.Client.Args.AllowedMismatch (AllowedMismatch)
import GraphQL.Client.ArrayOf (ArrayOf(..))
import GraphQL.Client.Directive (ApplyDirective(..))
import GraphQL.Client.ErrorBoundary (ErrorBoundary(..))
import GraphQL.Client.NullArray (NullArray)
import GraphQL.Client.Union (GqlUnion(..))
import GraphQL.Client.Variable (Var)
import GraphQL.Client.Variables (WithVars, getQuery)
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex, hfoldlWithIndex)
import Type.Proxy (Proxy(..))
import Unsafe.Coerce (unsafeCoerce)

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

type ToGqlQueryStringOptions =
  { indentation :: Maybe Int
  }

class GqlQueryString q where
  toGqlQueryStringImpl :: ToGqlQueryStringOptions -> q -> String

instance gqlQueryStringUnit :: GqlQueryString Unit where
  toGqlQueryStringImpl _ _ = ""
else instance gqlQueryStringWithVars :: GqlQueryString query => GqlQueryString (WithVars query vars) where
  toGqlQueryStringImpl opts withVars = toGqlQueryStringImpl opts $ getQuery withVars
else instance gqlQueryStringApplyDirective ::
  ( IsSymbol name
  , HFoldlWithIndex PropToGqlArg KeyVals (Record args) KeyVals
  , GqlQueryString query
  ) =>
  GqlQueryString (ApplyDirective name (Record args) query) where
  toGqlQueryStringImpl opts (ApplyDirective args q) =
    "@"
      <> reflectSymbol (Proxy :: Proxy name)
      <> gqlArgStringRecordTopLevel args
      <> toGqlQueryStringImpl opts q
else instance gqlQueryStringIdentity :: GqlQueryString a => GqlQueryString (Identity a) where
  toGqlQueryStringImpl opts (Identity a) = toGqlQueryStringImpl opts a
else instance gqlQueryStringErrorBoundary :: GqlQueryString a => GqlQueryString (ErrorBoundary a) where
  toGqlQueryStringImpl opts (ErrorBoundary a) = toGqlQueryStringImpl opts a
else instance gqlQueryStringArrayOf :: GqlQueryString a => GqlQueryString (ArrayOf a) where
  toGqlQueryStringImpl opts (ArrayOf a) = toGqlQueryStringImpl opts a
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
  ( HFoldlWithIndex PropToGqlArg KeyVals (Record args) KeyVals
  ) =>
  GqlQueryString (Args { | args } Unit) where
  toGqlQueryStringImpl _ (Args args _) = gqlArgStringRecordTopLevel args
else instance gqlQueryStringArgs ::
  ( HFoldlWithIndex PropToGqlArg KeyVals (Record args) KeyVals
  , GqlQueryString body
  ) =>
  GqlQueryString (Args { | args } body) where
  toGqlQueryStringImpl opts (Args args body) =
    gqlArgStringRecordTopLevel args
      <> toGqlQueryStringImpl opts body
else instance gqlQueryStringEmptyRecord ::
  HFoldlWithIndex PropToGqlString KeyVals (Record r) KeyVals =>
  GqlQueryString (Record r) where
  toGqlQueryStringImpl r = gqlQueryStringRecord r
else instance gqlQueryStringGqlUnion ::
  HFoldlWithIndex PropToGqlString KeyVals (Record r) KeyVals =>
  GqlQueryString (GqlUnion r) where
  toGqlQueryStringImpl opts (GqlUnion r) = gqlQueryStringUnion opts r

data PropToGqlString = PropToGqlString ToGqlQueryStringOptions

newtype KeyVals = KeyVals KeyVals_

type KeyVals_ = List { key :: String, val :: String }

emptyKeyVals :: KeyVals
emptyKeyVals = KeyVals List.Nil

instance propToGqlStringAlias ::
  ( GqlQueryString a
  , IsSymbol sym
  , IsSymbol alias
  ) =>
  FoldingWithIndex PropToGqlString (Proxy sym) KeyVals (Alias (Proxy alias) a) KeyVals where
  foldingWithIndex (PropToGqlString opts) prop (KeyVals kvs) (Alias alias a) =
    KeyVals
      $
        { key: reflectSymbol prop
        , val:
            ": "
              <> reflectSymbol alias
              <> toGqlQueryStringImpl opts a
        }
          `List.Cons`
            kvs
else instance propToGqlString ::
  ( GqlQueryString a
  , IsSymbol sym
  ) =>
  FoldingWithIndex PropToGqlString (Proxy sym) KeyVals a KeyVals where
  foldingWithIndex (PropToGqlString opts) prop (KeyVals kvs) a =
    KeyVals
      $
        { key: reflectSymbol prop
        , val: toGqlQueryStringImpl opts a
        }
          `List.Cons`
            kvs

gqlQueryStringRecord
  :: forall r
   . ToGqlQueryStringOptions
  -> HFoldlWithIndex PropToGqlString KeyVals { | r } KeyVals
  => { | r }
  -> String
gqlQueryStringRecord opts r = indent opts $ " {" <> body <> newline <> "}"
  where
  (KeyVals kvs) = hfoldlWithIndex (PropToGqlString opts) emptyKeyVals r

  body =
    sortByKeyIndex r kvs
      # List.foldMap (\{ key, val } -> nl <> key <> val)

  multiline = isJust opts.indentation

  nl = if isJust opts.indentation then "\n" else " "

  newline = guard multiline "\n"

data UnionToGqlString = UnionToGqlString ToGqlQueryStringOptions

instance unionToGqlString ::
  ( GqlQueryString a
  , IsSymbol sym
  ) =>
  FoldingWithIndex UnionToGqlString (Proxy sym) KeyVals a KeyVals where
  foldingWithIndex (UnionToGqlString opts) union (KeyVals kvs) a =
    KeyVals
      $
        { key: reflectSymbol union
        , val: toGqlQueryStringImpl opts a
        }
          `List.Cons`
            kvs

gqlQueryStringUnion
  :: forall r
   . ToGqlQueryStringOptions
  -> HFoldlWithIndex PropToGqlString KeyVals { | r } KeyVals
  => { | r }
  -> String
gqlQueryStringUnion opts r = indent opts $
  " {" <> newline
    <> " __typename"
    <> newline
    <> body
    <> newline
    <> "}"
  where
  (KeyVals kvs) = hfoldlWithIndex (PropToGqlString opts) emptyKeyVals r

  body =
    sortByKeyIndex r kvs
      # List.foldMap (\{ key, val } -> nl <> "... on " <> key <> val)

  multiline = isJust opts.indentation

  nl = if multiline then "\n" else " "

  newline = guard multiline "\n"

indent
  :: forall r
   . { indentation :: Maybe Int
     | r
     }
  -> String
  -> String
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
else instance gqlArgStringNullArray :: GqlArgString NullArray where
  toGqlArgStringImpl _ = "[]"
else instance gqlArgStringArray :: GqlArgString a => GqlArgString (Array a) where
  toGqlArgStringImpl = map toGqlArgStringImpl >>> \as -> "[" <> intercalate ", " as <> "]"
else instance gqlArgStringErrorBoundary :: GqlArgString a => GqlArgString (ErrorBoundary a) where
  toGqlArgStringImpl (ErrorBoundary a) = toGqlArgStringImpl a
else instance gqlArgStringAllowedMismatch :: GqlArgString a => GqlArgString (AllowedMismatch t a) where
  toGqlArgStringImpl = unwrap >>> toGqlArgStringImpl
else instance gqlargVariant :: GqlArgString (Variant r) where
  toGqlArgStringImpl v = unvariant v # \(Unvariant f) -> f \p _ -> reflectSymbol p
else instance gqlArgStringVar :: IsSymbol sym => GqlArgString (Var sym a) where
  toGqlArgStringImpl _ = "$" <> reflectSymbol (Proxy :: Proxy sym)
else instance gqlArgStringOrArg ::
  ( GqlArgString argL
  , GqlArgString argR
  ) =>
  GqlArgString (OrArg argL argR) where
  toGqlArgStringImpl = case _ of
    ArgL a -> toGqlArgStringImpl a
    ArgR a -> toGqlArgStringImpl a
else instance gqlArgStringAndArgs ::
  ( GqlAndArgsString (AndArgs a1 a2)
  ) =>
  GqlArgString (AndArgs a1 a2) where
  toGqlArgStringImpl andArg = "[" <> toGqlAndArgsStringImpl andArg <> "]"
else instance gqlArgStringRecord_ :: HFoldlWithIndex PropToGqlArg KeyVals (Record r) KeyVals => GqlArgString (Record r) where
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

data PropToGqlArg = PropToGqlArg

instance propToGqlArg ::
  ( GqlArgString a
  , IsSymbol sym
  , IsIgnoreArg a
  ) =>
  FoldingWithIndex PropToGqlArg (Proxy sym) KeyVals a KeyVals where
  foldingWithIndex PropToGqlArg prop (KeyVals kvs) a =
    KeyVals
      if isIgnoreArg a then
        kvs
      else
        { key: reflectSymbol prop
        , val: toGqlArgStringImpl a
        }
          `List.Cons`
            kvs

gqlArgStringRecord
  :: forall r
   . HFoldlWithIndex PropToGqlArg KeyVals { | r } KeyVals
  => { | r }
  -> String
gqlArgStringRecord r = "{" <> gqlArgStringRecordBody r <> "}"

gqlArgStringRecordTopLevel
  :: forall r
   . HFoldlWithIndex PropToGqlArg KeyVals { | r } KeyVals
  => { | r }
  -> String
gqlArgStringRecordTopLevel r =
  let
    inside = gqlArgStringRecordBody r
  in
    if inside == "" then
      ""
    else
      "(" <> inside <> ")"

gqlArgStringRecordBody
  :: forall r
   . HFoldlWithIndex PropToGqlArg KeyVals { | r } KeyVals
  => { | r }
  -> String
gqlArgStringRecordBody r =
  sortByKeyIndex r kvs
    <#> (\{ key, val } -> key <> ": " <> val)
    # List.intercalate ", "
  where
  (KeyVals kvs) = hfoldlWithIndex PropToGqlArg emptyKeyVals r

sortByKeyIndex :: forall r. { | r } -> KeyVals_ -> KeyVals_
sortByKeyIndex record = List.sortBy (compare `on` getKeyIndex)
  where
  obj :: Object Foreign
  obj = unsafeCoerce record

  objKeys :: Array String
  objKeys = Object.keys obj

  objIdxs :: Map String Int
  objIdxs = foldlWithIndex getIdx Map.empty objKeys

  getIdx :: Int -> Map String Int -> String -> Map String Int
  getIdx idx idxs key = Map.insert key idx idxs

  getKeyIndex :: _ -> Maybe Int
  getKeyIndex { key } = Map.lookup key objIdxs

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
