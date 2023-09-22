module GraphQL.Client.Variables
  ( GetVarRec
  , GqlQueryVars
  , GqlQueryVarsN(..)
  , PropGetVars
  , WithVars(..)
  , class GetGqlQueryVars
  , class GetVar
  , class VarsTypeChecked
  , getGqlQueryVars
  , getQuery
  , getQueryVars
  , getVar
  , getVarsJson
  , getVarsTypeNames
  , withVars
  , withVarsEncode
  ) where

import Prelude

import Control.Apply (lift2)
import Data.Argonaut.Core (Json, jsonEmptyObject)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Function (on)
import Data.List (List(..), foldMap, intercalate, nubBy)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (AndArg, Args(..), NotNull, OrArg)
import GraphQL.Client.AsGql (AsGql)
import GraphQL.Client.Directive (ApplyDirective(..))
import GraphQL.Client.ErrorBoundary (ErrorBoundary(..))
import GraphQL.Client.GqlType (class GqlType, printGqlType)
import GraphQL.Client.GqlTypeArgs (class GqlTypeArgs, printGqlTypeArgs)
import GraphQL.Client.Union (GqlUnion(..))
import GraphQL.Client.Variable (Var)
import Heterogeneous.Folding (class Folding, class FoldingWithIndex, class HFoldl, class HFoldlWithIndex, hfoldlWithIndex)
import Prim.Row as Row
import Record as Record
import Type.Proxy (Proxy(..))

class GetVar :: forall k. Type -> k -> Constraint
class GetVar query var | query -> var where
  getVar :: Proxy query -> Proxy var

instance getVarVar ::
  ( IsSymbol name
  , Row.Cons name a () var
  ) =>
  GetVar (Var name a) { | var } where
  getVar _ = Proxy -- lift2 (Record.insert (Proxy :: Proxy name)) (Proxy :: Proxy a) (Proxy :: Proxy {})
else instance getVarAlias ::
  ( GetVar query var
  ) =>
  GetVar (Alias name query) var where
  getVar _ = getVar (Proxy :: _ query)

else instance getVarMaybe ::
  ( GetVar a { | vars }
  ) =>
  GetVar (Maybe a) { | vars } where
  getVar _ = getVar (Proxy :: _ a)
else instance getVarAsGql ::
  ( GetVar a { | vars }
  ) =>
  GetVar (AsGql sym a) { | vars } where
  getVar _ = getVar (Proxy :: _ a)
else instance getVarArray ::
  ( GetVar a { | vars }
  ) =>
  GetVar (Array a) { | vars } where
  getVar _ = getVar (Proxy :: _ a)
else instance getVarApplyDirective ::
  ( GetVar query var
  ) =>
  GetVar (ApplyDirective name args query) var where
  getVar _ = getVar (Proxy :: _ query)
else instance getVarSpread ::
  ( GetVar l { | varL }
  , GetVar r { | varR }
  , Row.Union varR varL trash
  , Row.Union varL varR trash -- keep both union directions to make sure value type is the same
  , Row.Nub trash var
  ) =>
  GetVar (Spread name l r) { | var } where
  getVar _ =
    let
      varL :: Proxy { | varL }
      varL = getVar (Proxy :: _ l)

      varR :: Proxy { | varR }
      varR = getVar (Proxy :: _ r)
    in
      lift2 Record.merge varL varR
else instance getVarArg ::
  ( GetVar arg { | varArg }
  , GetVar t { | varT }
  , Row.Union varT varArg trash
  , Row.Union varArg varT trash -- keep both union directions to make sure value type is the same
  , Row.Nub trash var
  ) =>
  GetVar (Args arg t) { | var } where
  getVar _ =
    let
      varArg :: Proxy { | varArg }
      varArg = getVar (Proxy :: _ arg)

      varT :: Proxy { | varT }
      varT = getVar (Proxy :: _ t)
    in
      lift2 Record.merge varArg varT
