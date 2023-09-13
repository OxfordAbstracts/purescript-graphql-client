module Data.GraphQL.AST where

import Prim hiding (Type)
import Prelude
import Data.Generic.Rep (class Generic)
import Data.Show.Generic (genericShow)
import Data.List (List)
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple(..))

derive instance documentGeneric ∷ Generic Document _

instance documentShow ∷ Show Document where
  show v = genericShow v

derive instance documentEq ∷ Eq Document
derive instance documentOrd :: Ord Document

_Document
  ∷ Tuple
      ( (List Definition) → Document
      )
      ( Document
        → Maybe (List Definition)
      )
_Document =
  Tuple Document
    ( case _ of
        Document a → Just a
    )

derive instance documentNewtype ∷ Newtype Document _

newtype Document = Document (List Definition)

derive instance definitionGeneric ∷ Generic Definition _

instance definitionShow ∷ Show Definition where
  show v = genericShow v

derive instance definitionEq ∷ Eq Definition
derive instance definitionOrd :: Ord Definition

_Definition_ExecutableDefinition
  ∷ Tuple
      ( ExecutableDefinition → Definition
      )
      ( Definition
        → Maybe ExecutableDefinition
      )
_Definition_ExecutableDefinition =
  Tuple Definition_ExecutableDefinition
    ( case _ of
        Definition_ExecutableDefinition a → Just a
        _ → Nothing
    )

_Definition_TypeSystemDefinition
  ∷ Tuple
      ( TypeSystemDefinition → Definition
      )
      ( Definition
        → Maybe TypeSystemDefinition
      )
_Definition_TypeSystemDefinition =
  Tuple Definition_TypeSystemDefinition
    ( case _ of
        Definition_TypeSystemDefinition a → Just a
        _ → Nothing
    )

_Definition_TypeSystemExtension
  ∷ Tuple
      ( TypeSystemExtension → Definition
      )
      ( Definition
        → Maybe TypeSystemExtension
      )
_Definition_TypeSystemExtension =
  Tuple Definition_TypeSystemExtension
    ( case _ of
        Definition_TypeSystemExtension a → Just a
        _ → Nothing
    )

data Definition
  = Definition_ExecutableDefinition ExecutableDefinition
  | Definition_TypeSystemDefinition TypeSystemDefinition
  | Definition_TypeSystemExtension TypeSystemExtension

derive instance executableDefinitionGeneric ∷ Generic ExecutableDefinition _

instance executableDefinitionShow ∷ Show ExecutableDefinition where
  show v = genericShow v

derive instance executableDefinitionEq ∷ Eq ExecutableDefinition
derive instance executableDefinitionOrd :: Ord ExecutableDefinition

_ExecutableDefinition_OperationDefinition
  ∷ Tuple
      ( OperationDefinition → ExecutableDefinition
      )
      ( ExecutableDefinition
        → Maybe OperationDefinition
      )
_ExecutableDefinition_OperationDefinition =
  Tuple ExecutableDefinition_OperationDefinition
    ( case _ of
        ExecutableDefinition_OperationDefinition a → Just a
        _ → Nothing
    )

_ExecutableDefinition_FragmentDefinition
  ∷ Tuple
      ( FragmentDefinition → ExecutableDefinition
      )
      ( ExecutableDefinition
        → Maybe FragmentDefinition
      )
_ExecutableDefinition_FragmentDefinition =
  Tuple ExecutableDefinition_FragmentDefinition
    ( case _ of
        ExecutableDefinition_FragmentDefinition a → Just a
        _ → Nothing
    )

data ExecutableDefinition
  = ExecutableDefinition_OperationDefinition OperationDefinition
  | ExecutableDefinition_FragmentDefinition FragmentDefinition

derive instance operationDefinitionGeneric ∷ Generic OperationDefinition _

instance operationDefinitionShow ∷ Show OperationDefinition where
  show v = genericShow v

derive instance operationDefinitionEq ∷ Eq OperationDefinition
derive instance operationDefinitionOrd :: Ord OperationDefinition

_OperationDefinition_SelectionSet
  ∷ Tuple
      ( SelectionSet → OperationDefinition
      )
      ( OperationDefinition
        → Maybe SelectionSet
      )
_OperationDefinition_SelectionSet =
  Tuple OperationDefinition_SelectionSet
    ( case _ of
        OperationDefinition_SelectionSet a → Just a
        _ → Nothing
    )

type T_OperationDefinition_OperationType = { operationType ∷ OperationType, name ∷ (Maybe String), variableDefinitions ∷ (Maybe VariableDefinitions), directives ∷ (Maybe Directives), selectionSet ∷ SelectionSet }

_OperationDefinition_OperationType
  ∷ Tuple
      ( T_OperationDefinition_OperationType → OperationDefinition
      )
      ( OperationDefinition
        → Maybe T_OperationDefinition_OperationType
      )
_OperationDefinition_OperationType =
  Tuple OperationDefinition_OperationType
    ( case _ of
        OperationDefinition_OperationType a → Just a
        _ → Nothing
    )

data OperationDefinition
  = OperationDefinition_SelectionSet SelectionSet
  | OperationDefinition_OperationType T_OperationDefinition_OperationType

derive instance operationTypeGeneric ∷ Generic OperationType _

instance operationTypeShow ∷ Show OperationType where
  show v = genericShow v

derive instance operationTypeEq ∷ Eq OperationType
derive instance operationTypeOrd :: Ord OperationType

_Query
  ∷ Tuple
      ( Unit → OperationType
      )
      ( OperationType
        → Maybe Unit
      )
_Query =
  Tuple (\_ → Query)
    ( case _ of
        Query → Just unit
        _ → Nothing
    )

_Mutation
  ∷ Tuple
      ( Unit → OperationType
      )
      ( OperationType
        → Maybe Unit
      )
_Mutation =
  Tuple (\_ → Mutation)
    ( case _ of
        Mutation → Just unit
        _ → Nothing
    )

_Subscription
  ∷ Tuple
      ( Unit → OperationType
      )
      ( OperationType
        → Maybe Unit
      )
_Subscription =
  Tuple (\_ → Subscription)
    ( case _ of
        Subscription → Just unit
        _ → Nothing
    )

data OperationType
  = Query
  | Mutation
  | Subscription

derive instance selectionSetGeneric ∷ Generic SelectionSet _

instance selectionSetShow ∷ Show SelectionSet where
  show v = genericShow v

derive instance selectionSetEq ∷ Eq SelectionSet
derive instance selectionSetOrd :: Ord SelectionSet

_SelectionSet
  ∷ Tuple
      ( (List Selection) → SelectionSet
      )
      ( SelectionSet
        → Maybe (List Selection)
      )
_SelectionSet =
  Tuple SelectionSet
    ( case _ of
        SelectionSet a → Just a
    )

derive instance selectionSetNewtype ∷ Newtype SelectionSet _

newtype SelectionSet = SelectionSet (List Selection)

derive instance selectionGeneric ∷ Generic Selection _

instance selectionShow ∷ Show Selection where
  show v = genericShow v

derive instance selectionEq ∷ Eq Selection
derive instance selectionOrd :: Ord Selection

_Selection_Field
  ∷ Tuple
      ( Field → Selection
      )
      ( Selection
        → Maybe Field
      )
_Selection_Field =
  Tuple Selection_Field
    ( case _ of
        Selection_Field a → Just a
        _ → Nothing
    )

_Selection_FragmentSpread
  ∷ Tuple
      ( FragmentSpread → Selection
      )
      ( Selection
        → Maybe FragmentSpread
      )
_Selection_FragmentSpread =
  Tuple Selection_FragmentSpread
    ( case _ of
        Selection_FragmentSpread a → Just a
        _ → Nothing
    )

_Selection_InlineFragment
  ∷ Tuple
      ( InlineFragment → Selection
      )
      ( Selection
        → Maybe InlineFragment
      )
_Selection_InlineFragment =
  Tuple Selection_InlineFragment
    ( case _ of
        Selection_InlineFragment a → Just a
        _ → Nothing
    )

data Selection
  = Selection_Field Field
  | Selection_FragmentSpread FragmentSpread
  | Selection_InlineFragment InlineFragment

derive instance fieldGeneric ∷ Generic Field _

instance fieldShow ∷ Show Field where
  show v = genericShow v

derive instance fieldEq ∷ Eq Field
derive instance fieldOrd :: Ord Field

type T_Field = { alias ∷ (Maybe String), name ∷ String, arguments ∷ (Maybe Arguments), directives ∷ (Maybe Directives), selectionSet ∷ (Maybe SelectionSet) }

_Field
  ∷ Tuple
      ( T_Field → Field
      )
      ( Field
        → Maybe T_Field
      )
_Field =
  Tuple Field
    ( case _ of
        Field a → Just a
    )

derive instance fieldNewtype ∷ Newtype Field _

newtype Field = Field T_Field

derive instance argumentsGeneric ∷ Generic Arguments _

instance argumentsShow ∷ Show Arguments where
  show v = genericShow v

derive instance argumentsEq ∷ Eq Arguments
derive instance argumentsOrd :: Ord Arguments

_Arguments
  ∷ Tuple
      ( (List Argument) → Arguments
      )
      ( Arguments
        → Maybe (List Argument)
      )
_Arguments =
  Tuple Arguments
    ( case _ of
        Arguments a → Just a
    )

derive instance argumentsNewtype ∷ Newtype Arguments _

newtype Arguments = Arguments (List Argument)

derive instance argumentGeneric ∷ Generic Argument _

instance argumentShow ∷ Show Argument where
  show v = genericShow v

derive instance argumentEq ∷ Eq Argument
derive instance argumentOrd :: Ord Argument

type T_Argument = { name :: String, value :: Value }

_Argument
  ∷ Tuple
      ( T_Argument → Argument
      )
      ( Argument
        → Maybe T_Argument
      )
_Argument =
  Tuple Argument
    ( case _ of
        Argument a → Just a
    )

