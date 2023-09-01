-- | Utilities for making purs code gen
module GraphQL.Client.CodeGen.UtilCst where

import Prelude

import Data.Array as Array
import Data.Foldable (class Foldable, fold, foldMap, intercalate)
import Data.GraphQL.AST as AST
import Data.Map (Map, lookup)
import Data.Maybe (Maybe(..), fromMaybe')
import Data.String.Extra (pascalCase)
import Data.Tuple (Tuple(..))
import GraphQL.Client.CodeGen.Lines (indent)
import Partial.Unsafe (unsafePartial)
import PureScript.CST.Types as CST
import Tidy.Codegen (binaryOp, docComments, leading, typeApp, typeCtor, typeOp, typeRecord)

namedTypeToPurs :: Map String String -> AST.NamedType -> CST.Type Void
namedTypeToPurs gqlScalarsToPursTypes (AST.NamedType str) =
  unsafePartial $ typeCtor $ typeName gqlScalarsToPursTypes str

inlineComment :: Maybe String -> String
inlineComment = foldMap (\str -> "\n{- " <> str <> " -}\n")

typeName :: Map String String -> String -> String
typeName gqlScalarsToPursTypes str =
  lookup str gqlScalarsToPursTypes
    # fromMaybe' \_ -> case pascalCase str of
        "Id" -> "ID"
        "Float" -> "Number"
        "Numeric" -> "Number"
        "Bigint" -> "Number"
        "Smallint" -> "Int"
        "Integer" -> "Int"
        "Int" -> "Int"
        "Int2" -> "Int"
        "Int4" -> "Int"
        "Int8" -> "Int"
        "Text" -> "String"
        "Citext" -> "String"
        "Jsonb" -> "Json"
        "Timestamp" -> "DateTime"
        "Timestamptz" -> "DateTime"
        s -> s

-- argumentsDefinitionToPurs :: Map String String -> AST.ArgumentsDefinition -> _
argumentsDefinitionToPurs :: Partial => Map String String -> AST.ArgumentsDefinition -> CST.Type Void -> CST.Type Void
argumentsDefinitionToPurs gqlScalarsToPursTypes (AST.ArgumentsDefinition inputValueDefinitions) a =
  typeOp (inputValueDefinitionsToPurs gqlScalarsToPursTypes inputValueDefinitions) [ binaryOp "==>" a ]

inputValueDefinitionsToPurs :: forall f. Foldable f => Functor f => Map String String -> f AST.InputValueDefinition -> CST.Type Void
inputValueDefinitionsToPurs gqlScalarsToPursTypes inputValueDefinitions = unsafePartial $
  typeRecord (map (inputValueDefinitionToPurs gqlScalarsToPursTypes) $ Array.fromFoldable inputValueDefinitions) Nothing

inputValueDefinitionToPurs :: Map String String -> AST.InputValueDefinition -> Tuple String (CST.Type Void)
inputValueDefinitionToPurs
  gqlScalarsToPursTypes
  ( AST.InputValueDefinition
      { description
      , name
      , type: tipe
      }
  ) =
  Tuple name 
    -- $ leading (docComments $ fold description) 
    (argTypeToPurs gqlScalarsToPursTypes tipe)

argTypeToPurs :: Map String String -> AST.Type -> CST.Type Void
argTypeToPurs gqlScalarsToPursTypes = case _ of
  (AST.Type_NamedType namedType) -> namedTypeToPurs gqlScalarsToPursTypes namedType
  (AST.Type_ListType listType) -> argListTypeToPurs gqlScalarsToPursTypes listType
  (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs gqlScalarsToPursTypes notNullType

argNotNullTypeToPurs :: Map String String -> AST.NonNullType -> CST.Type Void
argNotNullTypeToPurs gqlScalarsToPursTypes = case _ of
  AST.NonNullType_NamedType t -> namedTypeToPurs gqlScalarsToPursTypes t
  AST.NonNullType_ListType t -> argListTypeToPurs gqlScalarsToPursTypes t

argListTypeToPurs :: Map String String -> AST.ListType -> CST.Type Void
argListTypeToPurs gqlScalarsToPursTypes (AST.ListType t) = unsafePartial $ typeApp (typeCtor "Array") [ argTypeToPurs gqlScalarsToPursTypes t ]

wrapNotNull :: CST.Type Void -> CST.Type Void
wrapNotNull s = unsafePartial $ typeApp (typeCtor "NotNull") [ s ]