else instance getVarAndArg ::
  ( GetVar l { | varL }
  , GetVar r { | varR }
  , Row.Union varR varL trash
  , Row.Union varL varR trash -- keep both union directions to make sure value type is the same
  , Row.Nub trash var
  ) =>
  GetVar (AndArg l r) { | var } where
  getVar _ = Proxy
else instance getVarOrArg ::
  ( GetVar l { | varL }
  , GetVar r { | varR }
  , Row.Union varR varL trash
  , Row.Union varL varR trash -- keep both union directions to make sure value type is the same
  , Row.Nub trash var
  ) =>
  GetVar (OrArg l r) { | var } where
  getVar _ =
    let
      varL :: Proxy { | varL }
      varL = getVar (Proxy :: _ l)

      varR :: Proxy { | varR }
      varR = getVar (Proxy :: _ r)
    in
      lift2 Record.merge varL varR
else instance getVarRecord ::
  ( HFoldl GetVarRec (Proxy {}) { | query } (Proxy { | var })
  ) =>
  GetVar { | query } { | var } where
  getVar _ = Proxy -- q >>= \query -> hfoldl GetVarRec (Proxy :: _ {}) (query :: { | query })
else instance getVarSkip :: GetVar a {} where
  getVar _ = Proxy

-- | Get variables from a record, recursively
data GetVarRec = GetVarRec

instance getVarRec ::
  ( GetVar val { | subRes }
  , Row.Union acc subRes trash
  , Row.Union subRes acc trash
  , Row.Nub trash res
  ) =>
  Folding GetVarRec (Proxy { | acc }) val (Proxy { | res }) where
  folding GetVarRec acc _ = lift2 Record.merge acc $ getVar (Proxy :: _ val)

getQueryVars :: forall query vars. GetVar query vars => query -> Proxy vars
getQueryVars _ = getVar (Proxy :: _ query)

-- data WithVars :: forall k. Type -> k -> Type
data WithVars query vars = WithVars (vars -> Json) query vars

-- | Add variables to a query with a custom encoder
withVarsEncode
  :: forall query vars
   . ({ | vars } -> Json)
  -> query
  -> { | vars }
  -> WithVars query { | vars }
withVarsEncode = WithVars

-- | Add variables to a query
withVars
  :: forall query vars
   . EncodeJson { | vars }
  => query
  -> { | vars }
  -> WithVars query { | vars }
withVars = withVarsEncode encodeJson

getQuery :: forall query vars. WithVars query vars -> query
getQuery (WithVars _ query _) = query

class VarsTypeChecked :: forall k. k -> Type -> Constraint
class VarsTypeChecked schema query where
  getVarsJson :: Proxy schema -> query -> Json
  getVarsTypeNames :: Proxy schema -> query -> String

instance varsTypeCheckedWithVars ::
  ( GetGqlQueryVars schema query
  ) =>
  VarsTypeChecked schema (WithVars query { | vars }) where
  getVarsJson _ (WithVars encode _ vars) = encode vars
  getVarsTypeNames _ q =
    getGqlQueryVars false (Proxy :: _ schema) q
      # nubBy (compare `on` _.varName)
      <#> (\{ varName, varType } -> varName <> ": " <> varType)
      # intercalate ", $"
      # \d ->
          if d == "" then "" else "($" <> d <> ")"

else instance varsTypeCheckedApplyDirective ::
  GetVar { | query } {} =>
  VarsTypeChecked schema (ApplyDirective name args { | query }) where
  getVarsJson _ (ApplyDirective _ _) = jsonEmptyObject
  getVarsTypeNames _ _ = ""

else instance varsTypeCheckedWithoutVars ::
  GetVar { | query } {} =>
  VarsTypeChecked schema { | query } where
  getVarsJson _ _ = jsonEmptyObject
  getVarsTypeNames _ _ = ""

else instance varsTypeCheckedSpread ::
  GetVar (Spread alias arg fields) {} =>
  VarsTypeChecked schema (Spread alias arg fields) where
  getVarsJson _ _ = jsonEmptyObject
  getVarsTypeNames _ _ = ""

