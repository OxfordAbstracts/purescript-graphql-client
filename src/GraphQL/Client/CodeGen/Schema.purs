-- | Codegen functions to get purs schema code from graphQL schemas
module GraphQL.Client.CodeGen.Schema
  ( schemaFromGqlToPurs
  , schemasFromGqlToPurs
  , indent
  ) where

import Prelude hiding (between)

import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Array (elem, fold, notElem, nub, nubBy)
import Data.Array as Array
import Data.Either (Either(..), hush)
import Data.Foldable (foldMap, intercalate)
import Data.Function (on)
import Data.FunctorWithIndex (mapWithIndex)
import Data.GraphQL.AST as AST
import Data.GraphQL.Parser (document)
import Data.List (List, mapMaybe)
import Data.List as List
import Data.Map (lookup)
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.Monoid (guard)
import Data.Newtype (unwrap)
import Data.String (Pattern(..), codePointFromChar, contains, joinWith)
import Data.String.CodePoints (takeWhile)
import Data.String.Extra (pascalCase)
import Data.String.Regex (split)
import Data.String.Regex.Flags (global)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Traversable (sequence, traverse)
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import GraphQL.Client.CodeGen.GetSymbols (getSymbols, symbolsToCode)
import GraphQL.Client.CodeGen.Template.Enum as GqlEnum
import GraphQL.Client.CodeGen.Template.Schema as Schema
import GraphQL.Client.CodeGen.Types (FilesToWrite, GqlEnum, GqlInput, InputOptions, PursGql)
import Text.Parsing.Parser (ParseError, runParser)

schemasFromGqlToPurs :: InputOptions -> Array GqlInput -> Aff (Either ParseError FilesToWrite)
schemasFromGqlToPurs opts_ = traverse (schemaFromGqlToPursWithCache opts) >>> map sequence >>> map (map collectSchemas)
  where
  modulePrefix = foldMap (_ <> ".") opts.modulePath

  opts = opts_ { fieldTypeOverrides = fieldTypeOverrides }

  fieldTypeOverrides =
    Map.unions
      $ opts_.fieldTypeOverrides
      # mapWithIndex \gqlObjectName obj ->
          Map.fromFoldable
            [ Tuple gqlObjectName obj
            , Tuple (gqlObjectName <> "InsertInput") obj
            , Tuple (gqlObjectName <> "MinFields") obj
            , Tuple (gqlObjectName <> "MaxFields") obj
            , Tuple (gqlObjectName <> "SetInput") obj
            , Tuple (gqlObjectName <> "BoolExp") $ map (\o -> o { typeName = o.typeName <> "ComparisonExp" }) obj
            ]

  collectSchemas :: Array PursGql -> FilesToWrite
  collectSchemas pursGqls =
    { schemas:
        pursGqls
          <#> \pg ->
              { code:
                  Schema.template
                    { name: pg.moduleName
                    , mainSchemaCode: pg.mainSchemaCode
                    , enums: map _.name pg.enums
                    , modulePrefix
                    }
              , path: opts.dir <> "/Schema/" <> pg.moduleName <> ".purs"
              }
    , enums:
        nubBy (compare `on` _.path)
          $ pursGqls
          >>= \pg ->
              pg.enums
                <#> \e ->
                    { code: GqlEnum.template modulePrefix e
                    , path: opts.dir <> "/Enum/" <> e.name <> ".purs"
                    }
    , symbols:
        pursGqls >>= _.symbols
          # \syms ->
              { path: opts.dir <> "/Symbols.purs", code: symbolsToCode modulePrefix syms }
    }

-- | Given a gql doc this will create the equivalent purs gql schema
schemaFromGqlToPursWithCache :: InputOptions -> GqlInput -> Aff (Either ParseError PursGql)
schemaFromGqlToPursWithCache opts { schema, moduleName } = go opts.cache
  where
  go Nothing = pure $ schemaFromGqlToPurs opts { schema, moduleName }

  go (Just { get, set }) = do
    jsonMay <- get schema
    eVal <- case jsonMay >>= decodeJson >>> hush of
      Nothing -> go Nothing
      Just res -> pure $ Right res
    case eVal of
      Right val -> set { key: schema, val: encodeJson val }
      _ -> pure unit
    pure $ eVal

schemaFromGqlToPurs :: InputOptions -> GqlInput -> Either ParseError PursGql
schemaFromGqlToPurs opts { schema, moduleName } =
  runParser schema document
    <#> \ast ->
        let
          symbols = Array.fromFoldable $ getSymbols ast
        in
          { mainSchemaCode: gqlToPursMainSchemaCode opts ast
          , enums: gqlToPursEnums ast
          , symbols
          , moduleName
          }