derive instance argumentNewtype ∷ Newtype Argument _

newtype Argument = Argument T_Argument

derive instance fragmentSpreadGeneric ∷ Generic FragmentSpread _

instance fragmentSpreadShow ∷ Show FragmentSpread where
  show v = genericShow v

derive instance fragmentSpreadEq ∷ Eq FragmentSpread
derive instance fragmentSpreadOrd :: Ord FragmentSpread

type T_FragmentSpread = { fragmentName ∷ String, directives ∷ Maybe Directives }

_FragmentSpread
  ∷ Tuple
      ( T_FragmentSpread → FragmentSpread
      )
      ( FragmentSpread
        → Maybe T_FragmentSpread
      )
_FragmentSpread =
  Tuple FragmentSpread
    ( case _ of
        FragmentSpread a → Just a
    )

derive instance fragmentSpreadNewtype ∷ Newtype FragmentSpread _

newtype FragmentSpread = FragmentSpread T_FragmentSpread

derive instance inlineFragmentGeneric ∷ Generic InlineFragment _

instance inlineFragmentShow ∷ Show InlineFragment where
  show v = genericShow v

derive instance inlineFragmentEq ∷ Eq InlineFragment
derive instance inlineFragmentOrd :: Ord InlineFragment

type T_InlineFragment = { typeCondition ∷ (Maybe TypeCondition), directives ∷ (Maybe Directives), selectionSet ∷ SelectionSet }

_InlineFragment
  ∷ Tuple
      ( T_InlineFragment → InlineFragment
      )
      ( InlineFragment
        → Maybe T_InlineFragment
      )
_InlineFragment =
  Tuple InlineFragment
    ( case _ of
        InlineFragment a → Just a
    )

derive instance inlineFragmentNewtype ∷ Newtype InlineFragment _

newtype InlineFragment = InlineFragment T_InlineFragment

derive instance fragmentDefinitionGeneric ∷ Generic FragmentDefinition _

instance fragmentDefinitionShow ∷ Show FragmentDefinition where
  show v = genericShow v

derive instance fragmentDefinitionEq ∷ Eq FragmentDefinition
derive instance fragmentDefinitionOrd :: Ord FragmentDefinition

type T_FragmentDefinition = { fragmentName ∷ String, typeCondition ∷ TypeCondition, directives ∷ (Maybe Directives), selectionSet ∷ SelectionSet }

_FragmentDefinition
  ∷ Tuple
      ( T_FragmentDefinition → FragmentDefinition
      )
      ( FragmentDefinition
        → Maybe T_FragmentDefinition
      )
_FragmentDefinition =
  Tuple FragmentDefinition
    ( case _ of
        FragmentDefinition a → Just a
    )

derive instance fragmentDefinitionNewtype ∷ Newtype FragmentDefinition _

newtype FragmentDefinition = FragmentDefinition T_FragmentDefinition

derive instance typeConditionGeneric ∷ Generic TypeCondition _

instance typeConditionShow ∷ Show TypeCondition where
  show v = genericShow v

derive instance typeConditionEq ∷ Eq TypeCondition
derive instance typeConditionOrd :: Ord TypeCondition

_TypeCondition
  ∷ Tuple
      ( NamedType → TypeCondition
      )
      ( TypeCondition
        → Maybe NamedType
      )
_TypeCondition =
  Tuple TypeCondition
    ( case _ of
        TypeCondition a → Just a
    )

derive instance typeConditionNewtype ∷ Newtype TypeCondition _

newtype TypeCondition = TypeCondition NamedType

derive instance valueGeneric ∷ Generic Value _

instance valueShow ∷ Show Value where
  show v = genericShow v

derive instance valueEq ∷ Eq Value
derive instance valueOrd :: Ord Value

_Value_Variable
  ∷ Tuple
      ( Variable → Value
      )
      ( Value
        → Maybe Variable
      )
_Value_Variable =
  Tuple Value_Variable
    ( case _ of
        Value_Variable a → Just a
        _ → Nothing
    )

_Value_IntValue
  ∷ Tuple
      ( IntValue → Value
      )
      ( Value
        → Maybe IntValue
      )
_Value_IntValue =
  Tuple Value_IntValue
    ( case _ of
        Value_IntValue a → Just a
        _ → Nothing
    )

_Value_FloatValue
  ∷ Tuple
      ( FloatValue → Value
      )
      ( Value
        → Maybe FloatValue
      )
_Value_FloatValue =
  Tuple Value_FloatValue
    ( case _ of
        Value_FloatValue a → Just a
        _ → Nothing
    )

_Value_StringValue
  ∷ Tuple
      ( StringValue → Value
      )
      ( Value
        → Maybe StringValue
      )
_Value_StringValue =
  Tuple Value_StringValue
    ( case _ of
        Value_StringValue a → Just a
        _ → Nothing
    )

_Value_BooleanValue
  ∷ Tuple
      ( BooleanValue → Value
      )
      ( Value
        → Maybe BooleanValue
      )
_Value_BooleanValue =
  Tuple Value_BooleanValue
    ( case _ of
        Value_BooleanValue a → Just a
        _ → Nothing
    )

_Value_NullValue
  ∷ Tuple
      ( NullValue → Value
      )
      ( Value
        → Maybe NullValue
      )
_Value_NullValue =
  Tuple Value_NullValue
    ( case _ of
        Value_NullValue a → Just a
        _ → Nothing
    )

_Value_EnumValue
  ∷ Tuple
      ( EnumValue → Value
      )
      ( Value
        → Maybe EnumValue
      )
_Value_EnumValue =
  Tuple Value_EnumValue
    ( case _ of
        Value_EnumValue a → Just a
        _ → Nothing
    )

_Value_ListValue
  ∷ Tuple
      ( ListValue → Value
      )
      ( Value
        → Maybe ListValue
      )
_Value_ListValue =
  Tuple Value_ListValue
    ( case _ of
        Value_ListValue a → Just a
        _ → Nothing
    )

_Value_ObjectValue
  ∷ Tuple
      ( ObjectValue → Value
      )
      ( Value
        → Maybe ObjectValue
      )
_Value_ObjectValue =
  Tuple Value_ObjectValue
    ( case _ of
        Value_ObjectValue a → Just a
        _ → Nothing
    )

data Value
  = Value_Variable Variable
  | Value_IntValue IntValue
  | Value_FloatValue FloatValue
  | Value_StringValue StringValue
  | Value_BooleanValue BooleanValue
  | Value_NullValue NullValue
  | Value_EnumValue EnumValue
  | Value_ListValue ListValue
  | Value_ObjectValue ObjectValue

derive instance intValueGeneric ∷ Generic IntValue _

instance intValueShow ∷ Show IntValue where
  show v = genericShow v

derive instance intValueEq ∷ Eq IntValue
derive instance intValueOrd :: Ord IntValue

_IntValue
  ∷ Tuple
      ( Int → IntValue
      )
      ( IntValue
        → Maybe Int
      )
_IntValue =
  Tuple IntValue
    ( case _ of
        IntValue a → Just a
    )

derive instance intValueNewtype ∷ Newtype IntValue _

newtype IntValue = IntValue Int

derive instance floatValueGeneric ∷ Generic FloatValue _

instance floatValueShow ∷ Show FloatValue where
  show v = genericShow v

derive instance floatValueEq ∷ Eq FloatValue
derive instance floatValueOrd :: Ord FloatValue

_FloatValue
  ∷ Tuple
      ( Number → FloatValue
      )
      ( FloatValue
        → Maybe Number
      )
_FloatValue =
  Tuple FloatValue
    ( case _ of
        FloatValue a → Just a
    )

derive instance floatValueNewtype ∷ Newtype FloatValue _

newtype FloatValue = FloatValue Number

derive instance booleanValueGeneric ∷ Generic BooleanValue _

instance booleanValueShow ∷ Show BooleanValue where
  show v = genericShow v

derive instance booleanValueEq ∷ Eq BooleanValue
derive instance booleanValueOrd :: Ord BooleanValue

_BooleanValue
  ∷ Tuple
      ( Boolean → BooleanValue
      )
      ( BooleanValue
        → Maybe Boolean
      )
_BooleanValue =
  Tuple BooleanValue
    ( case _ of
        BooleanValue a → Just a
    )

derive instance booleanValueNewtype ∷ Newtype BooleanValue _

newtype BooleanValue = BooleanValue Boolean

derive instance stringValueGeneric ∷ Generic StringValue _

instance stringValueShow ∷ Show StringValue where
  show v = genericShow v

derive instance stringValueEq ∷ Eq StringValue
derive instance stringValueOrd :: Ord StringValue

_StringValue
  ∷ Tuple
      ( String → StringValue
      )
      ( StringValue
        → Maybe String
      )
_StringValue =
  Tuple StringValue
    ( case _ of
        StringValue a → Just a
    )

derive instance stringValueNewtype ∷ Newtype StringValue _

newtype StringValue = StringValue String

derive instance nullValueGeneric ∷ Generic NullValue _

instance nullValueShow ∷ Show NullValue where
  show v = genericShow v

derive instance nullValueEq ∷ Eq NullValue
derive instance nullValueOrd :: Ord NullValue

_NullValue
  ∷ Tuple
      ( Unit → NullValue
      )
      ( NullValue
        → Maybe Unit
      )
_NullValue =
  Tuple (\_ → NullValue)
    ( case _ of
        NullValue → Just unit
    )

data NullValue = NullValue

derive instance enumValueGeneric ∷ Generic EnumValue _

instance enumValueShow ∷ Show EnumValue where
  show v = genericShow v

derive instance enumValueEq ∷ Eq EnumValue
derive instance enumValueOrd :: Ord EnumValue

_EnumValue
  ∷ Tuple
      ( String → EnumValue
      )
      ( EnumValue
        → Maybe String
      )
_EnumValue =
  Tuple EnumValue
    ( case _ of
        EnumValue a → Just a
    )

