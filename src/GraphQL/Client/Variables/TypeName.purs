module GraphQL.Client.Variables.TypeName where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe)
import Data.String.CodeUnits (dropRight, takeRight)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Heterogeneous.Folding (class FoldingWithIndex, class HFoldlWithIndex, hfoldlWithIndex)
import Type.Proxy (Proxy(..))

class VarTypeName :: forall k. k -> Constraint
class VarTypeName var where
  varTypeName :: Proxy var -> String

instance varTypeNameInt :: VarTypeName Int where
  varTypeName _ = "Int!"

instance varTypeNameNumber :: VarTypeName Number where
  varTypeName _ = "Float!"

instance varTypeNameString :: VarTypeName String where
  varTypeName _ = "String!"

instance varTypeNameJson :: VarTypeName Json where
  varTypeName _ = "jsonb!"

instance varTypeNameArray :: VarTypeName a => VarTypeName (Array a) where
  varTypeName _ = "[" <> varTypeName (Proxy :: _ a) <> "]!"

instance varTypeNameMaybe :: VarTypeName a => VarTypeName (Maybe a) where
  varTypeName _ =
    let
      inner = varTypeName (Proxy :: _ a)
    in
      if takeRight 1 inner == "!" then
        dropRight 1 inner
      else
        inner

data VarTypeNameProps
  = VarTypeNameProps

instance varTypeNameProps ::
  (VarTypeName a, IsSymbol sym) =>
  FoldingWithIndex VarTypeNameProps (Proxy sym) String a String where
  foldingWithIndex VarTypeNameProps prop str _ = pre <> reflectSymbol prop <> ": " <> varTypeName (Proxy :: _ a)
    where
    pre
      | str == "" = "$"
      | otherwise = str <> ", $"

varTypeNameRecord ::
  forall r.
  HFoldlWithIndex VarTypeNameProps String { | r } String =>
  { | r } ->
  String
varTypeNameRecord r = "( " <> hfoldlWithIndex VarTypeNameProps "" r <> " )"
