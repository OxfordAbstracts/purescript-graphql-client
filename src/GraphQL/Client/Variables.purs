module GraphQL.Client.Variables where

import Prelude

import Control.Apply (lift2)
import Data.Argonaut.Core (Json, jsonEmptyObject)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.List (List(..), intercalate)
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.Alias (Alias)
import GraphQL.Client.Alias.Dynamic (Spread)
import GraphQL.Client.Args (AndArg, Args, NotNull, OrArg)
import GraphQL.Client.AsGql (AsGql)
import GraphQL.Client.Directive (ApplyDirective(..))
import GraphQL.Client.ErrorBoundary (ErrorBoundary)
import GraphQL.Client.GqlType (class GqlType)
import GraphQL.Client.Union (GqlUnion)
import GraphQL.Client.Variable (Var)
import Heterogeneous.Folding (class Folding, class FoldingWithIndex, class HFoldl, class HFoldlWithIndex, hfoldlWithIndex)
import Prim.Row as Row
import Record as Record
import Type.Proxy (Proxy(..))

class GetVar :: Type -> Type -> Constraint
class GetVar query var | query -> var where
  getVar :: Proxy query -> Proxy var

instance getVarVar ::
  ( Row.Cons name a () var
  ) =>
  GetVar (Var name a) { | var } where
  getVar _ = Proxy
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

class VarsTypeChecked :: Type -> Type -> Constraint
class VarsTypeChecked schema query where
  getVarsJson :: Proxy schema -> query -> Json
  getVarsTypeNames :: Proxy schema -> query -> String

instance varsTypeCheckedWithVars ::
  ( GetGqlQueryVars schema query { | gqlVars }
  , HFoldlWithIndex (CombineVarsProp { | gqlVars }) GqlQueryVarsN { | vars } GqlQueryVarsN
  ) =>
  VarsTypeChecked schema (WithVars query { | vars }) where
  getVarsJson _ (WithVars encode _ vars) = encode vars
  getVarsTypeNames _ (WithVars _ _ vars) =
    combineVars vars (Proxy :: _ { | gqlVars })
      # unwrap
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

class GetGqlQueryVars :: Type -> Type -> Type -> Constraint
class GetGqlQueryVars schema query vars | schema query -> vars

instance queryVarsAsGqlVar ::
  ( Row.Cons name (Proxy gqlName) () result
  , IsSymbol gqlName
  ) =>
  GetGqlQueryVars (AsGql gqlName a) (Var name q) { | result }

else instance queryVarsGqlType :: GetGqlQueryVars a q vars => GetGqlQueryVars (AsGql gql a) q vars

else instance queryVarsVar ::
  ( GqlType a gqlName
  , Row.Cons name (Proxy gqlName) () result
  ) =>
  GetGqlQueryVars a (Var name q) { | result }

else instance queryVarsApplyDirective :: GetGqlQueryVars a q vars => GetGqlQueryVars a (ApplyDirective name args q) vars

else instance queryReturnErrorBoundary :: GetGqlQueryVars a q vars => GetGqlQueryVars a (ErrorBoundary q) vars

else instance queryVarsArrayParam :: GetGqlQueryVars a q vars => GetGqlQueryVars (Array a) q vars

else instance queryVarsArrayArg :: GetGqlQueryVars a q vars => GetGqlQueryVars a (Array q) vars

else instance queryVarsMaybeParam :: GetGqlQueryVars a q vars => GetGqlQueryVars (Maybe a) q vars

else instance queryVarsMaybeArg :: GetGqlQueryVars a q vars => GetGqlQueryVars a (Maybe q) vars

else instance queryVarsNotNull :: GetGqlQueryVars a q vars => GetGqlQueryVars (NotNull a) q vars

else instance queryVarsSpread ::
  ( Row.Cons alias subSchema rest schema
  , GetGqlQueryVars subSchema (Args (Array args) q) vars
  ) =>
  GetGqlQueryVars { | schema } (Spread (Proxy alias) args q) vars

else instance queryVarsSpreadNewtype ::
  ( GetGqlQueryVars { | schema } (Spread (Proxy alias) args q) vars
  , Newtype newtypeSchema { | schema }
  ) =>
  GetGqlQueryVars newtypeSchema (Spread (Proxy alias) args q) vars

else instance queryVarsUnion ::
  ( GetGqlQueryVarsRecord { | schema } { | query } vars
  ) =>
  GetGqlQueryVars (GqlUnion schema) (GqlUnion query) vars
else instance queryVarsParamsArgs ::
  ( GetGqlQueryVars t q { | vars }
  , GetGqlQueryVars { | params } { | args } { | argVars }
  , Row.Union vars argVars rl
  , Row.Nub rl result
  ) =>
  GetGqlQueryVars ({ | params } -> t) (Args { | args } q) { | result }

