module GraphQL.Client.Variables
  ( GetVarRec
  , WithVars(..)
  , class GetVar
  , class VarsTypeChecked
  , getQuery
  , getQueryVars
  , getVar
  , getVarsJson
  , getVarsTypeNames
  , withVars
  , withVarsEncode
  )
  where

import Prelude

import Control.Apply (lift2)
import Data.Argonaut.Core (Json, jsonEmptyObject)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Maybe (Maybe)
import Data.Symbol (class IsSymbol)
import GraphQL.Client.Alias (Alias)
import GraphQL.Client.Alias.Dynamic (Spread)
import GraphQL.Client.Args (AndArg, Args, OrArg)
import GraphQL.Client.Directive (ApplyDirective(..))
import GraphQL.Client.GqlType (AsGql)
import GraphQL.Client.Variable (Var)
import GraphQL.Client.Variables.TypeName (VarTypeNameProps, varTypeNameRecord)
import Heterogeneous.Folding (class Folding, class HFoldl, class HFoldlWithIndex, hfoldl)
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
  getVar _ = lift2 (Record.insert (Proxy :: Proxy name)) (Proxy :: Proxy a) (Proxy :: Proxy {})
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
  getVar _ =
    let
      varL :: Proxy { | varL }
      varL = getVar (Proxy :: _ l)

      varR :: Proxy { | varR }
      varR = getVar (Proxy :: _ r)
    in
      lift2 Record.merge varL varR
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
  getVar q = q >>= \query -> hfoldl GetVarRec (Proxy :: _ {}) (query :: { | query })
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

-- HFoldlWithIndex VarTypeNameProps String { | vars } String
--   => HFoldl GetVarRec (Proxy {}) query (Proxy { | vars })
--   => 

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

class VarsTypeChecked schema query where
  getVarsJson :: Proxy schema -> query -> Json
  getVarsTypeNames :: Proxy schema -> query -> String

instance varsTypeCheckedWithVars :: VarsTypeChecked schema (WithVars query vars) where
  getVarsJson _ (WithVars encode _ vars) = encode vars
  getVarsTypeNames _ (WithVars _ varsTypeNames _) = "TODO"
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

