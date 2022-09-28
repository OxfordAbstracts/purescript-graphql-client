-- | Codegen functions to get purs schema code from graphQL schemas
module GraphQL.Client.CodeGen.Schema
  ( schemaFromGqlToPurs
  , schemasFromGqlToPurs
  ) where

import Prelude

import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Array (filter, notElem, nub, nubBy)
import Data.Array as Array
import Data.CodePoint.Unicode (isLower)
import Data.Either (Either(..), hush)
import Data.Foldable (fold, foldMap, foldl, intercalate)
import Data.Function (on)
import Data.FunctorWithIndex (mapWithIndex)
import Data.GraphQL.AST as AST
import Data.GraphQL.Parser (document)
import Data.List (List, mapMaybe)
import Data.List as List
import Data.Map (Map, lookup)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, fromMaybe', maybe)
import Data.Monoid (guard)
import Data.Newtype (unwrap)
import Data.String (Pattern(..), codePointFromChar, contains, take)
import Data.String as String
import Data.String.CodePoints (takeWhile)
import Data.String.CodeUnits (charAt)
import Data.String.Extra (pascalCase)
import Data.Traversable (sequence, traverse)
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import GraphQL.Client.CodeGen.GetSymbols (getSymbols, symbolsToCode)
import GraphQL.Client.CodeGen.Lines (commentPrefix, docComment, fromLines, indent, toLines)
import GraphQL.Client.CodeGen.Template.Enum as Enum
import GraphQL.Client.CodeGen.Template.Schema as Schema
import GraphQL.Client.CodeGen.Types (FilesToWrite, GqlEnum, GqlInput, InputOptions, PursGql)
import Parsing (ParseError, runParser)

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
                  , idImport: opts.idImport
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
                  <#> \{ name, values, description } ->
                    { code:
                        Enum.template modulePrefix
                          { name
                          , schemaName: pg.moduleName
                          , values
                          , description
                          , imports: opts.enumImports
                          , customCode: opts.customEnumCode
                          , enumValueNameTransform: opts.enumValueNameTransform
                          }
                    , path: opts.dir <> "/Schema/" <> pg.moduleName <> "/Enum/" <> name <> ".purs"
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
        , enums: gqlToPursEnums opts.gqlScalarsToPursTypes ast
        , symbols
        , moduleName
        }

