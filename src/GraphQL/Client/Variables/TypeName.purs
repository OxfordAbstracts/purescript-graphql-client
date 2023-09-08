module GraphQL.Client.Variables.TypeName where

import Prelude

import Data.Symbol (class IsSymbol, reflectSymbol)
import GraphQL.Client.GqlType (class BoolRuntime, class GqlType, printGqlType)
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex, hfoldlWithIndex)
import Type.Proxy (Proxy(..))


data VarTypeNameProps = VarTypeNameProps

instance varTypeNameProps ::
  ( GqlType a gqlName nullable
  , BoolRuntime nullable
  , IsSymbol sym
  , IsSymbol gqlName
  ) =>
  FoldingWithIndex VarTypeNameProps (Proxy sym) String a String where
  foldingWithIndex VarTypeNameProps prop str _ = pre <> reflectSymbol prop <> ": " <> printGqlType (Proxy :: _ a)
    where
    pre
      | str == "" = "$"
      | otherwise = str <> ", $"

varTypeNameRecord
  :: forall r
   . HFoldlWithIndex VarTypeNameProps String { | r } String
  => { | r }
  -> String
varTypeNameRecord r = "( " <> hfoldlWithIndex VarTypeNameProps "" r <> " )"