else instance queryVarsParamsNoArgs ::
  ( GetGqlQueryVars t q vars
  ) =>
  GetGqlQueryVars ({ | params } -> t) q vars
else instance
  GetGqlQueryVarsRecord { | schema } { | query } vars =>
  GetGqlQueryVars { | schema } { | query } vars
else instance queryVarsNewtype ::
  ( GetGqlQueryVars { | schema } ({ | query }) vars
  ) =>
  GetGqlQueryVars newtypeSchema { | query } vars

else instance queryVarsAll :: GetGqlQueryVars a q {}

class GetGqlQueryVarsRecord :: Type -> Type -> Type -> Constraint
class GetGqlQueryVarsRecord schema query vars | schema query -> vars

instance getGqlQueryVarsRecord ::
  ( HFoldlWithIndex (PropGetGqlVars { | schema }) (Proxy {}) ({ | query }) (Proxy vars)
  ) =>
  GetGqlQueryVarsRecord { | schema } { | query } vars

-- | For internal use only but must be exported for other modules to compile
data PropGetGqlVars :: Type -> Type
data PropGetGqlVars schema = PropGetGqlVars

instance propGetGqlVarsAlias ::
  ( Row.Cons al subSchema rest schema
  , GetGqlQueryVars subSchema val { | vars }
  , Row.Union vars prev row
  , Row.Nub row result
  ) =>
  FoldingWithIndex (PropGetGqlVars { | schema }) (Proxy sym) (Proxy { | prev }) ((Alias (Proxy al) val)) (Proxy { | result }) where
  foldingWithIndex _ _ _ _ = Proxy
else instance propGetGqlVars_ ::
  ( Row.Cons sym subSchema rest schema
  , GetGqlQueryVars subSchema val { | vars }
  , Row.Union prev vars row
  , Row.Nub row result
  ) =>
  FoldingWithIndex (PropGetGqlVars { | schema }) (Proxy sym) (Proxy { | prev }) val (Proxy { | result }) where
  foldingWithIndex _ _ _ _ = Proxy

propGetGqlVars
  :: forall query schema result
   . HFoldlWithIndex (PropGetGqlVars schema) (Proxy {}) { | query } (Proxy result)
  => Proxy schema
  -> Proxy { | query }
  -> Proxy result
propGetGqlVars _ queryProxy =
  hfoldlWithIndex (PropGetGqlVars :: PropGetGqlVars schema) (Proxy :: _ {}) =<< queryProxy

combineVars
  :: forall vars gqlVars
   . HFoldlWithIndex (CombineVarsProp { | gqlVars }) GqlQueryVarsN vars GqlQueryVarsN
  => vars
  -> Proxy { | gqlVars }
  -> GqlQueryVarsN
combineVars vars _ =
  hfoldlWithIndex (CombineVarsProp :: _ { | gqlVars }) (GqlQueryVarsN Nil) vars

type GqlQueryVars = List { varName :: String, varType :: String }

newtype GqlQueryVarsN = GqlQueryVarsN GqlQueryVars

derive instance newtypeGqlQueryVarsN :: Newtype GqlQueryVarsN _

data CombineVarsProp :: Type -> Type
data CombineVarsProp gqlVars = CombineVarsProp

instance
  ( IsSymbol sym
  , IsSymbol gql
  , Row.Cons sym (Proxy gql) rest gqlVars
  , GqlArrayAndMaybeType val
  ) =>
  FoldingWithIndex (CombineVarsProp { | gqlVars }) (Proxy sym) GqlQueryVarsN val GqlQueryVarsN where
  foldingWithIndex _ _ (GqlQueryVarsN vars) _ = GqlQueryVarsN $
    { varName: reflectSymbol (Proxy :: _ sym)
    , varType: gqlArrayAndMaybeType (Proxy :: _ val) $ reflectSymbol (Proxy :: _ gql)
    } `Cons` vars

class GqlArrayAndMaybeType :: Type -> Constraint
class GqlArrayAndMaybeType a where
  gqlArrayAndMaybeType :: Proxy a -> String -> String

instance GqlArrayAndMaybeType a => GqlArrayAndMaybeType (Maybe (Array a)) where
  gqlArrayAndMaybeType _ str = "[" <> gqlArrayAndMaybeType (Proxy :: _ a) str <> "]"

else instance GqlArrayAndMaybeType a => GqlArrayAndMaybeType (Array a) where
  gqlArrayAndMaybeType _ str = "[" <> gqlArrayAndMaybeType (Proxy :: _ a) str <> "]!"

else instance GqlArrayAndMaybeType a => GqlArrayAndMaybeType (Maybe a) where
  gqlArrayAndMaybeType _ str = str

else instance GqlArrayAndMaybeType a where
  gqlArrayAndMaybeType _ str = str <> "!"