-- | The vars in the query and their GraphQL type

type GqlQueryVars = List { varName :: String, varType :: String }

newtype GqlQueryVarsN = GqlQueryVarsN GqlQueryVars

-- | Get 
class GetGqlQueryVars :: forall k. k -> Type -> Constraint
class GetGqlQueryVars schema query where
  getGqlQueryVars :: Boolean -> Proxy schema -> query -> GqlQueryVars

instance queryVarsWithVars :: GetGqlQueryVars a q => GetGqlQueryVars a (WithVars q vars) where
  getGqlQueryVars isArgs a (WithVars _ q _) = getGqlQueryVars isArgs a q
else instance queryVarsVar ::
  ( IsSymbol name
  , GqlType a gqlName
  , GqlTypeArgs a gqlNameArgs
  , IsSymbol gqlName
  , IsSymbol gqlNameArgs
  ) =>
  GetGqlQueryVars a (Var name q) where
  getGqlQueryVars isArgs _ _ = pure
    { varName: reflectSymbol (Proxy :: Proxy name)
    , varType: if isArgs then printGqlTypeArgs (Proxy :: _ a) else printGqlType (Proxy :: _ a)
    }
else instance queryVarsGqlType :: GetGqlQueryVars a q => GetGqlQueryVars (AsGql gql a) q where
  getGqlQueryVars isArgs _ q = getGqlQueryVars isArgs (Proxy :: Proxy a) q
else instance queryVarsApplyDirective :: GetGqlQueryVars a q => GetGqlQueryVars a (ApplyDirective name args q) where
  getGqlQueryVars isArgs a (ApplyDirective _args q) = getGqlQueryVars isArgs a q
else instance queryReturnErrorBoundary :: GetGqlQueryVars a q => GetGqlQueryVars a (ErrorBoundary q) where
  getGqlQueryVars isArgs a (ErrorBoundary q) = getGqlQueryVars isArgs a q
else instance queryVarsSpread ::
  ( IsSymbol alias
  , Row.Cons alias subSchema rest schema
  , GetGqlQueryVars subSchema (Args (Array args) q)
  ) =>
  GetGqlQueryVars { | schema } (Spread (Proxy alias) args q) where
  getGqlQueryVars isArgs _ (Spread _alias args fields) =
    getGqlQueryVars isArgs (Proxy :: Proxy subSchema) (Args args fields)
else instance queryVarsSpreadNewtype ::
  ( GetGqlQueryVars { | schema } (Spread (Proxy alias) args q)
  , Newtype newtypeSchema { | schema }
  ) =>
  GetGqlQueryVars newtypeSchema (Spread (Proxy alias) args q) where
  getGqlQueryVars isArgs _ _ = getGqlQueryVars isArgs (Proxy :: Proxy { | schema }) (Proxy :: Proxy (Spread (Proxy alias) args q))
else instance queryVarsArrayParam :: GetGqlQueryVars a q => GetGqlQueryVars (Array a) q where
  getGqlQueryVars isArgs _ q = getGqlQueryVars isArgs (Proxy :: Proxy a) q
else instance queryVarsArrayArg :: GetGqlQueryVars a q => GetGqlQueryVars a (Array q) where
  getGqlQueryVars isArgs proxy = foldMap (getGqlQueryVars isArgs proxy)
else instance queryVarsMaybeParam :: GetGqlQueryVars a q => GetGqlQueryVars (Maybe a) q where
  getGqlQueryVars isArgs _ q = getGqlQueryVars isArgs (Proxy :: Proxy a) q
else instance queryVarsMaybeArg :: GetGqlQueryVars a q => GetGqlQueryVars a (Maybe q) where
  getGqlQueryVars isArgs proxy = foldMap (getGqlQueryVars isArgs proxy)
else instance queryVarsNotNull :: GetGqlQueryVars a q => GetGqlQueryVars (NotNull a) q where
  getGqlQueryVars isArgs _ q = getGqlQueryVars isArgs (Proxy :: Proxy a) q
