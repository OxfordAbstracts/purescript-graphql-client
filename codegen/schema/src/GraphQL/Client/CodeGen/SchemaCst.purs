-- | Codegen functions to get purs schema code from graphQL schemas
module GraphQL.Client.CodeGen.SchemaCst
  ( gqlToPursSchema
  ) where

import Prelude

import Control.Alt ((<|>))
import Control.Monad.Writer (tell)
import Data.Array (elem, notElem)
import Data.Array as Array
import Data.CodePoint.Unicode (isLower)
import Data.Filterable (class Filterable, filter)
import Data.GraphQL.AST (NamedType)
import Data.GraphQL.AST as AST
import Data.List (List(..), any, mapMaybe, sort, (:))
import Data.List as List
import Data.Map (Map, lookup)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe', maybe)
import Data.Newtype (unwrap, wrap)
import Data.String (codePointFromChar, toLower)
import Data.String as String
import Data.String.CodeUnits (charAt)
import Data.String.Extra (pascalCase)
import Data.Traversable (class Foldable, class Traversable, for, traverse)
import Data.Tuple (Tuple(..))
import Data.Tuple.Nested ((/\))
import Data.Unfoldable (none)
import GraphQL.Client.CodeGen.Types (InputOptions, GqlEnum)
import GraphQL.Client.CodeGen.UtilCst (qualifiedTypeToName)
import Partial.Unsafe (unsafePartial)
import PureScript.CST.Types (Module, Proper, QualifiedName)
import PureScript.CST.Types as CST
import Tidy.Codegen (declDerive, declNewtype, declType, docComments, leading, lineComments, typeApp, typeArrow, typeCtor, typeRecord, typeRecordEmpty, typeRow, typeString, typeWildcard)
import Tidy.Codegen.Class (class OverLeadingComments, toQualifiedName)
import Tidy.Codegen.Monad (CodegenT, codegenModule, importFrom, importType)

