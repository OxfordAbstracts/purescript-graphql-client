module GraphQL.Client.Variables
  ( class GetVar
  , class VarsTypeChecked
  , GetVarRec
  , WithVars
  , getVarsJson
  , getVarsTypeNames 
  , getQuery
  , getQueryVars
  , getVar
  , withVars
  , withVarsEncode
  ) where

import Prelude

import Control.Apply (lift2)
import Data.Argonaut.Core (Json, jsonEmptyObject)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Symbol (class IsSymbol)
import GraphQL.Client.Args (AndArg, Args, OrArg)
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
data GetVarRec
  = GetVarRec

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

data WithVars :: forall k. Type -> k -> Type
data WithVars query vars
  = WithVars query String Json

-- | Add variables to a query with a custom encoder
withVarsEncode ::
  forall query vars.
  HFoldlWithIndex VarTypeNameProps String {|vars} String =>
  HFoldl GetVarRec (Proxy {}) query (Proxy {|vars}) =>
  ({|vars} -> Json) ->
  query -> {|vars} -> WithVars query {|vars}
withVarsEncode encode query vars = WithVars query (varTypeNameRecord vars) $ encode vars

-- | Add variables to a query
withVars ::
  forall query vars.
  HFoldlWithIndex VarTypeNameProps String {|vars} String =>
  HFoldl GetVarRec (Proxy {}) query (Proxy {|vars}) =>
  EncodeJson {|vars} =>
  query -> {|vars} -> WithVars query {|vars}
withVars = withVarsEncode encodeJson

getQuery :: forall query vars. WithVars query vars -> query
getQuery (WithVars query _ _) = query

class VarsTypeChecked query where
  getVarsJson :: query -> Json
  getVarsTypeNames :: query -> String 

instance varsTypeCheckedWithVars :: VarsTypeChecked (WithVars query vars) where
  getVarsJson (WithVars _ _ json) = json
  getVarsTypeNames (WithVars _ varsTypeNames _) = varsTypeNames
else instance varsTypeCheckedWithoutVars ::
  GetVar { | query } {} =>
  VarsTypeChecked { | query } where
  getVarsJson _ = jsonEmptyObject
  getVarsTypeNames _ = ""

