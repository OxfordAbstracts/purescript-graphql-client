-- | Utilities for making purs code gen
module GraphQL.Client.CodeGen.Util where

import Prelude

import Data.Foldable (class Foldable, foldMap, intercalate)
import Data.GraphQL.AST as AST
import Data.Map (Map, lookup)
import Data.Maybe (Maybe, fromMaybe')
import Data.String.Extra (pascalCase)
import GraphQL.Client.CodeGen.Lines (indent)

namedTypeToPurs :: Map String String -> AST.NamedType -> String
namedTypeToPurs gqlScalarsToPursTypes (AST.NamedType str) = typeName gqlScalarsToPursTypes str

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

argumentsDefinitionToPurs :: Map String String -> AST.ArgumentsDefinition -> String
argumentsDefinitionToPurs gqlScalarsToPursTypes (AST.ArgumentsDefinition inputValueDefinitions) =
  indent $ inputValueDefinitionsToPurs gqlScalarsToPursTypes inputValueDefinitions <> "==> "

inputValueDefinitionsToPurs :: forall f. Foldable f => Functor f => Map String String -> f AST.InputValueDefinition -> String
inputValueDefinitionsToPurs gqlScalarsToPursTypes inputValueDefinitions = 
   "\n{ "
    <> intercalate "\n, " (map (inputValueDefinitionToPurs gqlScalarsToPursTypes) inputValueDefinitions)
    <> "\n}\n"


inputValueDefinitionToPurs :: Map String String -> AST.InputValueDefinition -> String
inputValueDefinitionToPurs gqlScalarsToPursTypes ( AST.InputValueDefinition
    { description
  , name
  , type: tipe
  }
) =
  inlineComment description
    <> name
    <> " :: "
    <> argTypeToPurs gqlScalarsToPursTypes tipe

argTypeToPurs :: Map String String -> AST.Type -> String
argTypeToPurs gqlScalarsToPursTypes = case _ of
  (AST.Type_NamedType namedType) -> namedTypeToPurs gqlScalarsToPursTypes namedType
  (AST.Type_ListType listType) -> argListTypeToPurs gqlScalarsToPursTypes listType
  (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs gqlScalarsToPursTypes notNullType

argNotNullTypeToPurs :: Map String String -> AST.NonNullType -> String
argNotNullTypeToPurs gqlScalarsToPursTypes = case _ of
  AST.NonNullType_NamedType t -> namedTypeToPurs gqlScalarsToPursTypes t
  AST.NonNullType_ListType t -> argListTypeToPurs gqlScalarsToPursTypes t

argListTypeToPurs :: Map String String -> AST.ListType -> String
argListTypeToPurs gqlScalarsToPursTypes (AST.ListType t) = "(Array " <> argTypeToPurs gqlScalarsToPursTypes t <> ")"

wrapNotNull :: String -> String
wrapNotNull s = "(NotNull " <> s <> ")"
