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
import Data.List (List(..), intercalate)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Debug (spy)
import GraphQL.Client.Alias (Alias(..))
import GraphQL.Client.Alias.Dynamic (Spread(..))
import GraphQL.Client.Args (AndArg, Args(..), OrArg)
import GraphQL.Client.Directive (ApplyDirective(..))
import GraphQL.Client.ErrorBoundary (ErrorBoundary(..))
import GraphQL.Client.GqlType (class BoolRuntime, class GqlType, AsGql, printGqlType)
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
    getGqlQueryVars (Proxy :: _ schema) q
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
  getGqlQueryVars :: Proxy schema -> query -> GqlQueryVars

instance queryVarsWithVars :: GetGqlQueryVars a q => GetGqlQueryVars a (WithVars q vars) where
  getGqlQueryVars a (WithVars _ q _) = getGqlQueryVars a q
else instance queryVarsVar ::
  ( GetGqlQueryVars a q
  , IsSymbol name
  , GqlType a gqlName nullable
  , IsSymbol gqlName
  , BoolRuntime nullable
  ) =>
  GetGqlQueryVars a (Var name q) where
  getGqlQueryVars _ _ = pure
    { varName: reflectSymbol (Proxy :: Proxy name)
    , varType: printGqlType (Proxy :: _ a)
    }
else instance queryVarsGqlType :: GetGqlQueryVars a q => GetGqlQueryVars (AsGql gql a) q where
  getGqlQueryVars _ q = getGqlQueryVars (Proxy :: Proxy a) q
else instance queryVarsApplyDirective :: GetGqlQueryVars a q => GetGqlQueryVars a (ApplyDirective name args q) where
  getGqlQueryVars a (ApplyDirective _args q) = getGqlQueryVars a q
else instance queryReturnErrorBoundary :: GetGqlQueryVars a q => GetGqlQueryVars a (ErrorBoundary q) where
  getGqlQueryVars a (ErrorBoundary q) = getGqlQueryVars a q
else instance queryVarsSpread ::
  ( IsSymbol alias
  , Row.Cons alias subSchema rest schema
  , GetGqlQueryVars subSchema (Args (Array args) q)
  ) =>
  GetGqlQueryVars { | schema } (Spread (Proxy alias) args q) where
  getGqlQueryVars _ (Spread alias args fields) =
    getGqlQueryVars (Proxy :: Proxy subSchema) (Args args fields)
else instance queryVarsSpreadNewtype ::
  ( GetGqlQueryVars { | schema } (Spread (Proxy alias) args q)
  , Newtype newtypeSchema { | schema }
  ) =>
  GetGqlQueryVars newtypeSchema (Spread (Proxy alias) args q) where
  getGqlQueryVars _ _ = getGqlQueryVars (Proxy :: Proxy { | schema }) (Proxy :: Proxy (Spread (Proxy alias) args q))
else instance queryVarsArray :: GetGqlQueryVars a q => GetGqlQueryVars (Array a) q where
  getGqlQueryVars _ q = getGqlQueryVars (Proxy :: Proxy a) q
else instance queryVarsMaybe :: GetGqlQueryVars a q => GetGqlQueryVars (Maybe a) q where
  getGqlQueryVars _ q = getGqlQueryVars (Proxy :: Proxy a) q
else instance queryVarsUnion ::
  HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN =>
  GetGqlQueryVars (GqlUnion schema) (GqlUnion query) where
  getGqlQueryVars _ (GqlUnion q) = propGetVars (Proxy :: Proxy { | schema }) q
else instance queryVarsParamsArgs ::
  ( GetGqlQueryVars t q
  , GetGqlQueryVars { | params } { | args }
  ) =>
  GetGqlQueryVars ({ | params } -> t) (Args { | args } q) where
  getGqlQueryVars _ (Args args q) =
    getGqlQueryVars (Proxy :: _ { | params }) args
      <> getGqlQueryVars (Proxy :: Proxy t) q
else instance queryVarsParamsNoArgs ::
  ( GetGqlQueryVars t q
  ) =>
  GetGqlQueryVars ({ | params } -> t) q where
  getGqlQueryVars _ q = getGqlQueryVars (Proxy :: Proxy t) q
else instance queryVarsRecord ::
  HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN =>
  GetGqlQueryVars { | schema } { | query } where
  getGqlQueryVars = propGetVars
else instance queryVarsNewtype ::
  ( Newtype newtypeSchema { | schema }
  , HFoldlWithIndex (PropGetVars { | schema }) GqlQueryVarsN ({ | query }) GqlQueryVarsN
  , GetGqlQueryVars { | schema } (Proxy { | query })
  ) =>
  GetGqlQueryVars newtypeSchema { | query } where
  getGqlQueryVars _sch query = getGqlQueryVars (Proxy :: Proxy { | schema }) query

else instance queryVarsAll :: GetGqlQueryVars a q where
  getGqlQueryVars _a _ = Nil

-- -- | For internal use only but must be exported for other modules to compile
data PropGetVars :: forall k. k -> Type
data PropGetVars schema = PropGetVars

instance propGetVarsAlias ::
  ( IsSymbol sym
  , IsSymbol al
  , Row.Cons al subSchema rest schema
  , GetGqlQueryVars subSchema val
  ) =>
  FoldingWithIndex (PropGetVars { | schema }) (Proxy sym) GqlQueryVarsN ((Alias (Proxy al) val)) GqlQueryVarsN where
  foldingWithIndex (PropGetVars) _sym (GqlQueryVarsN qv) (Alias _ val) =
    GqlQueryVarsN $ qv <> getGqlQueryVars (Proxy :: Proxy subSchema) val
else instance propGetVarsProxy ::
  ( IsSymbol sym
  ) =>
  FoldingWithIndex (PropGetVars { | schema }) (Proxy sym) GqlQueryVarsN (Proxy val) GqlQueryVarsN where
  foldingWithIndex (PropGetVars) _ (GqlQueryVarsN qv) _ =
    GqlQueryVarsN qv
else instance propGetVars_ ::
  ( IsSymbol sym
  , Row.Cons sym subSchema rest schema
  , GetGqlQueryVars subSchema val
  ) =>
  FoldingWithIndex (PropGetVars { | schema }) (Proxy sym) GqlQueryVarsN val GqlQueryVarsN where
  foldingWithIndex (PropGetVars) _sym (GqlQueryVarsN qv) val =
    GqlQueryVarsN $ qv <> getGqlQueryVars (Proxy :: Proxy subSchema) val

propGetVars
  :: forall query schema
   . HFoldlWithIndex (PropGetVars schema) GqlQueryVarsN (query) GqlQueryVarsN
  => Proxy schema
  -> query
  -> GqlQueryVars
propGetVars _schema _q = unwrapGqlQueryVars $
  hfoldlWithIndex (PropGetVars :: PropGetVars schema) (GqlQueryVarsN mempty) _q
  where
  unwrapGqlQueryVars :: GqlQueryVarsN -> GqlQueryVars
  unwrapGqlQueryVars (GqlQueryVarsN qv) = qv