derive instance enumValueNewtype ∷ Newtype EnumValue _

newtype EnumValue = EnumValue String

derive instance listValueGeneric ∷ Generic ListValue _

instance listValueShow ∷ Show ListValue where
  show v = genericShow v

derive instance listValueEq ∷ Eq ListValue
derive instance listValueOrd :: Ord ListValue

_ListValue
  ∷ Tuple
      ( (List Value) → ListValue
      )
      ( ListValue
        → Maybe (List Value)
      )
_ListValue =
  Tuple ListValue
    ( case _ of
        ListValue a → Just a
    )

derive instance listValueNewtype ∷ Newtype ListValue _

newtype ListValue = ListValue (List Value)

derive instance objectValueGeneric ∷ Generic ObjectValue _

instance objectValueShow ∷ Show ObjectValue where
  show v = genericShow v

derive instance objectValueEq ∷ Eq ObjectValue
derive instance objectValueOrd :: Ord ObjectValue

_ObjectValue
  ∷ Tuple
      ( (List Argument) → ObjectValue
      )
      ( ObjectValue
        → Maybe (List Argument)
      )
_ObjectValue =
  Tuple ObjectValue
    ( case _ of
        ObjectValue a → Just a
    )

derive instance objectValueNewtype ∷ Newtype ObjectValue _

newtype ObjectValue = ObjectValue (List Argument)

derive instance variableDefinitionsGeneric ∷ Generic VariableDefinitions _

instance variableDefinitionsShow ∷ Show VariableDefinitions where
  show v = genericShow v

derive instance variableDefinitionsEq ∷ Eq VariableDefinitions
derive instance variableDefinitionsOrd :: Ord VariableDefinitions

_VariableDefinitions
  ∷ Tuple
      ( (List VariableDefinition) → VariableDefinitions
      )
      ( VariableDefinitions
        → Maybe (List VariableDefinition)
      )
_VariableDefinitions =
  Tuple VariableDefinitions
    ( case _ of
        VariableDefinitions a → Just a
    )

derive instance variableDefinitionsNewtype ∷ Newtype VariableDefinitions _

newtype VariableDefinitions = VariableDefinitions (List VariableDefinition)

derive instance variableDefinitionGeneric ∷ Generic VariableDefinition _

instance variableDefinitionShow ∷ Show VariableDefinition where
  show v = genericShow v

derive instance variableDefinitionEq ∷ Eq VariableDefinition
derive instance variableDefinitionOrd :: Ord VariableDefinition

type T_VariableDefinition = { variable ∷ Variable, type ∷ Type, defaultValue ∷ (Maybe DefaultValue) }

_VariableDefinition
  ∷ Tuple
      ( T_VariableDefinition → VariableDefinition
      )
      ( VariableDefinition
        → Maybe T_VariableDefinition
      )
_VariableDefinition =
  Tuple VariableDefinition
    ( case _ of
        VariableDefinition a → Just a
    )

derive instance variableDefinitionNewtype ∷ Newtype VariableDefinition _

newtype VariableDefinition = VariableDefinition T_VariableDefinition

derive instance variableGeneric ∷ Generic Variable _

instance variableShow ∷ Show Variable where
  show v = genericShow v

derive instance variableEq ∷ Eq Variable
derive instance variableOrd :: Ord Variable

_Variable
  ∷ Tuple
      ( String → Variable
      )
      ( Variable
        → Maybe String
      )
_Variable =
  Tuple Variable
    ( case _ of
        Variable a → Just a
    )

derive instance variableNewtype ∷ Newtype Variable _

newtype Variable = Variable String

derive instance defaultValueGeneric ∷ Generic DefaultValue _

instance defaultValueShow ∷ Show DefaultValue where
  show v = genericShow v

derive instance defaultValueEq ∷ Eq DefaultValue
derive instance defaultValueOrd :: Ord DefaultValue

_DefaultValue
  ∷ Tuple
      ( Value → DefaultValue
      )
      ( DefaultValue
        → Maybe Value
      )
_DefaultValue =
  Tuple DefaultValue
    ( case _ of
        DefaultValue a → Just a
    )

derive instance defaultValueNewtype ∷ Newtype DefaultValue _

newtype DefaultValue = DefaultValue Value

derive instance typeGeneric ∷ Generic Type _

instance typeShow ∷ Show Type where
  show v = genericShow v

derive instance typeEq ∷ Eq Type
derive instance typeOrd :: Ord Type

_Type_NamedType
  ∷ Tuple
      ( NamedType → Type
      )
      ( Type
        → Maybe NamedType
      )
_Type_NamedType =
  Tuple Type_NamedType
    ( case _ of
        Type_NamedType a → Just a
        _ → Nothing
    )

_Type_ListType
  ∷ Tuple
      ( ListType → Type
      )
      ( Type
        → Maybe ListType
      )
_Type_ListType =
  Tuple Type_ListType
    ( case _ of
        Type_ListType a → Just a
        _ → Nothing
    )

_Type_NonNullType
  ∷ Tuple
      ( NonNullType → Type
      )
      ( Type
        → Maybe NonNullType
      )
_Type_NonNullType =
  Tuple Type_NonNullType
    ( case _ of
        Type_NonNullType a → Just a
        _ → Nothing
    )

data Type
  = Type_NamedType NamedType
  | Type_ListType ListType
  | Type_NonNullType NonNullType

derive instance namedTypeGeneric ∷ Generic NamedType _

instance namedTypeShow ∷ Show NamedType where
  show v = genericShow v

derive instance namedTypeEq ∷ Eq NamedType
derive instance namedTypeOrd :: Ord NamedType

_NamedType
  ∷ Tuple
      ( String → NamedType
      )
      ( NamedType
        → Maybe String
      )
_NamedType =
  Tuple NamedType
    ( case _ of
        NamedType a → Just a
    )

derive instance namedTypeNewtype ∷ Newtype NamedType _

newtype NamedType = NamedType String

derive instance listTypeGeneric ∷ Generic ListType _

instance listTypeShow ∷ Show ListType where
  show v = genericShow v

derive instance listTypeEq ∷ Eq ListType
derive instance listTypeOrd :: Ord ListType

_ListType
  ∷ Tuple
      ( Type → ListType
      )
      ( ListType
        → Maybe Type
      )
_ListType =
  Tuple ListType
    ( case _ of
        ListType a → Just a
    )

derive instance listTypeNewtype ∷ Newtype ListType _

newtype ListType = ListType Type

derive instance nonNullTypeGeneric ∷ Generic NonNullType _

instance nonNullTypeShow ∷ Show NonNullType where
  show v = genericShow v

derive instance nonNullTypeEq ∷ Eq NonNullType
derive instance nonNullTypeOrd :: Ord NonNullType

_NonNullType_NamedType
  ∷ Tuple
      ( NamedType → NonNullType
      )
      ( NonNullType
        → Maybe NamedType
      )
_NonNullType_NamedType =
  Tuple NonNullType_NamedType
    ( case _ of
        NonNullType_NamedType a → Just a
        _ → Nothing
    )

_NonNullType_ListType
  ∷ Tuple
      ( ListType → NonNullType
      )
      ( NonNullType
        → Maybe ListType
      )
_NonNullType_ListType =
  Tuple NonNullType_ListType
    ( case _ of
        NonNullType_ListType a → Just a
        _ → Nothing
    )

data NonNullType
  = NonNullType_NamedType NamedType
  | NonNullType_ListType ListType

derive instance directivesGeneric ∷ Generic Directives _

instance directivesShow ∷ Show Directives where
  show v = genericShow v

derive instance directivesEq ∷ Eq Directives
derive instance directivesOrd :: Ord Directives

_Directives
  ∷ Tuple
      ( (List Directive) → Directives
      )
      ( Directives
        → Maybe (List Directive)
      )
_Directives =
  Tuple Directives
    ( case _ of
        Directives a → Just a
    )

derive instance directivesNewtype ∷ Newtype Directives _

newtype Directives = Directives (List Directive)

derive instance directiveGeneric ∷ Generic Directive _

instance directiveShow ∷ Show Directive where
  show v = genericShow v

derive instance directiveEq ∷ Eq Directive
derive instance directiveOrd :: Ord Directive

type T_Directive = { name ∷ String, arguments ∷ (Maybe Arguments) }

_Directive
  ∷ Tuple
      ( T_Directive → Directive
      )
      ( Directive
        → Maybe T_Directive
      )
_Directive =
  Tuple Directive
    ( case _ of
        Directive a → Just a
    )

derive instance directiveNewtype ∷ Newtype Directive _

newtype Directive = Directive T_Directive

derive instance typeSystemDefinitionGeneric ∷ Generic TypeSystemDefinition _

instance typeSystemDefinitionShow ∷ Show TypeSystemDefinition where
  show v = genericShow v

derive instance typeSystemDefinitionEq ∷ Eq TypeSystemDefinition
derive instance typeSystemDefinitionOrd :: Ord TypeSystemDefinition

_TypeSystemDefinition_SchemaDefinition
  ∷ Tuple
      ( SchemaDefinition → TypeSystemDefinition
      )
      ( TypeSystemDefinition
        → Maybe SchemaDefinition
      )
_TypeSystemDefinition_SchemaDefinition =
  Tuple TypeSystemDefinition_SchemaDefinition
    ( case _ of
        TypeSystemDefinition_SchemaDefinition a → Just a
        _ → Nothing
    )

_TypeSystemDefinition_TypeDefinition
  ∷ Tuple
      ( TypeDefinition → TypeSystemDefinition
      )
      ( TypeSystemDefinition
        → Maybe TypeDefinition
      )
_TypeSystemDefinition_TypeDefinition =
  Tuple TypeSystemDefinition_TypeDefinition
    ( case _ of
        TypeSystemDefinition_TypeDefinition a → Just a
        _ → Nothing
    )

