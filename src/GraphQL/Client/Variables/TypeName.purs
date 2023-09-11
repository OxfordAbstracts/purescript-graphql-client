module GraphQL.Client.Variables.TypeName where

import Prelude

import Data.List (List)
import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.GqlType (class BoolRuntime, class GqlType, printGqlType)
import GraphQL.Client.Variable (Var)
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex, hfoldlWithIndex)
import Type.Proxy (Proxy(..))

varTypeNameRecord
  :: forall vars schema query
   . HFoldlWithIndex (VarTypeNameProps schema query) String { | vars } String
  => Proxy schema
  -> Proxy query
  -> { | vars }
  -> String
varTypeNameRecord _ _ r =
  "( "
    <> hfoldlWithIndex (VarTypeNameProps :: VarTypeNameProps schema query) "" r
    <> " )"

data VarTypeNameProps schema query = VarTypeNameProps

instance varTypeNameProps ::
  ( GqlType a gqlName nullable
  , BoolRuntime nullable
  , IsSymbol sym
  , IsSymbol gqlName
  ) =>
  FoldingWithIndex (VarTypeNameProps schema query) (Proxy sym) String a String where
  foldingWithIndex VarTypeNameProps prop str _ = pre <> reflectSymbol prop <> ": " <> printGqlType (Proxy :: _ a)
    where
    pre
      | str == "" = "$"
      | otherwise = str <> ", $"

data QueryGqlVarTypes :: forall k. k -> Row Type -> Type
data QueryGqlVarTypes schema vars = QueryGqlVarTypes { | vars }


type GqlVarTypes = List ({ })

-- instance 
--   ( IsSymbol prop
--   , IsSymbol varSym


--   ) => 
--   FoldingWithIndex (QueryGqlVarTypes schema vars) (Proxy prop) acc (Var varSym varT) result where 
--   foldingWithIndex _ _ acc _ = acc

-- instance 
