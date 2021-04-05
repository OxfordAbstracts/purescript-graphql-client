module GraphQL.Client.CodeGen.Query (queryFromGqlToPurs) where

import Prelude

import Data.Char.Unicode as Unicode
import Data.Either (Either)
import Data.GraphQL.AST as AST
import Data.GraphQL.Parser (document)
import Data.List (fold, foldMap, intercalate, mapMaybe)
import Data.Maybe (Maybe(..))
import Data.Monoid (guard)
import Data.Newtype (unwrap)
import Data.String.CodeUnits as SCU
import GraphQL.Client.CodeGen.Lines (indent)
import Text.Parsing.Parser (ParseError, runParser)

queryFromGqlToPurs :: String -> Either ParseError String
queryFromGqlToPurs gql = runParser gql document <#> toPurs
  where
  toPurs :: AST.Document -> String
  toPurs = unwrap >>> mapMaybe definitionToPurs >>> intercalate "\n\n"

  definitionToPurs :: AST.Definition -> Maybe String
  definitionToPurs = case _ of
    AST.Definition_ExecutableDefinition def -> executableDefinitionToPurs def
    AST.Definition_TypeSystemDefinition def -> Nothing
    AST.Definition_TypeSystemExtension ext -> Nothing

  executableDefinitionToPurs :: AST.ExecutableDefinition -> Maybe String
  executableDefinitionToPurs = case _ of 
    (AST.ExecutableDefinition_OperationDefinition op) -> Just $ operationDefinitionToPurs op
    (AST.ExecutableDefinition_FragmentDefinition _) -> Nothing

  operationDefinitionToPurs :: AST.OperationDefinition -> String 
  operationDefinitionToPurs = case _ of 
    (AST.OperationDefinition_SelectionSet set) -> selectionSetToPurs set
    (AST.OperationDefinition_OperationType opType) -> operationTypeToPurs opType

  operationTypeToPurs 
    { directives
    , name
    , operationType
    , selectionSet
    , variableDefinitions
    } = lowerCaseFirst (fold name) <> " = " <> selectionSetToPurs selectionSet

  selectionSetToPurs :: AST.SelectionSet -> String
  selectionSetToPurs (AST.SelectionSet selections) = 
    indent
      $ "\n{ "
      <> intercalate "\n, " (mapMaybe selectionToPurs selections)
      <> "\n}"

  selectionToPurs :: AST.Selection -> Maybe String
  selectionToPurs = case _ of 
    (AST.Selection_Field field) -> Just $ fieldToPurs field
    (AST.Selection_FragmentSpread _) -> Nothing
    (AST.Selection_InlineFragment _) -> Nothing

  fieldToPurs :: AST.Field -> String
  fieldToPurs (AST.Field 
    { alias
    , name
    , arguments
    , directives
    , selectionSet
    }) = 

        foldMap (\a -> a <> ": ") alias 
        <> name 
        <> guard (body /= "") ":"
        <> foldMap argumentsToPurs arguments
        <> foldMap selectionSetToPurs selectionSet
        where 
        body = foldMap argumentsToPurs arguments
            <> foldMap selectionSetToPurs selectionSet


  argumentsToPurs :: AST.Arguments -> String
  argumentsToPurs (AST.Arguments args) = 
      indent
      $ "\n{ "
      <> intercalate "\n, " (map argumentToPurs args)
      <> "\n} =>>"

  argumentToPurs :: AST.Argument -> String
  argumentToPurs (AST.Argument {name, value}) = name <> ": " <> valueToPurs value 
  
  valueToPurs :: AST.Value -> String
  valueToPurs = case _ of 
    AST.Value_Variable val -> "Value_Variable not yet implemented"
    AST.Value_IntValue val -> show $ unwrap val
    AST.Value_FloatValue val -> show $ unwrap val 
    AST.Value_StringValue val -> show $ unwrap val 
    AST.Value_BooleanValue val -> show $ unwrap val 
    AST.Value_NullValue val -> "NullValue variable not yet implemented"
    AST.Value_EnumValue val -> unwrap val 
    AST.Value_ListValue val -> listValueToPurs val
    AST.Value_ObjectValue val -> objectValueToPurs val 


  objectValueToPurs :: AST.ObjectValue -> String
  objectValueToPurs (AST.ObjectValue args) = 
      indent
      $ "\n{ "
      <> intercalate "\n, " (map argumentToPurs args)
      <> "\n}"

  listValueToPurs :: AST.ListValue -> String
  listValueToPurs (AST.ListValue args) = 
      indent
      $ "( "
      <> intercalate " ++ " (map valueToPurs args)
      <> " )"

lowerCaseFirst :: String -> String
lowerCaseFirst =
  SCU.uncons >>> foldMap \{ head, tail } ->
    SCU.singleton (Unicode.toLower head) <> tail