_TypeSystemDefinition_DirectiveDefinition
  ∷ Tuple
      ( DirectiveDefinition → TypeSystemDefinition
      )
      ( TypeSystemDefinition
        → Maybe DirectiveDefinition
      )
_TypeSystemDefinition_DirectiveDefinition =
  Tuple TypeSystemDefinition_DirectiveDefinition
    ( case _ of
        TypeSystemDefinition_DirectiveDefinition a → Just a
        _ → Nothing
    )

data TypeSystemDefinition
  = TypeSystemDefinition_SchemaDefinition SchemaDefinition
  | TypeSystemDefinition_TypeDefinition TypeDefinition
  | TypeSystemDefinition_DirectiveDefinition DirectiveDefinition

derive instance typeSystemExtensionGeneric ∷ Generic TypeSystemExtension _

instance typeSystemExtensionShow ∷ Show TypeSystemExtension where
  show v = genericShow v

derive instance typeSystemExtensionEq ∷ Eq TypeSystemExtension
derive instance typeSystemExtensionOrd :: Ord TypeSystemExtension

_TypeSystemExtension_SchemaExtension
  ∷ Tuple
      ( SchemaExtension → TypeSystemExtension
      )
      ( TypeSystemExtension
        → Maybe SchemaExtension
      )
_TypeSystemExtension_SchemaExtension =
  Tuple TypeSystemExtension_SchemaExtension
    ( case _ of
        TypeSystemExtension_SchemaExtension a → Just a
        _ → Nothing
    )

_TypeSystemExtension_TypeExtension
  ∷ Tuple
      ( TypeExtension → TypeSystemExtension
      )
      ( TypeSystemExtension
        → Maybe TypeExtension
      )
_TypeSystemExtension_TypeExtension =
  Tuple TypeSystemExtension_TypeExtension
    ( case _ of
        TypeSystemExtension_TypeExtension a → Just a
        _ → Nothing
    )

data TypeSystemExtension
  = TypeSystemExtension_SchemaExtension SchemaExtension
  | TypeSystemExtension_TypeExtension TypeExtension

derive instance schemaDefinitionGeneric ∷ Generic SchemaDefinition _

instance schemaDefinitionShow ∷ Show SchemaDefinition where
  show v = genericShow v

derive instance schemaDefinitionEq ∷ Eq SchemaDefinition
derive instance schemaDefinitionOrd :: Ord SchemaDefinition

type T_SchemaDefinition = { directives ∷ (Maybe Directives), rootOperationTypeDefinition ∷ (List RootOperationTypeDefinition) }

_SchemaDefinition
  ∷ Tuple
      ( T_SchemaDefinition → SchemaDefinition
      )
      ( SchemaDefinition
        → Maybe T_SchemaDefinition
      )
_SchemaDefinition =
  Tuple SchemaDefinition
    ( case _ of
        SchemaDefinition a → Just a
    )

derive instance schemaDefinitionNewtype ∷ Newtype SchemaDefinition _

newtype SchemaDefinition = SchemaDefinition T_SchemaDefinition

derive instance rootOperationTypeDefinitionGeneric ∷ Generic RootOperationTypeDefinition _

instance rootOperationTypeDefinitionShow ∷ Show RootOperationTypeDefinition where
  show v = genericShow v

derive instance rootOperationTypeDefinitionEq ∷ Eq RootOperationTypeDefinition
derive instance rootOperationTypeDefinitionOrd :: Ord RootOperationTypeDefinition

type T_RootOperationTypeDefinition = { operationType ∷ OperationType, namedType ∷ NamedType }

_RootOperationTypeDefinition
  ∷ Tuple
      ( T_RootOperationTypeDefinition → RootOperationTypeDefinition
      )
      ( RootOperationTypeDefinition
        → Maybe T_RootOperationTypeDefinition
      )
_RootOperationTypeDefinition =
  Tuple RootOperationTypeDefinition
    ( case _ of
        RootOperationTypeDefinition a → Just a
    )

derive instance rootOperationTypeDefinitionNewtype ∷ Newtype RootOperationTypeDefinition _

newtype RootOperationTypeDefinition = RootOperationTypeDefinition T_RootOperationTypeDefinition

derive instance schemaExtensionGeneric ∷ Generic SchemaExtension _

instance schemaExtensionShow ∷ Show SchemaExtension where
  show v = genericShow v

derive instance schemaExtensionEq ∷ Eq SchemaExtension
derive instance schemaExtensionOrd :: Ord SchemaExtension

type T_SchemaExtension_With_OperationTypeDefinition = { directives ∷ (Maybe Directives), operationTypesDefinition ∷ (List OperationTypeDefinition) }

_SchemaExtension_With_OperationTypeDefinition
  ∷ Tuple
      ( T_SchemaExtension_With_OperationTypeDefinition → SchemaExtension
      )
      ( SchemaExtension
        → Maybe T_SchemaExtension_With_OperationTypeDefinition
      )
_SchemaExtension_With_OperationTypeDefinition =
  Tuple SchemaExtension_With_OperationTypeDefinition
    ( case _ of
        SchemaExtension_With_OperationTypeDefinition a → Just a
        _ → Nothing
    )

type T_SchemaExtension_With_Directives = { directives ∷ Directives }

_SchemaExtension_With_Directives
  ∷ Tuple
      ( T_SchemaExtension_With_Directives → SchemaExtension
      )
      ( SchemaExtension
        → Maybe T_SchemaExtension_With_Directives
      )
_SchemaExtension_With_Directives =
  Tuple SchemaExtension_With_Directives
    ( case _ of
        SchemaExtension_With_Directives a → Just a
        _ → Nothing
    )

data SchemaExtension
  = SchemaExtension_With_OperationTypeDefinition T_SchemaExtension_With_OperationTypeDefinition
  | SchemaExtension_With_Directives T_SchemaExtension_With_Directives

derive instance operationTypeDefinitionGeneric ∷ Generic OperationTypeDefinition _

instance operationTypeDefinitionShow ∷ Show OperationTypeDefinition where
  show v = genericShow v

derive instance operationTypeDefinitionEq ∷ Eq OperationTypeDefinition
derive instance operationTypeDefinitionOrd :: Ord OperationTypeDefinition

type T_OperationTypeDefinition = { operationType ∷ OperationType, namedType ∷ NamedType }

_OperationTypeDefinition
  ∷ Tuple
      ( T_OperationTypeDefinition → OperationTypeDefinition
      )
      ( OperationTypeDefinition
        → Maybe T_OperationTypeDefinition
      )
_OperationTypeDefinition =
  Tuple OperationTypeDefinition
    ( case _ of
        OperationTypeDefinition a → Just a
    )

derive instance operationTypeDefinitionNewtype ∷ Newtype OperationTypeDefinition _

newtype OperationTypeDefinition = OperationTypeDefinition T_OperationTypeDefinition

derive instance typeDefinitionGeneric ∷ Generic TypeDefinition _

instance typeDefinitionShow ∷ Show TypeDefinition where
  show v = genericShow v

derive instance typeDefinitionEq ∷ Eq TypeDefinition
derive instance typeDefinitionOrd :: Ord TypeDefinition

_TypeDefinition_ScalarTypeDefinition
  ∷ Tuple
      ( ScalarTypeDefinition → TypeDefinition
      )
      ( TypeDefinition
        → Maybe ScalarTypeDefinition
      )
_TypeDefinition_ScalarTypeDefinition =
  Tuple TypeDefinition_ScalarTypeDefinition
    ( case _ of
        TypeDefinition_ScalarTypeDefinition a → Just a
        _ → Nothing
    )

_TypeDefinition_ObjectTypeDefinition
  ∷ Tuple
      ( ObjectTypeDefinition → TypeDefinition
      )
      ( TypeDefinition
        → Maybe ObjectTypeDefinition
      )
_TypeDefinition_ObjectTypeDefinition =
  Tuple TypeDefinition_ObjectTypeDefinition
    ( case _ of
        TypeDefinition_ObjectTypeDefinition a → Just a
        _ → Nothing
    )

_TypeDefinition_InterfaceTypeDefinition
  ∷ Tuple
      ( InterfaceTypeDefinition → TypeDefinition
      )
      ( TypeDefinition
        → Maybe InterfaceTypeDefinition
      )
_TypeDefinition_InterfaceTypeDefinition =
  Tuple TypeDefinition_InterfaceTypeDefinition
    ( case _ of
        TypeDefinition_InterfaceTypeDefinition a → Just a
        _ → Nothing
    )

_TypeDefinition_UnionTypeDefinition
  ∷ Tuple
      ( UnionTypeDefinition → TypeDefinition
      )
      ( TypeDefinition
        → Maybe UnionTypeDefinition
      )
_TypeDefinition_UnionTypeDefinition =
  Tuple TypeDefinition_UnionTypeDefinition
    ( case _ of
        TypeDefinition_UnionTypeDefinition a → Just a
        _ → Nothing
    )

_TypeDefinition_EnumTypeDefinition
  ∷ Tuple
      ( EnumTypeDefinition → TypeDefinition
      )
      ( TypeDefinition
        → Maybe EnumTypeDefinition
      )
_TypeDefinition_EnumTypeDefinition =
  Tuple TypeDefinition_EnumTypeDefinition
    ( case _ of
        TypeDefinition_EnumTypeDefinition a → Just a
        _ → Nothing
    )

_TypeDefinition_InputObjectTypeDefinition
  ∷ Tuple
      ( InputObjectTypeDefinition → TypeDefinition
      )
      ( TypeDefinition
        → Maybe InputObjectTypeDefinition
      )
_TypeDefinition_InputObjectTypeDefinition =
  Tuple TypeDefinition_InputObjectTypeDefinition
    ( case _ of
        TypeDefinition_InputObjectTypeDefinition a → Just a
        _ → Nothing
    )