toImport
  :: forall r
   . String
  -> Array
       { moduleName :: String
       | r
       }
  -> Array String
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
gqlToPursMainSchemaCode { gqlScalarsToPursTypes, nullableOverrides, externalTypes, fieldTypeOverrides, useNewtypesForRecords } doc =
  imports
    <> guard (imports /= "") "\n"
    <> "\n"
    <> mainCode
  where
  imports =
    fold
      $ nub
      $ toImport mainCode (Array.fromFoldable externalTypes)
          <> toImport mainCode (nub $ foldl (\res m -> res <> Array.fromFoldable m) [] fieldTypeOverrides)
          <> toImport mainCode
            [ { moduleName: "Data.Argonaut.Core" }
            , { moduleName: "GraphQL.Hasura.Array" }
            ]

  mainCode = unwrap doc # mapMaybe definitionToPurs # removeDuplicateDefinitions # intercalate "\n\n"

  removeDuplicateDefinitions = Array.fromFoldable >>> nubBy (compare `on` getDefinitionTypeName) >>> List.fromFoldable

  getDefinitionTypeName :: String -> String
  getDefinitionTypeName =
    takeWhile (notEq (codePointFromChar '='))
      >>> toLines
      >>> filter (\l -> take (String.length commentPrefix) l /= commentPrefix)
      >>> fromLines

  definitionToPurs :: AST.Definition -> Maybe String
  definitionToPurs = case _ of
    AST.Definition_ExecutableDefinition _ -> Nothing
    AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
    AST.Definition_TypeSystemExtension _ -> Nothing

  typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> Maybe String
  typeSystemDefinitionToPurs = case _ of
    AST.TypeSystemDefinition_SchemaDefinition schemaDefinition -> Just $ schemaDefinitionToPurs schemaDefinition
    AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
    AST.TypeSystemDefinition_DirectiveDefinition directiveDefinition -> directiveDefinitionToPurs directiveDefinition

  schemaDefinitionToPurs :: AST.SchemaDefinition -> String
  schemaDefinitionToPurs (AST.SchemaDefinition { rootOperationTypeDefinition }) = map rootOperationTypeDefinitionToPurs rootOperationTypeDefinition # intercalate "\n\n"

  rootOperationTypeDefinitionToPurs :: AST.RootOperationTypeDefinition -> String
  rootOperationTypeDefinitionToPurs (AST.RootOperationTypeDefinition { operationType, namedType }) =
    "type "
      <> opStr
      <> " = "
      <> (namedTypeToPurs_ namedType)
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
  scalarTypeDefinitionToPurs (AST.ScalarTypeDefinition { description, name }) =
    guard (notElem tName builtInTypes)
      $ docComment description
          <> "type "
          <> tName
          <> " = "
          <> typeAndModule.moduleName
          <> "."
          <> typeAndModule.typeName
    where
    tName = typeName_ name

    typeAndModule =
      lookup tName externalTypes
        # fromMaybe
            { moduleName: "Data.Argonaut.Core"
            , typeName: "Json -- Unknown scalar type. Add " <> tName <> " to externalTypes in codegen options to override this behaviour"
            }

  builtInTypes = [ "Int", "Number", "String", "Boolean", "GraphQL.Hasura.Array.Hasura_text" ]

  objectTypeDefinitionToPurs :: AST.ObjectTypeDefinition -> String
  objectTypeDefinitionToPurs
    ( AST.ObjectTypeDefinition
        { description
        , fieldsDefinition
        , name
        }
    ) =
    let
      tName = typeName_ name
    in
      docComment description
        <>
          if useNewtypesForRecords then
            "newtype "
              <> typeName_ name
              <> " = "
              <> typeName_ name
              <> " "
              <> (fieldsDefinition # maybe "{}" (fieldsDefinitionToPurs tName))
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
              <> typeName_ name
              <> (fieldsDefinition # foldMap \fd -> " = " <> fieldsDefinitionToPurs tName fd)

  fieldsDefinitionToPurs :: String -> AST.FieldsDefinition -> String
  fieldsDefinitionToPurs objectName (AST.FieldsDefinition fieldsDefinition) =
    indent
      $ "\n{ "
          <> intercalate "\n, " (map (fieldDefinitionToPurs objectName) fieldsDefinition)
          <> "\n}"

  fieldDefinitionToPurs :: String -> AST.FieldDefinition -> String
  fieldDefinitionToPurs
    objectName
    ( AST.FieldDefinition
        { description
        , name
        , argumentsDefinition
        , type: tipe
        }
    ) =
    inlineComment description
      <> safeFieldname name
      <> " :: "
      <> foldMap argumentsDefinitionToPurs argumentsDefinition
      <> case lookup objectName fieldTypeOverrides >>= lookup name of
        Nothing -> typeToPurs tipe
        Just out -> case tipe of
          AST.Type_NonNullType _ -> out.moduleName <> "." <> out.typeName
          AST.Type_ListType _ -> wrapArray $ out.moduleName <> "." <> out.typeName
          _ -> wrapMaybe $ out.moduleName <> "." <> out.typeName

  argumentsDefinitionToPurs :: AST.ArgumentsDefinition -> String
  argumentsDefinitionToPurs (AST.ArgumentsDefinition inputValueDefinitions) =
    indent
      $ "\n{ "
          <> intercalate "\n, " (map inputValueDefinitionsToPurs inputValueDefinitions)
          <> "\n}\n-> "

  inputValueDefinitionsToPurs :: AST.InputValueDefinition -> String
  inputValueDefinitionsToPurs
    ( AST.InputValueDefinition
        { description
        , name
        , type: tipe
        }
    ) =
    inlineComment description
      <> safeFieldname name
      <> " :: "
      <> argTypeToPurs name tipe

  interfaceTypeDefinitionToPurs :: AST.InterfaceTypeDefinition -> Maybe String
  interfaceTypeDefinitionToPurs (AST.InterfaceTypeDefinition _) = Nothing

  unionTypeDefinitionToPurs :: AST.UnionTypeDefinition -> Maybe String
  unionTypeDefinitionToPurs
    ( AST.UnionTypeDefinition
        { description
        , name
        , directives: Nothing
        , unionMemberTypes: Just (AST.UnionMemberTypes unionMemberTypes)
        }
    ) = Just $
    docComment description
      <> "type "
      <> name
      <> " = GqlUnion"
      <>
        ( indent
            $ "\n( "
                <> intercalate "\n, " (map (unionMemberTypeToPurs <<< unwrap) unionMemberTypes)
                <> "\n)"
        )
  unionTypeDefinitionToPurs _ = Nothing

  unionMemberTypeToPurs :: String -> String
  unionMemberTypeToPurs ty = "\"" <> ty <> "\" :: " <> ty

  enumTypeDefinitionToPurs :: AST.EnumTypeDefinition -> Maybe String
  enumTypeDefinitionToPurs (AST.EnumTypeDefinition _) = Nothing

  inputObjectTypeDefinitionToPurs :: AST.InputObjectTypeDefinition -> String
  inputObjectTypeDefinitionToPurs
    ( AST.InputObjectTypeDefinition
        { description
        , inputFieldsDefinition
        , name
        }
    ) =
    let
      tName = typeName_ name
    in
      docComment description
        <> "newtype "
        <> tName
        <> " = "
        <> tName
        <>
          ( inputFieldsDefinition
              # maybe "{}" \(AST.InputFieldsDefinition fd) ->
                  inputValueToFieldsDefinitionToPurs tName fd
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
  inputValueDefinitionToPurs
    objectName
    ( AST.InputValueDefinition
        { description
        , name
        , type: tipe
        }
    ) =
    inlineComment description
      <> safeFieldname name
      <> " :: "
      <> case lookup objectName fieldTypeOverrides >>= lookup name of
        Nothing -> argTypeToPurs objectName tipe
        Just out -> case tipe of
          AST.Type_NonNullType (AST.NonNullType_NamedType namedType) | getNullable objectName namedType == Just true -> out.moduleName <> "." <> out.typeName
          AST.Type_NonNullType _ -> wrapNotNull $ out.moduleName <> "." <> out.typeName
          AST.Type_ListType _ -> wrapArray $ out.moduleName <> "." <> out.typeName
          AST.Type_NamedType namedType | getNullable objectName namedType == Just false -> wrapNotNull $ out.moduleName <> "." <> out.typeName
          _ -> out.moduleName <> "." <> out.typeName

  directiveDefinitionToPurs :: AST.DirectiveDefinition -> Maybe String
  directiveDefinitionToPurs _ = Nothing

  argTypeToPurs :: String -> AST.Type -> String
  argTypeToPurs objectName = case _ of
    (AST.Type_NamedType namedType) | getNullable objectName namedType == Just false ->
      wrapNotNull $ namedTypeToPurs_ namedType
    (AST.Type_NamedType namedType) -> namedTypeToPurs_ namedType
    (AST.Type_ListType listType) -> argListTypeToPurs objectName listType
    (AST.Type_NonNullType notNullType@(AST.NonNullType_NamedType namedType)) | getNullable objectName namedType == Just true ->
      argNotNullTypeToPurs objectName notNullType
    (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs objectName notNullType

  argNotNullTypeToPurs :: String -> AST.NonNullType -> String
  argNotNullTypeToPurs objectName = case _ of
    AST.NonNullType_NamedType t -> namedTypeToPurs_ t
    AST.NonNullType_ListType t -> argListTypeToPurs objectName t

  argListTypeToPurs :: String -> AST.ListType -> String
  argListTypeToPurs objectName (AST.ListType t) = "(Array " <> argTypeToPurs objectName t <> ")"

  wrapNotNull s = if startsWith "(NotNull " (String.trim s) then s else "(NotNull " <> s <> ")"

  startsWith pre str = pre == take (String.length pre) str

  getNullable :: String -> AST.NamedType -> Maybe Boolean
  getNullable objectName namedType = lookup objectName nullableOverrides >>= lookup (unwrap namedType)

  typeToPurs :: AST.Type -> String
  typeToPurs = case _ of
    (AST.Type_NamedType namedType) -> namedTypeToPursNullable namedType
    (AST.Type_ListType listType) -> listTypeToPursNullable listType
    (AST.Type_NonNullType notNullType) -> notNullTypeToPurs notNullType

  namedTypeToPursNullable :: AST.NamedType -> String
  namedTypeToPursNullable = wrapMaybe <<< namedTypeToPurs_

  listTypeToPursNullable :: AST.ListType -> String
  listTypeToPursNullable t = wrapMaybe $ listTypeToPurs t

  wrapMaybe s = "(Maybe " <> s <> ")"

  notNullTypeToPurs :: AST.NonNullType -> String
  notNullTypeToPurs = case _ of
    AST.NonNullType_NamedType t -> namedTypeToPurs_ t
    AST.NonNullType_ListType t -> listTypeToPurs t

  listTypeToPurs :: AST.ListType -> String
  listTypeToPurs (AST.ListType t) = wrapArray $ typeToPurs t

  wrapArray s = "(Array " <> s <> ")"

  typeName_ = typeName gqlScalarsToPursTypes

  namedTypeToPurs_ = namedTypeToPurs gqlScalarsToPursTypes

gqlToPursEnums :: Map String String -> AST.Document -> Array GqlEnum
gqlToPursEnums gqlScalarsToPursTypes = unwrap >>> mapMaybe definitionToEnum >>> Array.fromFoldable
  where
  definitionToEnum :: AST.Definition -> Maybe GqlEnum
  definitionToEnum = case _ of
    AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
    _ -> Nothing

  typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> Maybe GqlEnum
  typeSystemDefinitionToPurs = case _ of
    AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
    _ -> Nothing

  typeDefinitionToPurs :: AST.TypeDefinition -> Maybe GqlEnum
  typeDefinitionToPurs = case _ of
    AST.TypeDefinition_EnumTypeDefinition (AST.EnumTypeDefinition enumTypeDefinition) ->
      Just
        { name: typeName_ enumTypeDefinition.name
        , description: enumTypeDefinition.description
        , values: maybe [] enumValuesDefinitionToPurs enumTypeDefinition.enumValuesDefinition
        }
    _ -> Nothing

  enumValuesDefinitionToPurs :: AST.EnumValuesDefinition -> Array String
  enumValuesDefinitionToPurs def =
    Array.fromFoldable $ unwrap def
      <#> \(AST.EnumValueDefinition { enumValue }) ->
        unwrap enumValue

  typeName_ = typeName gqlScalarsToPursTypes

namedTypeToPurs :: Map String String -> AST.NamedType -> String
namedTypeToPurs gqlScalarsToPursTypes (AST.NamedType str) = typeName gqlScalarsToPursTypes str

inlineComment :: Maybe String -> String
inlineComment = foldMap (\str -> "\n{- " <> str <> " -}\n")

typeName :: Map String String -> String -> String
typeName gqlScalarsToPursTypes str =
  lookup str gqlScalarsToPursTypes
    # fromMaybe' \_ -> case str of
        "_text" -> "GraphQL.Hasura.Array.Hasura_text"
        _ -> case pascalCase str of
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

safeFieldname :: String -> String
safeFieldname s = if isSafe then s else show s
  where
  isSafe =
    charAt 0 s
      # maybe false \c ->
          c == '_' || (isLower $ codePointFromChar c)