toImport ::
  forall r.
  String ->
  Array
    { moduleName :: String
    | r
    } ->
  Array String
toImport mainCode =
  map
    ( \t ->
        guard (contains (Pattern t.moduleName) mainCode)
          $ "\nimport "
          <> t.moduleName
          <> " as "
          <> t.moduleName
    )

gqlToPursMainSchemaCode :: InputOptions -> AST.Document -> String
gqlToPursMainSchemaCode { externalTypes, fieldTypeOverrides, useNewtypesForRecords } doc =
  imports
    <> guard (imports /= "") "\n"
    <> "\n"
    <> mainCode
  where
  imports =
    fold $ nub
      $ toImport mainCode (Array.fromFoldable externalTypes)
      <> toImport mainCode (Array.fromFoldable $ fold fieldTypeOverrides)

  mainCode = unwrap doc # mapMaybe definitionToPurs # removeDuplicateDefinitions # intercalate "\n\n"

  removeDuplicateDefinitions = Array.fromFoldable >>> nubBy (compare `on` getDefinitionTypeName) >>> List.fromFoldable

  getDefinitionTypeName :: String -> String
  getDefinitionTypeName = takeWhile (notEq (codePointFromChar '='))

  definitionToPurs :: AST.Definition -> Maybe String
  definitionToPurs = case _ of
    AST.Definition_ExecutableDefinition def -> Nothing
    AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
    AST.Definition_TypeSystemExtension ext -> Nothing

  typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> Maybe String
  typeSystemDefinitionToPurs = case _ of
    AST.TypeSystemDefinition_SchemaDefinition schemaDefinition -> Just $ schemaDefinitionToPurs schemaDefinition
    AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
    AST.TypeSystemDefinition_DirectiveDefinition directiveDefinition -> directiveDefinitionToPurs directiveDefinition

  schemaDefinitionToPurs :: AST.SchemaDefinition -> String
  schemaDefinitionToPurs (AST.SchemaDefinition { rootOperationTypeDefinition, directives }) = map rootOperationTypeDefinitionToPurs rootOperationTypeDefinition # intercalate "\n\n"

  rootOperationTypeDefinitionToPurs :: AST.RootOperationTypeDefinition -> String
  rootOperationTypeDefinitionToPurs (AST.RootOperationTypeDefinition { operationType, namedType }) =
    "type "
      <> opStr
      <> " = "
      <> typeName (namedTypeToPurs namedType)
    where
    opStr = case operationType of
      AST.Query -> "Query"
      AST.Mutation -> "Mutation"
      AST.Subscription -> "Subscription"

  typeDefinitionToPurs :: AST.TypeDefinition -> Maybe String
  typeDefinitionToPurs = case _ of
    AST.TypeDefinition_ScalarTypeDefinition scalarTypeDefinition -> Just $ scalarTypeDefinitionToPurs scalarTypeDefinition
    AST.TypeDefinition_ObjectTypeDefinition objectTypeDefinition -> Just $ objectTypeDefinitionToPurs objectTypeDefinition
    AST.TypeDefinition_InterfaceTypeDefinition interfaceTypeDefinition -> interfaceTypeDefinitionToPurs interfaceTypeDefinition
    AST.TypeDefinition_UnionTypeDefinition unionTypeDefinition -> unionTypeDefinitionToPurs unionTypeDefinition
    AST.TypeDefinition_EnumTypeDefinition enumTypeDefinition -> enumTypeDefinitionToPurs enumTypeDefinition
    AST.TypeDefinition_InputObjectTypeDefinition inputObjectTypeDefinition -> Just $ inputObjectTypeDefinitionToPurs inputObjectTypeDefinition

  scalarTypeDefinitionToPurs :: AST.ScalarTypeDefinition -> String
  scalarTypeDefinitionToPurs (AST.ScalarTypeDefinition { description, name, directives }) =
    guard (notElem tName builtInTypes) case lookup tName externalTypes of
      Nothing ->
        guard (not $ isExternalType tName)
          ( descriptionToDocComment description
              <> "newtype "
              <> tName
              <> " = "
              <> tName
              <> inside
          )
      Just external ->
        descriptionToDocComment description
          <> "type "
          <> tName
          <> " = "
          <> external.moduleName
          <> "."
          <> external.typeName
    where
    tName = typeName name

    inside = case tName of
      _ -> "UNKNOWN!!!!"

  builtInTypes = [ "Int", "Number", "String", "Boolean" ]

  isExternalType tName = elem tName externalTypesArr

  externalTypesArr = Map.keys externalTypes # Array.fromFoldable

  objectTypeDefinitionToPurs :: AST.ObjectTypeDefinition -> String
  objectTypeDefinitionToPurs ( AST.ObjectTypeDefinition
      { description
    , directives
    , fieldsDefinition
    , implementsInterfaces
    , name
    }
  ) =
    let
      tName = typeName name
    in
      descriptionToDocComment description
        <> if useNewtypesForRecords then
            "newtype "
              <> typeName name
              <> (fieldsDefinition # foldMap \fd -> " = " <> typeName name <> " " <> fieldsDefinitionToPurs tName fd)
              <> "\nderive instance newtype"
              <> tName
              <> " :: Newtype "
              <> tName
              <> " _"
              <> "\ninstance argToGql"
              <> tName
              <> " :: (Newtype "
              <> tName
              <> " {| p},  RecordArg p a u) => ArgGql "
              <> tName
              <> " { | a }"
          else
            "type "
              <> typeName name
              <> (fieldsDefinition # foldMap \fd -> " = " <> fieldsDefinitionToPurs tName fd)

  fieldsDefinitionToPurs :: String -> AST.FieldsDefinition -> String
  fieldsDefinitionToPurs objectName (AST.FieldsDefinition fieldsDefinition) =
    indent
      $ "\n{ "
      <> intercalate "\n, " (map (fieldDefinitionToPurs objectName) fieldsDefinition)
      <> "\n}"

  fieldDefinitionToPurs :: String -> AST.FieldDefinition -> String
  fieldDefinitionToPurs objectName ( AST.FieldDefinition
      { description
    , name
    , argumentsDefinition
    , type: tipe
    , directives
    }
  ) =
    descriptionToDocComment description
      <> name
      <> " :: "
      <> foldMap argumentsDefinitionToPurs argumentsDefinition
      <> case lookup objectName fieldTypeOverrides >>= lookup name of
          Nothing -> typeToPurs tipe
          Just out -> out.moduleName <> "." <> out.typeName

  argumentsDefinitionToPurs :: AST.ArgumentsDefinition -> String
  argumentsDefinitionToPurs (AST.ArgumentsDefinition inputValueDefinitions) =
    indent
      $ "\n{ "
      <> intercalate "\n, " (map inputValueDefinitionsToPurs inputValueDefinitions)
      <> "\n}\n==> "

  inputValueDefinitionsToPurs :: AST.InputValueDefinition -> String
  inputValueDefinitionsToPurs ( AST.InputValueDefinition
      { description
    , name
    , type: tipe
    , defaultValue
    , directives
    }
  ) =
    descriptionToDocComment description
      <> name
      <> " :: "
      <> argTypeToPurs tipe

  interfaceTypeDefinitionToPurs :: AST.InterfaceTypeDefinition -> Maybe String
  interfaceTypeDefinitionToPurs (AST.InterfaceTypeDefinition def) = Nothing

  unionTypeDefinitionToPurs :: AST.UnionTypeDefinition -> Maybe String
  unionTypeDefinitionToPurs (AST.UnionTypeDefinition def) = Nothing

  enumTypeDefinitionToPurs :: AST.EnumTypeDefinition -> Maybe String
  enumTypeDefinitionToPurs (AST.EnumTypeDefinition def) = Nothing

  inputObjectTypeDefinitionToPurs :: AST.InputObjectTypeDefinition -> String
  inputObjectTypeDefinitionToPurs ( AST.InputObjectTypeDefinition
      { description
    , directives
    , inputFieldsDefinition
    , name
    }
  ) =
    let
      tName = typeName name
    in
      descriptionToDocComment description
        <> "newtype "
        <> tName
        <> ( inputFieldsDefinition
              # foldMap \(AST.InputFieldsDefinition fd) ->
                  " = "
                    <> tName
                    <> inputValueToFieldsDefinitionToPurs tName fd
          )
        <> "\nderive instance newtype"
        <> tName
        <> " :: Newtype "
        <> tName
        <> " _"
        <> "\ninstance argToGql"
        <> tName
        <> " :: (Newtype "
        <> tName
        <> " {| p},  RecordArg p a u) => ArgGql "
        <> tName
        <> " { | a }"

  inputValueToFieldsDefinitionToPurs :: String -> List AST.InputValueDefinition -> String
  inputValueToFieldsDefinitionToPurs objectName definitions =
    indent
      $ "\n{ "
      <> intercalate "\n, " (map (inputValueDefinitionToPurs objectName) definitions)
      <> "\n}"

  inputValueDefinitionToPurs :: String -> AST.InputValueDefinition -> String
  inputValueDefinitionToPurs objectName ( AST.InputValueDefinition
      { defaultValue
    , description
    , directives
    , name
    , type: tipe
    }
  ) =
    descriptionToDocComment description
      <> name
      <> " :: "
      -- <> foldMap argumentsDefinitionToPurs argumentsDefinition
      
      <> case lookup objectName fieldTypeOverrides >>= lookup name of
          Nothing -> argTypeToPurs tipe
          Just out -> out.moduleName <> "." <> out.typeName

  directiveDefinitionToPurs :: AST.DirectiveDefinition -> Maybe String
  directiveDefinitionToPurs directiveDefinition = Nothing

  argTypeToPurs :: AST.Type -> String
  argTypeToPurs = case _ of
    (AST.Type_NamedType namedType) -> namedTypeToPurs namedType
    (AST.Type_ListType listType) -> argListTypeToPurs listType
    (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs notNullType

  argNotNullTypeToPurs :: AST.NonNullType -> String
  argNotNullTypeToPurs = case _ of
    AST.NonNullType_NamedType t -> namedTypeToPurs t
    AST.NonNullType_ListType t -> argListTypeToPurs t

  argListTypeToPurs :: AST.ListType -> String
  argListTypeToPurs (AST.ListType t) = "(Array " <> argTypeToPurs t <> ")"

  wrapNotNull s = "(NotNull " <> s <> ")"

  typeToPurs :: AST.Type -> String
  typeToPurs = case _ of
    (AST.Type_NamedType namedType) -> namedTypeToPursNullable namedType
    (AST.Type_ListType listType) -> listTypeToPursNullable listType
    (AST.Type_NonNullType notNullType) -> notNullTypeToPurs notNullType

  namedTypeToPursNullable :: AST.NamedType -> String
  namedTypeToPursNullable = wrapMaybe <<< namedTypeToPurs

  listTypeToPursNullable :: AST.ListType -> String
  listTypeToPursNullable t = wrapMaybe $ listTypeToPurs t

  wrapMaybe s = "(Maybe " <> s <> ")"

  notNullTypeToPurs :: AST.NonNullType -> String
  notNullTypeToPurs = case _ of
    AST.NonNullType_NamedType t -> namedTypeToPurs t
    AST.NonNullType_ListType t -> listTypeToPurs t

  listTypeToPurs :: AST.ListType -> String
  listTypeToPurs (AST.ListType t) = "(Array " <> typeToPurs t <> ")"

gqlToPursEnums :: AST.Document -> Array GqlEnum
gqlToPursEnums = unwrap >>> mapMaybe definitionToEnum >>> Array.fromFoldable
  where
  definitionToEnum :: AST.Definition -> Maybe GqlEnum
  definitionToEnum = case _ of
    AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
    _ -> Nothing

  definitionToPurs :: AST.Definition -> Maybe GqlEnum
  definitionToPurs = case _ of
    AST.Definition_ExecutableDefinition def -> Nothing
    AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
    AST.Definition_TypeSystemExtension ext -> Nothing

  typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> Maybe GqlEnum
  typeSystemDefinitionToPurs = case _ of
    AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
    _ -> Nothing

  typeDefinitionToPurs :: AST.TypeDefinition -> Maybe GqlEnum
  typeDefinitionToPurs = case _ of
    AST.TypeDefinition_EnumTypeDefinition (AST.EnumTypeDefinition enumTypeDefinition) ->
      Just
        { name: typeName enumTypeDefinition.name
        , values: maybe [] enumValuesDefinitionToPurs enumTypeDefinition.enumValuesDefinition
        }
    _ -> Nothing

  enumValuesDefinitionToPurs :: AST.EnumValuesDefinition -> Array String
  enumValuesDefinitionToPurs def =
    Array.fromFoldable $ unwrap def
      <#> \(AST.EnumValueDefinition { description, enumValue }) ->
          descriptionToDocComment description
            <> enumValueToPurs enumValue

  enumValueToPurs :: AST.EnumValue -> String
  enumValueToPurs = unwrap >>> typeName

namedTypeToPurs :: AST.NamedType -> String
namedTypeToPurs (AST.NamedType str) = typeName str

descriptionToDocComment :: Maybe String -> String
descriptionToDocComment = foldMap (\str -> "\n" <> prependLines " -- | " str <> "\n")

indent :: String -> String
indent = prependLines "  "

prependLines :: String -> String -> String
prependLines pre =
  toLines
    >>> map (\l -> if l == "" then l else pre <> l)
    >>> fromLines

toLines :: String -> Array String
toLines = split (unsafeRegex """\n""" global)

fromLines :: Array String -> String
fromLines = joinWith "\n"

typeName :: String -> String
typeName str = case pascalCase str of
  "Float" -> "Number"
  "Numeric" -> "Number"
  "Bigint" -> "Int"
  "Smallint" -> "Int"
  "Text" -> "String"
  "Citext" -> "String"
  "Jsonb" -> "Json"
  "Timestamp" -> "DateTime"
  s -> s