data TypeDefinition
  = TypeDefinition_ScalarTypeDefinition ScalarTypeDefinition
  | TypeDefinition_ObjectTypeDefinition ObjectTypeDefinition
  | TypeDefinition_InterfaceTypeDefinition InterfaceTypeDefinition
  | TypeDefinition_UnionTypeDefinition UnionTypeDefinition
  | TypeDefinition_EnumTypeDefinition EnumTypeDefinition
  | TypeDefinition_InputObjectTypeDefinition InputObjectTypeDefinition

derive instance typeExtensionGeneric ∷ Generic TypeExtension _

instance typeExtensionShow ∷ Show TypeExtension where
  show v = genericShow v

derive instance typeExtensionEq ∷ Eq TypeExtension
derive instance typeExtensionOrd :: Ord TypeExtension

_TypeExtension_ScalarTypeExtension
  ∷ Tuple
      ( ScalarTypeExtension → TypeExtension
      )
      ( TypeExtension
        → Maybe ScalarTypeExtension
      )
_TypeExtension_ScalarTypeExtension =
  Tuple TypeExtension_ScalarTypeExtension
    ( case _ of
        TypeExtension_ScalarTypeExtension a → Just a
        _ → Nothing
    )

_TypeExtension_ObjectTypeExtension
  ∷ Tuple
      ( ObjectTypeExtension → TypeExtension
      )
      ( TypeExtension
        → Maybe ObjectTypeExtension
      )
_TypeExtension_ObjectTypeExtension =
  Tuple TypeExtension_ObjectTypeExtension
    ( case _ of
        TypeExtension_ObjectTypeExtension a → Just a
        _ → Nothing
    )

_TypeExtension_InterfaceTypeExtension
  ∷ Tuple
      ( InterfaceTypeExtension → TypeExtension
      )
      ( TypeExtension
        → Maybe InterfaceTypeExtension
      )
_TypeExtension_InterfaceTypeExtension =
  Tuple TypeExtension_InterfaceTypeExtension
    ( case _ of
        TypeExtension_InterfaceTypeExtension a → Just a
        _ → Nothing
    )

_TypeExtension_UnionTypeExtension
  ∷ Tuple
      ( UnionTypeExtension → TypeExtension
      )
      ( TypeExtension
        → Maybe UnionTypeExtension
      )
_TypeExtension_UnionTypeExtension =
  Tuple TypeExtension_UnionTypeExtension
    ( case _ of
        TypeExtension_UnionTypeExtension a → Just a
        _ → Nothing
    )

_TypeExtension_EnumTypeExtension
  ∷ Tuple
      ( EnumTypeExtension → TypeExtension
      )
      ( TypeExtension
        → Maybe EnumTypeExtension
      )
_TypeExtension_EnumTypeExtension =
  Tuple TypeExtension_EnumTypeExtension
    ( case _ of
        TypeExtension_EnumTypeExtension a → Just a
        _ → Nothing
    )

_TypeExtension_InputObjectTypeExtension
  ∷ Tuple
      ( InputObjectTypeExtension → TypeExtension
      )
      ( TypeExtension
        → Maybe InputObjectTypeExtension
      )
_TypeExtension_InputObjectTypeExtension =
  Tuple TypeExtension_InputObjectTypeExtension
    ( case _ of
        TypeExtension_InputObjectTypeExtension a → Just a
        _ → Nothing
    )

data TypeExtension
  = TypeExtension_ScalarTypeExtension ScalarTypeExtension
  | TypeExtension_ObjectTypeExtension ObjectTypeExtension
  | TypeExtension_InterfaceTypeExtension InterfaceTypeExtension
  | TypeExtension_UnionTypeExtension UnionTypeExtension
  | TypeExtension_EnumTypeExtension EnumTypeExtension
  | TypeExtension_InputObjectTypeExtension InputObjectTypeExtension

derive instance scalarTypeDefinitionGeneric ∷ Generic ScalarTypeDefinition _

instance scalarTypeDefinitionShow ∷ Show ScalarTypeDefinition where
  show v = genericShow v

derive instance scalarTypeDefinitionEq ∷ Eq ScalarTypeDefinition
derive instance scalarTypeDefinitionOrd :: Ord ScalarTypeDefinition

type T_ScalarTypeDefinition = { description ∷ (Maybe String), name ∷ String, directives ∷ (Maybe Directives) }

_ScalarTypeDefinition
  ∷ Tuple
      ( T_ScalarTypeDefinition → ScalarTypeDefinition
      )
      ( ScalarTypeDefinition
        → Maybe T_ScalarTypeDefinition
      )
_ScalarTypeDefinition =
  Tuple ScalarTypeDefinition
    ( case _ of
        ScalarTypeDefinition a → Just a
    )

derive instance scalarTypeDefinitionNewtype ∷ Newtype ScalarTypeDefinition _

newtype ScalarTypeDefinition = ScalarTypeDefinition T_ScalarTypeDefinition

derive instance scalarTypeExtensionGeneric ∷ Generic ScalarTypeExtension _

instance scalarTypeExtensionShow ∷ Show ScalarTypeExtension where
  show v = genericShow v

derive instance scalarTypeExtensionEq ∷ Eq ScalarTypeExtension
derive instance scalarTypeExtensionOrd :: Ord ScalarTypeExtension

type T_ScalarTypeExtension = { name ∷ String, directives ∷ Directives }

_ScalarTypeExtension
  ∷ Tuple
      ( T_ScalarTypeExtension → ScalarTypeExtension
      )
      ( ScalarTypeExtension
        → Maybe T_ScalarTypeExtension
      )
_ScalarTypeExtension =
  Tuple ScalarTypeExtension
    ( case _ of
        ScalarTypeExtension a → Just a
    )

derive instance scalarTypeExtensionNewtype ∷ Newtype ScalarTypeExtension _

newtype ScalarTypeExtension = ScalarTypeExtension T_ScalarTypeExtension

derive instance objectTypeDefinitionGeneric ∷ Generic ObjectTypeDefinition _

instance objectTypeDefinitionShow ∷ Show ObjectTypeDefinition where
  show v = genericShow v

derive instance objectTypeDefinitionEq ∷ Eq ObjectTypeDefinition
derive instance objectTypeDefinitionOrd :: Ord ObjectTypeDefinition

type T_ObjectTypeDefinition = { description ∷ (Maybe String), name ∷ String, implementsInterfaces ∷ (Maybe ImplementsInterfaces), directives ∷ (Maybe Directives), fieldsDefinition ∷ (Maybe FieldsDefinition) }

_ObjectTypeDefinition
  ∷ Tuple
      ( T_ObjectTypeDefinition → ObjectTypeDefinition
      )
      ( ObjectTypeDefinition
        → Maybe T_ObjectTypeDefinition
      )
_ObjectTypeDefinition =
  Tuple ObjectTypeDefinition
    ( case _ of
        ObjectTypeDefinition a → Just a
    )

derive instance objectTypeDefinitionNewtype ∷ Newtype ObjectTypeDefinition _

newtype ObjectTypeDefinition = ObjectTypeDefinition T_ObjectTypeDefinition

derive instance objectTypeExtensionGeneric ∷ Generic ObjectTypeExtension _

instance objectTypeExtensionShow ∷ Show ObjectTypeExtension where
  show v = genericShow v

derive instance objectTypeExtensionEq ∷ Eq ObjectTypeExtension
derive instance objectTypeExtensionOrd :: Ord ObjectTypeExtension

type T_ObjectTypeExtension_With_FieldsDefinition = { name ∷ String, implementsInterfaces ∷ (Maybe ImplementsInterfaces), directives ∷ (Maybe Directives), fieldsDefinition ∷ FieldsDefinition }

_ObjectTypeExtension_With_FieldsDefinition
  ∷ Tuple
      ( T_ObjectTypeExtension_With_FieldsDefinition → ObjectTypeExtension
      )
      ( ObjectTypeExtension
        → Maybe T_ObjectTypeExtension_With_FieldsDefinition
      )
_ObjectTypeExtension_With_FieldsDefinition =
  Tuple ObjectTypeExtension_With_FieldsDefinition
    ( case _ of
        ObjectTypeExtension_With_FieldsDefinition a → Just a
        _ → Nothing
    )

type T_ObjectTypeExtension_With_Directives = { name ∷ String, implementsInterfaces ∷ (Maybe ImplementsInterfaces), directives ∷ Directives }

_ObjectTypeExtension_With_Directives
  ∷ Tuple
      ( T_ObjectTypeExtension_With_Directives → ObjectTypeExtension
      )
      ( ObjectTypeExtension
        → Maybe T_ObjectTypeExtension_With_Directives
      )
_ObjectTypeExtension_With_Directives =
  Tuple ObjectTypeExtension_With_Directives
    ( case _ of
        ObjectTypeExtension_With_Directives a → Just a
        _ → Nothing
    )

type T_ObjectTypeExtension_With_ImplementsInterfaces = { name ∷ String, implementsInterfaces ∷ ImplementsInterfaces }

_ObjectTypeExtension_With_ImplementsInterfaces
  ∷ Tuple
      ( T_ObjectTypeExtension_With_ImplementsInterfaces → ObjectTypeExtension
      )
      ( ObjectTypeExtension
        → Maybe T_ObjectTypeExtension_With_ImplementsInterfaces
      )
_ObjectTypeExtension_With_ImplementsInterfaces =
  Tuple ObjectTypeExtension_With_ImplementsInterfaces
    ( case _ of
        ObjectTypeExtension_With_ImplementsInterfaces a → Just a
        _ → Nothing
    )

data ObjectTypeExtension
  = ObjectTypeExtension_With_FieldsDefinition T_ObjectTypeExtension_With_FieldsDefinition
  | ObjectTypeExtension_With_Directives T_ObjectTypeExtension_With_Directives
  | ObjectTypeExtension_With_ImplementsInterfaces T_ObjectTypeExtension_With_ImplementsInterfaces

derive instance implementsInterfacesGeneric ∷ Generic ImplementsInterfaces _

instance implementsInterfacesShow ∷ Show ImplementsInterfaces where
  show v = genericShow v