gqlToPursSchema :: InputOptions -> String -> String -> AST.Document -> Array GqlEnum -> Module Void
gqlToPursSchema
  { gqlToPursTypes, idImport, fieldTypeOverrides, argTypeOverrides, useNewtypesForRecords }
  directivesMName
  mName
  (AST.Document defs)
  enums = do
  unsafePartial $ codegenModule mName do
    directives <- importFrom directivesMName (importType "Directives")
    voidT <- importQualified "Data.Void" "Void"
    proxyT <- importQualified "Type.Proxy" "Proxy"
    maybe_ <- importQualified "Data.Maybe" "Maybe"
    newType <- importQualified "Data.Newtype" "Newtype"
    argsM <- importFrom "GraphQL.Client.Args"
      { notNull: importType "NotNull"
      }
    gqlUnion <- importQualified "GraphQL.Client.Union" "GqlUnion"
    asGql <- importFrom "GraphQL.Client.AsGql" (importType "AsGql")
    id <- case idImport of
      Nothing -> importQualified "GraphQL.Client.ID" "ID"
      Just idImport_ -> importFrom idImport_.moduleName (importType $ "GraphQL.Client.ID." <> idImport_.typeName)

    let
      enumsMap = Map.fromFoldable $ enums <#> \e ->
        let
          name = pascalCase e.name
        in
          Tuple name { moduleName: mName <> ".Enum." <> name, typeName: name }

    enumsM :: Map String _ <- genImportsUnqualified enumsMap

    gqlToPursTypesMs <- genImports gqlToPursTypes

    fieldTypeOverridesMs <- for fieldTypeOverrides genImports

    argTypeOverridesMs <- for argTypeOverrides (traverse genImports)
    dateTime <- importFrom "Data.DateTime" $ importType "DateTime"
    json <- importQualified "Data.Argonaut.Core" "Json"

    let
      imports :: Imports
      imports =
        { json
        , unknownJson
        , id
        , dateTime
        }

      defaultTypes = getDefaultTypeNames imports

      unknownJson tName = leading (lineComments $ "Unknown scalar type. Add " <> tName <> " to gqlToPursTypes in codegen options to override this behaviour") json

      definitionToPurs :: AST.Definition -> List Decl
      definitionToPurs = case _ of
        AST.Definition_ExecutableDefinition _ -> mempty
        AST.Definition_TypeSystemDefinition def -> typeSystemDefinitionToPurs def
        AST.Definition_TypeSystemExtension _ -> mempty

      typeSystemDefinitionToPurs :: AST.TypeSystemDefinition -> List Decl
      typeSystemDefinitionToPurs = case _ of
        AST.TypeSystemDefinition_SchemaDefinition schemaDefinition -> schemaDefinitionToPurs schemaDefinition
        AST.TypeSystemDefinition_TypeDefinition typeDefinition -> typeDefinitionToPurs typeDefinition
        AST.TypeSystemDefinition_DirectiveDefinition _directiveDefinition -> mempty

      schemaDefinitionToPurs :: AST.SchemaDefinition -> List Decl
      schemaDefinitionToPurs (AST.SchemaDefinition { rootOperationTypeDefinition }) = mapMaybe rootOperationTypeDefinitionToPurs rootOperationTypeDefinition

      typeDefinitionToPurs :: AST.TypeDefinition -> List Decl
      typeDefinitionToPurs = case _ of
        AST.TypeDefinition_ScalarTypeDefinition scalarTypeDefinition -> List.fromFoldable $ scalarTypeDefinitionToPurs scalarTypeDefinition
        AST.TypeDefinition_ObjectTypeDefinition objectTypeDefinition -> objectTypeDefinitionToPurs objectTypeDefinition
        AST.TypeDefinition_InterfaceTypeDefinition _interfaceTypeDefinition -> mempty
        AST.TypeDefinition_UnionTypeDefinition unionTypeDefinition -> List.fromFoldable $ unionTypeDefinitionToPurs unionTypeDefinition
        AST.TypeDefinition_EnumTypeDefinition _enumTypeDefinition -> mempty
        AST.TypeDefinition_InputObjectTypeDefinition inputObjectTypeDefinition ->
          (inputObjectTypeDefinitionToPurs (_.name $ unwrap inputObjectTypeDefinition)) inputObjectTypeDefinition

      rootOperationTypeDefinitionToPurs :: AST.RootOperationTypeDefinition -> Maybe Decl
      rootOperationTypeDefinitionToPurs (AST.RootOperationTypeDefinition { operationType, namedType }) =
        if opStr /= actualType then
          pure $ declType opStr [] (typeCtor actualType)
        else
          none
        where
        actualType = pascalCase $ unwrap namedType

        opStr = case operationType of
          AST.Query -> "Query"
          AST.Mutation -> "Mutation"
          AST.Subscription -> "Subscription"

      scalarTypeDefinitionToPurs :: AST.ScalarTypeDefinition -> Maybe Decl
      scalarTypeDefinitionToPurs (AST.ScalarTypeDefinition { description, name }) =
        declType tName [] <$> descriptionAndNameToPurs description name
        where
        tName = pascalCase name

      builtin = [ "String", "Boolean", "Int", "Float" ]

      descriptionAndNameToPurs :: Maybe String -> String -> Maybe (CST.Type Void)
      descriptionAndNameToPurs description name =
        comment description <<< typeCtor <$> scalarType
        where
        tName = pascalCase name

        scalarType =
          case lookup tName gqlToPursTypesMs of
            Just t -> Just t
            _ ->
              if elem tName builtin then
                Nothing
              else case lookup tName enumsM of
                Just t -> Just t
                _ -> case Map.lookup (toLower name) defaultTypes of
                  Just t -> Just t
                  _ -> Just $ unknownJson name

      objectTypeDefinitionToPurs :: AST.ObjectTypeDefinition -> List Decl
      objectTypeDefinitionToPurs
        ( AST.ObjectTypeDefinition
            { description
            , fieldsDefinition
            , name
            }
        ) =

        let
          tName = pascalCase name
          record = maybe typeRecordEmpty (fieldsDefinitionToPurs name) fieldsDefinition
        in

          if useNewtypesForRecords then
            comment description (declNewtype tName [] tName record)
              : declDerive Nothing [] newType [ typeCtor tName, typeWildcard ]
              : Nil

          else
            comment description (declType tName [] record)
              : Nil

      fieldsDefinitionToPurs :: String -> AST.FieldsDefinition -> CST.Type Void
      fieldsDefinitionToPurs objectName (AST.FieldsDefinition fieldsDefinition) =
        typeRecord (map (fieldDefinitionToPurs objectName) $ Array.fromFoldable $ sort fieldsDefinition) Nothing

      fieldDefinitionToPurs :: String -> AST.FieldDefinition -> Tuple String (CST.Type Void)
      fieldDefinitionToPurs
        objectName
        ( AST.FieldDefinition
            { description
            , name
            , argumentsDefinition
            , type: tipe
            }
        ) = Tuple (safeFieldname name) case argumentsDefinition of
        Nothing -> pursType
        Just def ->
          [ argumentsDefinitionToPurs objectName name def
          ] `typeArrow` pursType
        where
        pursType :: CST.Type Void
        pursType = comment description case lookupOverride objectName name of
          Nothing -> typeToPurs tipe
          Just out -> case tipe of
            AST.Type_NonNullType nn -> annotateGqlType (getNonNullTypeName nn) $ typeCtor out
            AST.Type_ListType (AST.ListType l) -> wrapArray $ annotateGqlType (getTypeName l) $ typeCtor out
            AST.Type_NamedType n -> wrapMaybe $ annotateGqlType n $ typeCtor out

      lookupOverride objectName fieldName =
        ( lookup objectName fieldTypeOverridesMs
        )
          >>= lookup fieldName

      argumentsDefinitionToPurs :: String -> String -> AST.ArgumentsDefinition -> (CST.Type Void)
      argumentsDefinitionToPurs objectName fieldName (AST.ArgumentsDefinition inputValueDefinitions) =
        typeRecord (map (inputValueDefinitionToPurs objectName fieldName) $ Array.fromFoldable $ sort inputValueDefinitions) Nothing

      inputValueDefinitionToPurs :: String -> String -> AST.InputValueDefinition -> Tuple String (CST.Type Void)
      inputValueDefinitionToPurs
        objectName
        fieldName
        ( AST.InputValueDefinition
            { description
            , name
            , type: tipe
            }
        ) = Tuple (safeFieldname name) $ comment description
        case lookupOverride objectName name of
          Nothing -> argTypeToPurs objectName fieldName name tipe
          Just out -> case tipe of
            AST.Type_NonNullType nn -> wrapNotNull $ annotateGqlType (getNonNullTypeName nn) $ typeCtor out
            AST.Type_ListType (AST.ListType l) -> wrapArray $ annotateGqlType (getTypeName l) $ typeCtor out
            AST.Type_NamedType n -> annotateGqlType n $ typeCtor out

      unionTypeDefinitionToPurs :: AST.UnionTypeDefinition -> Maybe Decl
      unionTypeDefinitionToPurs
        ( AST.UnionTypeDefinition
            { description
            , name
            , directives: Nothing
            , unionMemberTypes: Just (AST.UnionMemberTypes unionMemberTypes)
            }
        ) = Just $ comment description $ declType name [] $ typeApp (typeCtor gqlUnion)
        [ typeRow (map (unionMemberTypeToPurs <<< unwrap) $ Array.fromFoldable unionMemberTypes) Nothing
        ]

      unionTypeDefinitionToPurs _ = Nothing

      unionMemberTypeToPurs :: String -> Tuple String (CST.Type Void)
      unionMemberTypeToPurs ty = Tuple ty $ typeCtor ty

      -- TODO make fieldName Maybe
      inputObjectTypeDefinitionToPurs :: String -> AST.InputObjectTypeDefinition -> List Decl
      inputObjectTypeDefinitionToPurs
        fieldName
        ( AST.InputObjectTypeDefinition
            { description
            , inputFieldsDefinition
            , name
            }
        ) =
        let
          tName = pascalCase name
          record = maybe typeRecordEmpty
            ( unwrap >>>
                (inputValueToFieldsDefinitionToPurs name fieldName)
            )
            inputFieldsDefinition
        in
          (comment description $ declNewtype tName [] tName record)
            : declDerive Nothing [] newType [ typeCtor tName, typeWildcard ]
            : Nil

      inputValueToFieldsDefinitionToPurs :: String -> String -> List AST.InputValueDefinition -> CST.Type Void
      inputValueToFieldsDefinitionToPurs objectName fieldName definitions =
        typeRecord (map (inputValueDefinitionToPurs objectName fieldName) $ Array.fromFoldable $ sort definitions) Nothing

      getPursTypeName :: NamedType -> QualifiedName Proper
      getPursTypeName = namedTypeToPurs gqlToPursTypesMs defaultTypes

      pursTypeCtr :: NamedType -> CST.Type Void
      pursTypeCtr gqlT =
        annotateGqlType gqlT $ typeCtor $ getPursTypeName gqlT

      annotateGqlType :: NamedType -> CST.Type Void -> CST.Type Void
      annotateGqlType gqlT pursT =
        typeApp (typeCtor asGql) [ typeString $ unwrap gqlT, pursT ]

      typeToPurs :: AST.Type -> CST.Type Void
      typeToPurs = case _ of
        (AST.Type_NamedType namedType) -> annotateGqlType namedType $ namedTypeToPursNullable namedType
        (AST.Type_ListType listType) -> listTypeToPursNullable listType
        (AST.Type_NonNullType notNullType) -> notNullTypeToPurs notNullType

      namedTypeToPursNullable :: AST.NamedType -> CST.Type Void
      namedTypeToPursNullable t = wrapMaybe $ annotateGqlType t $ typeCtor $ getPursTypeName t

      listTypeToPursNullable :: AST.ListType -> CST.Type Void
      listTypeToPursNullable t = wrapMaybe $ listTypeToPurs t

      wrapMaybe :: CST.Type Void -> CST.Type Void
      wrapMaybe s = typeApp (typeCtor maybe_) [ s ]

      wrapArray :: CST.Type Void -> CST.Type Void
      wrapArray s = typeApp (typeCtor "Array") [ s ]

      notNullTypeToPurs :: AST.NonNullType -> CST.Type Void
      notNullTypeToPurs = case _ of
        AST.NonNullType_NamedType t -> pursTypeCtr t
        AST.NonNullType_ListType t -> listTypeToPurs t

      listTypeToPurs :: AST.ListType -> CST.Type Void
      listTypeToPurs (AST.ListType t) = wrapArray $ typeToPurs t

      argTypeToPurs :: String -> String -> String -> AST.Type -> CST.Type Void
      argTypeToPurs objectName fieldName argName tipe = case tipe of
        (AST.Type_NamedType namedType) -> case lookup objectName argTypeOverridesMs >>= lookup fieldName >>= lookup argName of
          Nothing -> pursTypeCtr namedType
          Just out -> annotateGqlType namedType $ typeCtor out
        (AST.Type_ListType listType) -> argListTypeToPurs objectName fieldName argName listType
        (AST.Type_NonNullType notNullType) -> wrapNotNull $ argNotNullTypeToPurs objectName fieldName argName notNullType

      argNotNullTypeToPurs :: String -> String -> String -> AST.NonNullType -> CST.Type Void
      argNotNullTypeToPurs objectName fieldName argName = case _ of
        AST.NonNullType_NamedType t -> case lookup objectName argTypeOverridesMs >>= lookup fieldName >>= lookup argName of
          Nothing -> pursTypeCtr t
          Just out -> annotateGqlType t $ typeCtor out
        AST.NonNullType_ListType t -> argListTypeToPurs objectName fieldName argName t

      argListTypeToPurs :: String -> String -> String -> AST.ListType -> CST.Type Void
      argListTypeToPurs objectName fieldName argName (AST.ListType t) =
        wrapArray $ argTypeToPurs objectName fieldName argName t

      wrapNotNull s = typeApp (typeCtor argsM.notNull) [ s ]

      declarations =
        defs
          # sort
          >>= definitionToPurs
          # Array.fromFoldable

      hasMutation = hasRootOp defs AST.Mutation
      hasSubscription = hasRootOp defs AST.Subscription

      schema = declType "Schema" [] $ typeRecord
        [ Tuple "directives" $ typeApp (typeCtor proxyT) [ typeCtor directives ]
        , Tuple "query" $ typeCtor "Query"
        , Tuple "mutation" $ if hasMutation then typeCtor "Mutation" else typeCtor voidT
        , Tuple "subscription" $ if hasSubscription then typeCtor "Subscription" else typeCtor voidT
        ]
        Nothing
    tell
      $ [ schema ] <> declarations

