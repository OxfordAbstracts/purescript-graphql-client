-- | Utilities for making purs code gen
module GraphQL.Client.CodeGen.UtilCst where

import Prelude

import Data.Array as Array
import Data.Foldable (class Foldable, fold)
import Data.GraphQL.AST as AST
import Data.Map (Map, lookup)
import Data.Maybe (Maybe(..), fromMaybe')
import Data.String.Extra (pascalCase)
import Data.Tuple (Tuple(..))
import GraphQL.Client.CodeGen.Types (QualifiedType)
import Partial.Unsafe (unsafePartial)
import PureScript.CST.Types (ModuleName(..), Proper(..), QualifiedName)
import PureScript.CST.Types as CST
import Tidy.Codegen (binaryOp, docComments, leading, typeApp, typeCtor, typeOp, typeRecord)
import Tidy.Codegen.Class (toQualifiedName)
import Tidy.Codegen.Types (Qualified(..))

namedTypeToPurs :: Map String QualifiedType -> QualifiedType -> AST.NamedType -> CST.Type Void
namedTypeToPurs gqlScalarsToPursTypes id (AST.NamedType str) =
  unsafePartial $ typeCtor $ typeName gqlScalarsToPursTypes id str

typeName :: Map String QualifiedType -> QualifiedType -> String -> QualifiedName Proper
typeName gqlScalarsToPursTypes id str =
  lookup str gqlScalarsToPursTypes
    <#> qualifiedTypeToName
    # fromMaybe' \_ -> case pascalCase str of
        "Id" -> qualifiedTypeToName id
        "Float" -> qualifiy "Number"
        "Numeric" -> qualifiy "Number"
        "Bigint" -> qualifiy "Number"
        "Smallint" -> qualifiy "Int"
        "Integer" -> qualifiy "Int"
        "Int" -> qualifiy "Int"
        "Int2" -> qualifiy "Int"
        "Int4" -> qualifiy "Int"
        "Int8" -> qualifiy "Int"
        "Text" -> qualifiy "String"
        "Citext" -> qualifiy "String"
        "Jsonb" -> qualifiedTypeToName
          { typeName: "Json"
          , moduleName: "Data.Argonaut.Core"
          }
        "Timestamp" -> qualifiedTypeToName
          { typeName: "DateTime"
          , moduleName: "Data.DateTime"
          }
        "Timestamptz" -> qualifiedTypeToName
          { typeName: "DateTime"
          , moduleName: "Data.DateTime"
          }
        s -> qualifiy s

qualifiy :: String -> QualifiedName Proper
qualifiy = toQualifiedName <<< Proper

qualifiedTypeToName :: QualifiedType -> QualifiedName Proper
qualifiedTypeToName { moduleName, typeName } =
  case moduleName of
    "" -> qualifiy typeName
    _ ->
      toQualifiedName
        $ Qualified (Just $ ModuleName moduleName)
        $ Proper typeName

-- argumentsDefinitionToPurs :: Map String QualifiedType -> AST.ArgumentsDefinition -> _
argumentsDefinitionToPurs :: Partial => Map String QualifiedType -> QualifiedType -> AST.ArgumentsDefinition -> CST.Type Void -> CST.Type Void
argumentsDefinitionToPurs gqlScalarsToPursTypes id (AST.ArgumentsDefinition inputValueDefinitions) a =
  typeOp (inputValueDefinitionsToPurs gqlScalarsToPursTypes id inputValueDefinitions) [ binaryOp "==>" a ]

inputValueDefinitionsToPurs :: forall f. Foldable f => Functor f => Map String QualifiedType -> QualifiedType -> f AST.InputValueDefinition -> CST.Type Void
inputValueDefinitionsToPurs gqlScalarsToPursTypes id inputValueDefinitions = unsafePartial $
  typeRecord (map (inputValueDefinitionToPurs gqlScalarsToPursTypes id) $ Array.fromFoldable inputValueDefinitions) Nothing

inputValueDefinitionToPurs :: Map String QualifiedType -> QualifiedType -> AST.InputValueDefinition -> Tuple String (CST.Type Void)
inputValueDefinitionToPurs
  gqlScalarsToPursTypes
  id
  ( AST.InputValueDefinition
      { description
      , name
      , type: tipe
      }
  ) =
  Tuple name
    $ leading (docComments $ fold description)
        (argTypeToPurs gqlScalarsToPursTypes id tipe)

argTypeToPurs :: Map String QualifiedType -> QualifiedType -> AST.Type -> CST.Type Void
argTypeToPurs gqlScalarsToPursTypes id = case _ of
  (AST.Type_NamedType namedType) -> namedTypeToPurs gqlScalarsToPursTypes id namedType
  (AST.Type_ListType listType) -> argListTypeToPurs gqlScalarsToPursTypes id listType
  (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs gqlScalarsToPursTypes id notNullType

argNotNullTypeToPurs :: Map String QualifiedType -> QualifiedType -> AST.NonNullType -> CST.Type Void
argNotNullTypeToPurs gqlScalarsToPursTypes id = case _ of
  AST.NonNullType_NamedType t -> namedTypeToPurs gqlScalarsToPursTypes id t
  AST.NonNullType_ListType t -> argListTypeToPurs gqlScalarsToPursTypes id t

argListTypeToPurs :: Map String QualifiedType -> QualifiedType -> AST.ListType -> CST.Type Void
argListTypeToPurs gqlScalarsToPursTypes id (AST.ListType t) = unsafePartial $ typeApp (typeCtor "Array") [ argTypeToPurs gqlScalarsToPursTypes id t ]

wrapNotNull :: CST.Type Void -> CST.Type Void
wrapNotNull s = unsafePartial $ typeApp (typeCtor "NotNull") [ s ]