derive instance implementsInterfacesEq ∷ Eq ImplementsInterfaces
derive instance implementsInterfacesOrd :: Ord ImplementsInterfaces

_ImplementsInterfaces
  ∷ Tuple
      ( (List NamedType) → ImplementsInterfaces
      )
      ( ImplementsInterfaces
        → Maybe (List NamedType)
      )
_ImplementsInterfaces =
  Tuple ImplementsInterfaces
    ( case _ of
        ImplementsInterfaces a → Just a
    )

derive instance implementsInterfacesNewtype ∷ Newtype ImplementsInterfaces _

newtype ImplementsInterfaces = ImplementsInterfaces (List NamedType)

derive instance fieldsDefinitionGeneric ∷ Generic FieldsDefinition _

instance fieldsDefinitionShow ∷ Show FieldsDefinition where
  show v = genericShow v

derive instance fieldsDefinitionEq ∷ Eq FieldsDefinition
derive instance fieldsDefinitionOrd :: Ord FieldsDefinition

_FieldsDefinition
  ∷ Tuple
      ( (List FieldDefinition) → FieldsDefinition
      )
      ( FieldsDefinition
        → Maybe (List FieldDefinition)
      )
_FieldsDefinition =
  Tuple FieldsDefinition
    ( case _ of
        FieldsDefinition a → Just a
    )

derive instance fieldsDefinitionNewtype ∷ Newtype FieldsDefinition _

newtype FieldsDefinition = FieldsDefinition (List FieldDefinition)

derive instance fieldDefinitionGeneric ∷ Generic FieldDefinition _

instance fieldDefinitionShow ∷ Show FieldDefinition where
  show v = genericShow v

derive instance fieldDefinitionEq ∷ Eq FieldDefinition
derive instance fieldDefinitionOrd :: Ord FieldDefinition

type T_FieldDefinition = { description ∷ (Maybe String), name ∷ String, argumentsDefinition ∷ (Maybe ArgumentsDefinition), type ∷ Type, directives ∷ (Maybe Directives) }

_FieldDefinition
  ∷ Tuple
      ( T_FieldDefinition → FieldDefinition
      )
      ( FieldDefinition
        → Maybe T_FieldDefinition
      )
_FieldDefinition =
  Tuple FieldDefinition
    ( case _ of
        FieldDefinition a → Just a
    )

derive instance fieldDefinitionNewtype ∷ Newtype FieldDefinition _

newtype FieldDefinition = FieldDefinition T_FieldDefinition

derive instance argumentsDefinitionGeneric ∷ Generic ArgumentsDefinition _

instance argumentsDefinitionShow ∷ Show ArgumentsDefinition where
  show v = genericShow v

derive instance argumentsDefinitionEq ∷ Eq ArgumentsDefinition
derive instance argumentsDefinitionOrd :: Ord ArgumentsDefinition

_ArgumentsDefinition
  ∷ Tuple
      ( (List InputValueDefinition) → ArgumentsDefinition
      )
      ( ArgumentsDefinition
        → Maybe (List InputValueDefinition)
      )
_ArgumentsDefinition =
  Tuple ArgumentsDefinition
    ( case _ of
        ArgumentsDefinition a → Just a
    )

derive instance argumentsDefinitionNewtype ∷ Newtype ArgumentsDefinition _

newtype ArgumentsDefinition = ArgumentsDefinition (List InputValueDefinition)

derive instance inputValueDefinitionGeneric ∷ Generic InputValueDefinition _

instance inputValueDefinitionShow ∷ Show InputValueDefinition where
  show v = genericShow v

derive instance inputValueDefinitionEq ∷ Eq InputValueDefinition
derive instance inputValueDefinitionOrd :: Ord InputValueDefinition

type T_InputValueDefinition = { description ∷ (Maybe String), name ∷ String, type ∷ Type, defaultValue ∷ (Maybe DefaultValue), directives ∷ (Maybe Directives) }

_InputValueDefinition
  ∷ Tuple
      ( T_InputValueDefinition → InputValueDefinition
      )
      ( InputValueDefinition
        → Maybe T_InputValueDefinition
      )
_InputValueDefinition =
  Tuple InputValueDefinition
    ( case _ of
        InputValueDefinition a → Just a
    )

derive instance inputValueDefinitionNewtype ∷ Newtype InputValueDefinition _

newtype InputValueDefinition = InputValueDefinition T_InputValueDefinition

derive instance interfaceTypeDefinitionGeneric ∷ Generic InterfaceTypeDefinition _

instance interfaceTypeDefinitionShow ∷ Show InterfaceTypeDefinition where
  show v = genericShow v

derive instance interfaceTypeDefinitionEq ∷ Eq InterfaceTypeDefinition
derive instance interfaceTypeDefinitionOrd :: Ord InterfaceTypeDefinition

type T_InterfaceTypeDefinition = { description ∷ (Maybe String), name ∷ String, directives ∷ (Maybe Directives), fieldsDefinition ∷ (Maybe FieldsDefinition) }

_InterfaceTypeDefinition
  ∷ Tuple
      ( T_InterfaceTypeDefinition → InterfaceTypeDefinition
      )
      ( InterfaceTypeDefinition
        → Maybe T_InterfaceTypeDefinition
      )
_InterfaceTypeDefinition =
  Tuple InterfaceTypeDefinition
    ( case _ of
        InterfaceTypeDefinition a → Just a
    )

derive instance interfaceTypeDefinitionNewtype ∷ Newtype InterfaceTypeDefinition _

newtype InterfaceTypeDefinition = InterfaceTypeDefinition T_InterfaceTypeDefinition

derive instance interfaceTypeExtensionGeneric ∷ Generic InterfaceTypeExtension _

instance interfaceTypeExtensionShow ∷ Show InterfaceTypeExtension where
  show v = genericShow v

derive instance interfaceTypeExtensionEq ∷ Eq InterfaceTypeExtension
derive instance interfaceTypeExtensionOrd :: Ord InterfaceTypeExtension

type T_InterfaceTypeExtension_With_FieldsDefinition = { name ∷ String, directives ∷ (Maybe Directives), fieldsDefinition ∷ FieldsDefinition }

_InterfaceTypeExtension_With_FieldsDefinition
  ∷ Tuple
      ( T_InterfaceTypeExtension_With_FieldsDefinition → InterfaceTypeExtension
      )
      ( InterfaceTypeExtension
        → Maybe T_InterfaceTypeExtension_With_FieldsDefinition
      )
_InterfaceTypeExtension_With_FieldsDefinition =
  Tuple InterfaceTypeExtension_With_FieldsDefinition
    ( case _ of
        InterfaceTypeExtension_With_FieldsDefinition a → Just a
        _ → Nothing
    )

type T_InterfaceTypeExtension_With_Directives = { name ∷ String, directives ∷ Directives }

_InterfaceTypeExtension_With_Directives
  ∷ Tuple
      ( T_InterfaceTypeExtension_With_Directives → InterfaceTypeExtension
      )
      ( InterfaceTypeExtension
        → Maybe T_InterfaceTypeExtension_With_Directives
      )
_InterfaceTypeExtension_With_Directives =
  Tuple InterfaceTypeExtension_With_Directives
    ( case _ of
        InterfaceTypeExtension_With_Directives a → Just a
        _ → Nothing
    )

data InterfaceTypeExtension
  = InterfaceTypeExtension_With_FieldsDefinition T_InterfaceTypeExtension_With_FieldsDefinition
  | InterfaceTypeExtension_With_Directives T_InterfaceTypeExtension_With_Directives

derive instance unionTypeDefinitionGeneric ∷ Generic UnionTypeDefinition _

instance unionTypeDefinitionShow ∷ Show UnionTypeDefinition where
  show v = genericShow v

derive instance unionTypeDefinitionEq ∷ Eq UnionTypeDefinition
derive instance unionTypeDefinitionOrd :: Ord UnionTypeDefinition

type T_UnionTypeDefinition = { description ∷ Maybe String, name ∷ String, directives ∷ (Maybe Directives), unionMemberTypes ∷ (Maybe UnionMemberTypes) }

_UnionTypeDefinition
  ∷ Tuple
      ( T_UnionTypeDefinition → UnionTypeDefinition
      )
      ( UnionTypeDefinition
        → Maybe T_UnionTypeDefinition
      )
_UnionTypeDefinition =
  Tuple UnionTypeDefinition
    ( case _ of
        UnionTypeDefinition a → Just a
    )

derive instance unionTypeDefinitionNewtype ∷ Newtype UnionTypeDefinition _

newtype UnionTypeDefinition = UnionTypeDefinition T_UnionTypeDefinition

derive instance unionMemberTypesGeneric ∷ Generic UnionMemberTypes _

instance unionMemberTypesShow ∷ Show UnionMemberTypes where
  show v = genericShow v

derive instance unionMemberTypesEq ∷ Eq UnionMemberTypes
derive instance unionMemberTypesOrd :: Ord UnionMemberTypes

_UnionMemberTypes
  ∷ Tuple
      ( (List NamedType) → UnionMemberTypes
      )
      ( UnionMemberTypes
        → Maybe (List NamedType)
      )
_UnionMemberTypes =
  Tuple UnionMemberTypes
    ( case _ of
        UnionMemberTypes a → Just a
    )

derive instance unionMemberTypesNewtype ∷ Newtype UnionMemberTypes _

newtype UnionMemberTypes = UnionMemberTypes (List NamedType)

derive instance unionTypeExtensionGeneric ∷ Generic UnionTypeExtension _

instance unionTypeExtensionShow ∷ Show UnionTypeExtension where
  show v = genericShow v

derive instance unionTypeExtensionEq ∷ Eq UnionTypeExtension
derive instance unionTypeExtensionOrd :: Ord UnionTypeExtension

type T_UnionTypeExtension_With_UnionMemberTypes = { name ∷ String, directives ∷ (Maybe Directives), unionMemberTypes ∷ UnionMemberTypes }