else instance queryVarsUnion ::
  HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN =>
  GetGqlQueryVars (GqlUnion schema) (GqlUnion query) where
  getGqlQueryVars isArgs _ (GqlUnion q) = propGetVars isArgs (Proxy :: Proxy { | schema }) q
else instance queryVarsParamsArgs ::
  ( GetGqlQueryVars t q
  , GetGqlQueryVars { | params } { | args }
  ) =>
  GetGqlQueryVars ({ | params } -> t) (Args { | args } q) where
  getGqlQueryVars _dn _ (Args args q) =
    (getGqlQueryVars true (Proxy :: _ { | params }) args) -- in args values are nullable by default

      <> getGqlQueryVars false (Proxy :: Proxy t) q
else instance queryVarsParamsNoArgs ::
  ( GetGqlQueryVars t q
  ) =>
  GetGqlQueryVars ({ | params } -> t) q where
  getGqlQueryVars isArgs _ q = getGqlQueryVars isArgs (Proxy :: Proxy t) q
else instance queryVarsRecord ::
  HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN =>
  GetGqlQueryVars { | schema } { | query } where
  getGqlQueryVars isArgs = propGetVars isArgs
else instance queryVarsNewtype ::
  ( Newtype newtypeSchema { | schema }
  , HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN
  , GetGqlQueryVars { | schema } (Proxy { | query })
  ) =>
  GetGqlQueryVars newtypeSchema { | query } where
  getGqlQueryVars isArgs _sch query = getGqlQueryVars isArgs (Proxy :: Proxy { | schema }) query

else instance queryVarsAll :: GetGqlQueryVars a q where
  getGqlQueryVars _ _a _ = Nil

-- -- | For internal use only but must be exported for other modules to compile
data PropGetVars :: forall k. k -> Type
data PropGetVars schema = PropGetVars Boolean

instance propGetVarsAlias ::
  ( IsSymbol sym
  , IsSymbol al
  , Row.Cons al subSchema rest schema
  , GetGqlQueryVars subSchema val
  ) =>
  FoldingWithIndex (PropGetVars { | schema }) (Proxy sym) GqlQueryVarsN ((Alias (Proxy al) val)) GqlQueryVarsN where
  foldingWithIndex (PropGetVars isArgs) _sym (GqlQueryVarsN qv) (Alias _ val) =
    GqlQueryVarsN $ qv <> getGqlQueryVars isArgs (Proxy :: Proxy subSchema) val
else instance propGetVarsProxy ::
  FoldingWithIndex (PropGetVars { | schema }) (Proxy sym) GqlQueryVarsN (Proxy val) GqlQueryVarsN where
  foldingWithIndex (PropGetVars _) _ (GqlQueryVarsN qv) _ =
    GqlQueryVarsN qv
else instance propGetVars_ ::
  ( IsSymbol sym
  , Row.Cons sym subSchema rest schema
  , GetGqlQueryVars subSchema val
  ) =>
  FoldingWithIndex (PropGetVars { | schema }) (Proxy sym) GqlQueryVarsN val GqlQueryVarsN where
  foldingWithIndex (PropGetVars isArgs) _sym (GqlQueryVarsN qv) val =
    GqlQueryVarsN $ qv <> getGqlQueryVars isArgs (Proxy :: Proxy subSchema) val

propGetVars
  :: forall query schema
   . HFoldlWithIndex (PropGetVars schema) GqlQueryVarsN (query) GqlQueryVarsN
  => Boolean
  -> Proxy schema
  -> query
  -> GqlQueryVars
propGetVars isArgs _schema _q = unwrapGqlQueryVars $
  hfoldlWithIndex (PropGetVars isArgs :: PropGetVars schema) (GqlQueryVarsN mempty) _q
  where
  unwrapGqlQueryVars :: GqlQueryVarsN -> GqlQueryVars
  unwrapGqlQueryVars (GqlQueryVarsN qv) = qv
