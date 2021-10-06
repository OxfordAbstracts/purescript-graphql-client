module GraphQL.Client.Variables
  ( class GetVar
  , GetVarRec
  , WithVars
  , getJsonVars
  , getQuery
  , getQueryVars
  , getVar
  , withVars
  , withVars_
  , withVarsEncode
  , withVarsEncode_
  ) where

import Prelude

import Control.Apply (lift2)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Symbol (class IsSymbol)
import GraphQL.Client.Args (AndArg, Args, OrArg, (++), (=>>))
import GraphQL.Client.Variable (Var(..))
import Heterogeneous.Folding (class Folding, class HFoldl, hfoldl)
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
  = WithVars query Json

-- | Add variables to a query with a custom encoder
withVarsEncode ::
  forall query vars.
  HFoldl GetVarRec (Proxy {}) query (Proxy vars) =>
  (vars -> Json) ->
  query -> vars -> WithVars query vars
withVarsEncode encode query vars = WithVars query $ encode vars

-- | Add variables to a query
withVars ::
  forall query vars.
  HFoldl GetVarRec (Proxy {}) query (Proxy vars) =>
  EncodeJson vars =>
  query -> vars -> WithVars query vars
withVars = withVarsEncode encodeJson

-- | Add variables to a query with a custom encoder
withVarsEncode_ ::
  forall query vars.
  HFoldl GetVarRec (Proxy {}) query (Proxy vars) =>
  (vars -> Json) ->
  query -> vars -> WithVars (Proxy query) vars
withVarsEncode_ encode _ vars = WithVars (Proxy :: _ query) $ encode vars

-- | Add variables to a query
withVars_ ::
  forall query vars.
  HFoldl GetVarRec (Proxy {}) query (Proxy vars) =>
  EncodeJson vars =>
  query -> vars -> WithVars (Proxy query) vars
withVars_ = withVarsEncode_ encodeJson

getJsonVars :: forall query vars. WithVars query vars -> Json
getJsonVars (WithVars _ json) = json

getQuery :: forall query vars. WithVars query vars -> query
getQuery (WithVars query _) = query

testBasic ::
  Proxy
    { var1 :: Int
    }
testBasic = getQueryVars { x: Var :: _ "var1" Int }

testDuplicates ::
  Proxy
    { var1 :: Int
    }
testDuplicates =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y: Var :: _ "var1" Int
    }

testMixed ::
  Proxy
    { var1 :: Int
    , var2 :: String
    }
testMixed =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y: Var :: _ "var2" String
    }

testNested ::
  Proxy
    { var1 :: Int
    , var2 :: String
    }
testNested =
  getQueryVars
    { x: Var :: _ "var1" Int
    , y:
        { a: Var :: _ "var1" Int
        , b: Var :: _ "var2" String
        }
    }

testArgs ::
  Proxy
    { idVar :: Int
    }
testArgs = getQueryVars ((Var :: _ "idVar" Int) =>> { name: unit })

testAndArgs ::
  Proxy
    { aVar :: Int
    , bVar :: Number
    }
testAndArgs =
  getQueryVars
    ( { a:
          Var :: _ "aVar" Int
      }
        ++ { b: Var :: _ "bVar" Number }
        =>> { name: unit }
    )