_UnionTypeExtension_With_UnionMemberTypes
  ∷ Tuple
      ( T_UnionTypeExtension_With_UnionMemberTypes → UnionTypeExtension
      )
      ( UnionTypeExtension
        → Maybe T_UnionTypeExtension_With_UnionMemberTypes
      )
_UnionTypeExtension_With_UnionMemberTypes =
  Tuple UnionTypeExtension_With_UnionMemberTypes
    ( case _ of
        UnionTypeExtension_With_UnionMemberTypes a → Just a
        _ → Nothing
    )

type T_UnionTypeExtension_With_Directives = { name ∷ String, directives ∷ Directives }

_UnionTypeExtension_With_Directives
  ∷ Tuple
      ( T_UnionTypeExtension_With_Directives → UnionTypeExtension
      )
      ( UnionTypeExtension
        → Maybe T_UnionTypeExtension_With_Directives
      )
_UnionTypeExtension_With_Directives =
  Tuple UnionTypeExtension_With_Directives
    ( case _ of
        UnionTypeExtension_With_Directives a → Just a
        _ → Nothing
    )

data UnionTypeExtension
  = UnionTypeExtension_With_UnionMemberTypes T_UnionTypeExtension_With_UnionMemberTypes
  | UnionTypeExtension_With_Directives T_UnionTypeExtension_With_Directives

derive instance enumTypeDefinitionGeneric ∷ Generic EnumTypeDefinition _

instance enumTypeDefinitionShow ∷ Show EnumTypeDefinition where
  show v = genericShow v

derive instance enumTypeDefinitionEq ∷ Eq EnumTypeDefinition
derive instance enumTypeDefinitionOrd :: Ord EnumTypeDefinition

type T_EnumTypeDefinition = { description ∷ (Maybe String), name ∷ String, directives ∷ (Maybe Directives), enumValuesDefinition ∷ (Maybe EnumValuesDefinition) }

_EnumTypeDefinition
  ∷ Tuple
      ( T_EnumTypeDefinition → EnumTypeDefinition
      )
      ( EnumTypeDefinition
        → Maybe T_EnumTypeDefinition
      )
_EnumTypeDefinition =
  Tuple EnumTypeDefinition
    ( case _ of
        EnumTypeDefinition a → Just a
    )

derive instance enumTypeDefinitionNewtype ∷ Newtype EnumTypeDefinition _

newtype EnumTypeDefinition = EnumTypeDefinition T_EnumTypeDefinition

derive instance enumValuesDefinitionGeneric ∷ Generic EnumValuesDefinition _

instance enumValuesDefinitionShow ∷ Show EnumValuesDefinition where
  show v = genericShow v

derive instance enumValuesDefinitionEq ∷ Eq EnumValuesDefinition
derive instance enumValuesDefinitionOrd :: Ord EnumValuesDefinition

_EnumValuesDefinition
  ∷ Tuple
      ( (List EnumValueDefinition) → EnumValuesDefinition
      )
      ( EnumValuesDefinition
        → Maybe (List EnumValueDefinition)
      )
_EnumValuesDefinition =
  Tuple EnumValuesDefinition
    ( case _ of
        EnumValuesDefinition a → Just a
    )

derive instance enumValuesDefinitionNewtype ∷ Newtype EnumValuesDefinition _

newtype EnumValuesDefinition = EnumValuesDefinition (List EnumValueDefinition)

derive instance enumValueDefinitionGeneric ∷ Generic EnumValueDefinition _

instance enumValueDefinitionShow ∷ Show EnumValueDefinition where
  show v = genericShow v

derive instance enumValueDefinitionEq ∷ Eq EnumValueDefinition
derive instance enumValueDefinitionOrd :: Ord EnumValueDefinition

type T_EnumValueDefinition = { description ∷ (Maybe String), enumValue ∷ EnumValue, directives ∷ (Maybe Directives) }

_EnumValueDefinition
  ∷ Tuple
      ( T_EnumValueDefinition → EnumValueDefinition
      )
      ( EnumValueDefinition
        → Maybe T_EnumValueDefinition
      )
_EnumValueDefinition =
  Tuple EnumValueDefinition
    ( case _ of
        EnumValueDefinition a → Just a
    )

derive instance enumValueDefinitionNewtype ∷ Newtype EnumValueDefinition _

newtype EnumValueDefinition = EnumValueDefinition T_EnumValueDefinition

derive instance enumTypeExtensionGeneric ∷ Generic EnumTypeExtension _

instance enumTypeExtensionShow ∷ Show EnumTypeExtension where
  show v = genericShow v

derive instance enumTypeExtensionEq ∷ Eq EnumTypeExtension
derive instance enumTypeExtensionOrd :: Ord EnumTypeExtension

type T_EnumTypeExtension_With_EnumValuesDefinition = { name ∷ String, directives ∷ (Maybe Directives), enumValuesDefinition ∷ EnumValuesDefinition }

_EnumTypeExtension_With_EnumValuesDefinition
  ∷ Tuple
      ( T_EnumTypeExtension_With_EnumValuesDefinition → EnumTypeExtension
      )
      ( EnumTypeExtension
        → Maybe T_EnumTypeExtension_With_EnumValuesDefinition
      )
_EnumTypeExtension_With_EnumValuesDefinition =
  Tuple EnumTypeExtension_With_EnumValuesDefinition
    ( case _ of
        EnumTypeExtension_With_EnumValuesDefinition a → Just a
        _ → Nothing
    )

type T_EnumTypeExtension_With_Directives = { name ∷ String, directives ∷ Directives }

_EnumTypeExtension_With_Directives
  ∷ Tuple
      ( T_EnumTypeExtension_With_Directives → EnumTypeExtension
      )
      ( EnumTypeExtension
        → Maybe T_EnumTypeExtension_With_Directives
      )
_EnumTypeExtension_With_Directives =
  Tuple EnumTypeExtension_With_Directives
    ( case _ of
        EnumTypeExtension_With_Directives a → Just a
        _ → Nothing
    )

data EnumTypeExtension
  = EnumTypeExtension_With_EnumValuesDefinition T_EnumTypeExtension_With_EnumValuesDefinition
  | EnumTypeExtension_With_Directives T_EnumTypeExtension_With_Directives

derive instance inputObjectTypeDefinitionGeneric ∷ Generic InputObjectTypeDefinition _

instance inputObjectTypeDefinitionShow ∷ Show InputObjectTypeDefinition where
  show v = genericShow v

derive instance inputObjectTypeDefinitionEq ∷ Eq InputObjectTypeDefinition
derive instance inputObjectTypeDefinitionOrd :: Ord InputObjectTypeDefinition

type T_InputObjectTypeDefinition = { description ∷ (Maybe String), name ∷ String, directives ∷ (Maybe Directives), inputFieldsDefinition ∷ (Maybe InputFieldsDefinition) }

_InputObjectTypeDefinition
  ∷ Tuple
      ( T_InputObjectTypeDefinition → InputObjectTypeDefinition
      )
      ( InputObjectTypeDefinition
        → Maybe T_InputObjectTypeDefinition
      )
_InputObjectTypeDefinition =
  Tuple InputObjectTypeDefinition
    ( case _ of
        InputObjectTypeDefinition a → Just a
    )

derive instance inputObjectTypeDefinitionNewtype ∷ Newtype InputObjectTypeDefinition _

newtype InputObjectTypeDefinition = InputObjectTypeDefinition T_InputObjectTypeDefinition

derive instance inputFieldsDefinitionGeneric ∷ Generic InputFieldsDefinition _

instance inputFieldsDefinitionShow ∷ Show InputFieldsDefinition where
  show v = genericShow v

derive instance inputFieldsDefinitionEq ∷ Eq InputFieldsDefinition
derive instance inputFieldsDefinitionOrd :: Ord InputFieldsDefinition

_InputFieldsDefinition
  ∷ Tuple
      ( (List InputValueDefinition) → InputFieldsDefinition
      )
      ( InputFieldsDefinition
        → Maybe (List InputValueDefinition)
      )
_InputFieldsDefinition =
  Tuple InputFieldsDefinition
    ( case _ of
        InputFieldsDefinition a → Just a
    )

derive instance inputFieldsDefinitionNewtype ∷ Newtype InputFieldsDefinition _

newtype InputFieldsDefinition = InputFieldsDefinition (List InputValueDefinition)

derive instance inputObjectTypeExtensionGeneric ∷ Generic InputObjectTypeExtension _

instance inputObjectTypeExtensionShow ∷ Show InputObjectTypeExtension where
  show v = genericShow v

derive instance inputObjectTypeExtensionEq ∷ Eq InputObjectTypeExtension
derive instance inputObjectTypeExtensionOrd :: Ord InputObjectTypeExtension

type T_InputObjectTypeExtension_With_InputFieldsDefinition = { name ∷ String, directives ∷ (Maybe Directives), inputFieldsDefinition ∷ InputFieldsDefinition }

_InputObjectTypeExtension_With_InputFieldsDefinition
  ∷ Tuple
      ( T_InputObjectTypeExtension_With_InputFieldsDefinition → InputObjectTypeExtension
      )
      ( InputObjectTypeExtension
        → Maybe T_InputObjectTypeExtension_With_InputFieldsDefinition
      )
_InputObjectTypeExtension_With_InputFieldsDefinition =
  Tuple InputObjectTypeExtension_With_InputFieldsDefinition
    ( case _ of
        InputObjectTypeExtension_With_InputFieldsDefinition a → Just a
        _ → Nothing
    )

type T_InputObjectTypeExtension_With_Directives = { name ∷ String, directives ∷ Directives }

_InputObjectTypeExtension_With_Directives
  ∷ Tuple
      ( T_InputObjectTypeExtension_With_Directives → InputObjectTypeExtension
      )
      ( InputObjectTypeExtension
        → Maybe T_InputObjectTypeExtension_With_Directives
      )