hasRootOp :: forall f. Foldable f => f AST.Definition -> AST.OperationType -> Boolean
hasRootOp defs op = defs # any case _ of
  AST.Definition_TypeSystemDefinition (AST.TypeSystemDefinition_SchemaDefinition (AST.SchemaDefinition d)) ->
    d.rootOperationTypeDefinition # any (unwrap >>> _.operationType >>> eq op)
  _ -> false

genImports
  :: forall f e m r
   . Filterable f
  => Traversable f
  => Monad m
  => Partial
  => f
       { moduleName :: String
       , typeName :: String
       | r
       }
  -> CodegenT e m (f (QualifiedName Proper))
genImports = filter (_.moduleName >>> not String.null) >>> traverse (genImport)

genImportsUnqualified
  :: forall f e m r
   . Filterable f
  => Traversable f
  => Monad m
  => Partial
  => f
       { moduleName :: String
       , typeName :: String
       | r
       }
  -> CodegenT e m (f (QualifiedName Proper))
genImportsUnqualified = filter (_.moduleName >>> not String.null) >>> traverse (genImportUnqualified)

importQualified ∷ ∀ (e38 ∷ Type) (m39 ∷ Type -> Type). Monad m39 ⇒ String → String → CodegenT e38 m39 (QualifiedName Proper)
importQualified moduleName typeName' =
  unsafePartial $ importFrom moduleName (importType $ moduleName <> "." <> typeName')

genImport
  :: forall e m r
   . Monad m
  => { moduleName :: String
     , typeName :: String
     | r
     }
  -> CodegenT e m (QualifiedName Proper)
genImport t = unsafePartial $ importFrom t.moduleName (importType $ t.moduleName <> "." <> t.typeName)

genImportUnqualified
  :: forall e m r
   . Monad m
  => { moduleName :: String
     , typeName :: String
     | r
     }
  -> CodegenT e m (QualifiedName Proper)
genImportUnqualified t = unsafePartial $ importFrom t.moduleName (importType t.typeName)

comment :: ∀ a. OverLeadingComments a ⇒ Maybe String → a → a
comment = maybe identity (leading <<< docComments)

type Decl = CST.Declaration Void

namedTypeToPurs :: Map String (QualifiedName Proper) -> Map String (QualifiedName Proper) -> AST.NamedType -> QualifiedName Proper
namedTypeToPurs gqlToPursTypes defaultTypes (AST.NamedType str) = typeName gqlToPursTypes defaultTypes str

type Imports =
  { id :: QualifiedName Proper
  , json :: QualifiedName Proper
  , unknownJson :: String -> QualifiedName Proper
  , dateTime :: QualifiedName Proper
  }

typeName :: Map String (QualifiedName Proper) -> Map String (QualifiedName Proper) -> String -> QualifiedName Proper
typeName gqlToPursTypes defaultTypes str =
  case lookup str gqlToPursTypes of
    Just t -> t
    _ -> case lookup (toLower str) defaultTypes of
      Just t -> t
      _ -> qualify (pascalCase str)

qualify :: String -> QualifiedName Proper
qualify = toQualifiedName <<< (wrap :: _ -> Proper)

getDefaultTypeNames :: Imports -> Map String (QualifiedName Proper)
getDefaultTypeNames { id, json, dateTime } = Map.fromFoldable
  [ "id" /\ id
  , "json" /\ json
  , "jsonb" /\ json
  , "timestamp" /\ dateTime
  , "timestampz" /\ dateTime
  , "float" /\ qualify "Number"
  , "numeric" /\ qualify "Number"
  , "bigint" /\ qualify "Number"
  , "number" /\ qualify "Number"
  , "smallint" /\ qualify "Int"
  , "integer" /\ qualify "Int"
  , "int" /\ qualify "Int"
  , "int2" /\ qualify "Int"
  , "int4" /\ qualify "Int"
  , "int8" /\ qualify "Int"
  , "text" /\ qualify "String"
  , "citext" /\ qualify "String"
  , "string" /\ qualify "String"
  , "boolean" /\ qualify "Boolean"
  , "bool" /\ qualify "Boolean"
  ]

safeFieldname :: String -> String
safeFieldname s = if isSafe then s else show s
  where
  isSafe =
    charAt 0 s
      # maybe false \c ->
          c == '_' || (isLower $ codePointFromChar c)

getTypeName :: AST.Type -> AST.NamedType
getTypeName = case _ of
  AST.Type_NamedType n -> n
  AST.Type_ListType (AST.ListType l) -> getTypeName l
  AST.Type_NonNullType nn -> getNonNullTypeName nn

getNonNullTypeName :: AST.NonNullType -> AST.NamedType
getNonNullTypeName = case _ of
  AST.NonNullType_NamedType n -> n
  AST.NonNullType_ListType (AST.ListType l) -> getTypeName l