_InputObjectTypeExtension_With_Directives =
  Tuple InputObjectTypeExtension_With_Directives
    ( case _ of
        InputObjectTypeExtension_With_Directives a → Just a
        _ → Nothing
    )

data InputObjectTypeExtension
  = InputObjectTypeExtension_With_InputFieldsDefinition T_InputObjectTypeExtension_With_InputFieldsDefinition
  | InputObjectTypeExtension_With_Directives T_InputObjectTypeExtension_With_Directives

derive instance directiveDefinitionGeneric ∷ Generic DirectiveDefinition _

instance directiveDefinitionShow ∷ Show DirectiveDefinition where
  show v = genericShow v

derive instance directiveDefinitionEq ∷ Eq DirectiveDefinition
derive instance directiveDefinitionOrd :: Ord DirectiveDefinition

type T_DirectiveDefinition = { description ∷ (Maybe String), name ∷ String, argumentsDefinition ∷ (Maybe ArgumentsDefinition), directiveLocations ∷ DirectiveLocations }

_DirectiveDefinition
  ∷ Tuple
      ( T_DirectiveDefinition → DirectiveDefinition
      )
      ( DirectiveDefinition
        → Maybe T_DirectiveDefinition
      )
_DirectiveDefinition =
  Tuple DirectiveDefinition
    ( case _ of
        DirectiveDefinition a → Just a
    )

derive instance directiveDefinitionNewtype ∷ Newtype DirectiveDefinition _

newtype DirectiveDefinition = DirectiveDefinition T_DirectiveDefinition

derive instance directiveLocationsGeneric ∷ Generic DirectiveLocations _

instance directiveLocationsShow ∷ Show DirectiveLocations where
  show v = genericShow v

derive instance directiveLocationsEq ∷ Eq DirectiveLocations
derive instance directiveLocationsOrd :: Ord DirectiveLocations

_DirectiveLocations
  ∷ Tuple
      ( (List DirectiveLocation) → DirectiveLocations
      )
      ( DirectiveLocations
        → Maybe (List DirectiveLocation)
      )
_DirectiveLocations =
  Tuple DirectiveLocations
    ( case _ of
        DirectiveLocations a → Just a
    )

derive instance directiveLocationsNewtype ∷ Newtype DirectiveLocations _

newtype DirectiveLocations = DirectiveLocations (List DirectiveLocation)

derive instance directiveLocationGeneric ∷ Generic DirectiveLocation _

instance directiveLocationShow ∷ Show DirectiveLocation where
  show v = genericShow v

derive instance directiveLocationEq ∷ Eq DirectiveLocation
derive instance directiveLocationOrd :: Ord DirectiveLocation

_DirectiveLocation_ExecutableDirectiveLocation
  ∷ Tuple
      ( ExecutableDirectiveLocation → DirectiveLocation
      )
      ( DirectiveLocation
        → Maybe ExecutableDirectiveLocation
      )
_DirectiveLocation_ExecutableDirectiveLocation =
  Tuple DirectiveLocation_ExecutableDirectiveLocation
    ( case _ of
        DirectiveLocation_ExecutableDirectiveLocation a → Just a
        _ → Nothing
    )

_DirectiveLocation_TypeSystemDirectiveLocation
  ∷ Tuple
      ( TypeSystemDirectiveLocation → DirectiveLocation
      )
      ( DirectiveLocation
        → Maybe TypeSystemDirectiveLocation
      )
_DirectiveLocation_TypeSystemDirectiveLocation =
  Tuple DirectiveLocation_TypeSystemDirectiveLocation
    ( case _ of
        DirectiveLocation_TypeSystemDirectiveLocation a → Just a
        _ → Nothing
    )

data DirectiveLocation
  = DirectiveLocation_ExecutableDirectiveLocation ExecutableDirectiveLocation
  | DirectiveLocation_TypeSystemDirectiveLocation TypeSystemDirectiveLocation

derive instance executableDirectiveLocationGeneric ∷ Generic ExecutableDirectiveLocation _

instance executableDirectiveLocationShow ∷ Show ExecutableDirectiveLocation where
  show v = genericShow v

derive instance executableDirectiveLocationEq ∷ Eq ExecutableDirectiveLocation
derive instance executableDirectiveLocationOrd :: Ord ExecutableDirectiveLocation

_QUERY
  ∷ Tuple
      ( Unit → ExecutableDirectiveLocation
      )
      ( ExecutableDirectiveLocation
        → Maybe Unit
      )
_QUERY =
  Tuple (\_ → QUERY)
    ( case _ of
        QUERY → Just unit
        _ → Nothing
    )

_MUTATION
  ∷ Tuple
      ( Unit → ExecutableDirectiveLocation
      )
      ( ExecutableDirectiveLocation
        → Maybe Unit
      )
_MUTATION =
  Tuple (\_ → MUTATION)
    ( case _ of
        MUTATION → Just unit
        _ → Nothing
    )

_SUBSCRIPTION
  ∷ Tuple
      ( Unit → ExecutableDirectiveLocation
      )
      ( ExecutableDirectiveLocation
        → Maybe Unit
      )
_SUBSCRIPTION =
  Tuple (\_ → SUBSCRIPTION)
    ( case _ of
        SUBSCRIPTION → Just unit
        _ → Nothing
    )

_FIELD
  ∷ Tuple
      ( Unit → ExecutableDirectiveLocation
      )
      ( ExecutableDirectiveLocation
        → Maybe Unit
      )
_FIELD =
  Tuple (\_ → FIELD)
    ( case _ of
        FIELD → Just unit
        _ → Nothing
    )

_FRAGMENT_DEFINITION
  ∷ Tuple
      ( Unit → ExecutableDirectiveLocation
      )
      ( ExecutableDirectiveLocation
        → Maybe Unit
      )
_FRAGMENT_DEFINITION =
  Tuple (\_ → FRAGMENT_DEFINITION)
    ( case _ of
        FRAGMENT_DEFINITION → Just unit
        _ → Nothing
    )

_FRAGMENT_SPREAD
  ∷ Tuple
      ( Unit → ExecutableDirectiveLocation
      )
      ( ExecutableDirectiveLocation
        → Maybe Unit
      )
_FRAGMENT_SPREAD =
  Tuple (\_ → FRAGMENT_SPREAD)
    ( case _ of
        FRAGMENT_SPREAD → Just unit
        _ → Nothing
    )

_INLINE_FRAGMENT
  ∷ Tuple
      ( Unit → ExecutableDirectiveLocation
      )
      ( ExecutableDirectiveLocation
        → Maybe Unit
      )
_INLINE_FRAGMENT =
  Tuple (\_ → INLINE_FRAGMENT)
    ( case _ of
        INLINE_FRAGMENT → Just unit
        _ → Nothing
    )

data ExecutableDirectiveLocation
  = QUERY
  | MUTATION
  | SUBSCRIPTION
  | FIELD
  | FRAGMENT_DEFINITION
  | FRAGMENT_SPREAD
  | INLINE_FRAGMENT

derive instance typeSystemDirectiveLocationGeneric ∷ Generic TypeSystemDirectiveLocation _

instance typeSystemDirectiveLocationShow ∷ Show TypeSystemDirectiveLocation where
  show v = genericShow v

derive instance typeSystemDirectiveLocationEq ∷ Eq TypeSystemDirectiveLocation
derive instance typeSystemDirectiveLocationOrd :: Ord TypeSystemDirectiveLocation

_SCHEMA
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_SCHEMA =
  Tuple (\_ → SCHEMA)
    ( case _ of
        SCHEMA → Just unit
        _ → Nothing
    )

_SCALAR
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_SCALAR =
  Tuple (\_ → SCALAR)
    ( case _ of
        SCALAR → Just unit
        _ → Nothing
    )

_OBJECT
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_OBJECT =
  Tuple (\_ → OBJECT)
    ( case _ of
        OBJECT → Just unit
        _ → Nothing
    )

_FIELD_DEFINITION
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_FIELD_DEFINITION =
  Tuple (\_ → FIELD_DEFINITION)
    ( case _ of
        FIELD_DEFINITION → Just unit
        _ → Nothing
    )

_ARGUMENT_DEFINITION
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_ARGUMENT_DEFINITION =
  Tuple (\_ → ARGUMENT_DEFINITION)
    ( case _ of
        ARGUMENT_DEFINITION → Just unit
        _ → Nothing
    )

_INTERFACE
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_INTERFACE =
  Tuple (\_ → INTERFACE)
    ( case _ of
        INTERFACE → Just unit
        _ → Nothing
    )

_UNION
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_UNION =
  Tuple (\_ → UNION)
    ( case _ of
        UNION → Just unit
        _ → Nothing
    )

_ENUM
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_ENUM =
  Tuple (\_ → ENUM)
    ( case _ of
        ENUM → Just unit
        _ → Nothing
    )

_ENUM_VALUE
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_ENUM_VALUE =
  Tuple (\_ → ENUM_VALUE)
    ( case _ of
        ENUM_VALUE → Just unit
        _ → Nothing
    )

_INPUT_OBJECT
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_INPUT_OBJECT =
  Tuple (\_ → INPUT_OBJECT)
    ( case _ of
        INPUT_OBJECT → Just unit
        _ → Nothing
    )

_INPUT_FIELD_DEFINITION
  ∷ Tuple
      ( Unit → TypeSystemDirectiveLocation
      )
      ( TypeSystemDirectiveLocation
        → Maybe Unit
      )
_INPUT_FIELD_DEFINITION =
  Tuple (\_ → INPUT_FIELD_DEFINITION)
    ( case _ of
        INPUT_FIELD_DEFINITION → Just unit
        _ → Nothing
    )

data TypeSystemDirectiveLocation
  = SCHEMA
  | SCALAR
  | OBJECT
  | FIELD_DEFINITION
  | ARGUMENT_DEFINITION
  | INTERFACE
  | UNION
  | ENUM
  | ENUM_VALUE
  | INPUT_OBJECT
  | INPUT_FIELD_DEFINITION
