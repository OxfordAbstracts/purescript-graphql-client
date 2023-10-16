module GraphQL.Client.CodeGen.Transform.NullableOverrides where

import Prelude

import Data.GraphQL.AST as AST
import Data.Lens (class Wander, over, prism', traversed)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Map (Map, lookup)
import Data.Maybe (Maybe(..))
import Data.Profunctor.Choice (class Choice)
import Data.Traversable (class Traversable)
import Data.Tuple (Tuple, uncurry)

inputObjectTypeDefinitionLens :: forall c. Choice c => Wander c => c AST.InputObjectTypeDefinition AST.InputObjectTypeDefinition -> c AST.Document AST.Document
inputObjectTypeDefinitionLens = uPrism AST._Document
  <<< traversed
  <<< uPrism AST._Definition_TypeSystemDefinition
  <<< uPrism AST._TypeSystemDefinition_TypeDefinition
  <<< uPrism AST._TypeDefinition_InputObjectTypeDefinition

objectTypeDefinitionLens :: forall c. Choice c => Wander c => c AST.ObjectTypeDefinition AST.ObjectTypeDefinition -> c AST.Document AST.Document
objectTypeDefinitionLens = uPrism AST._Document
  <<< traversed
  <<< uPrism AST._Definition_TypeSystemDefinition
  <<< uPrism AST._TypeSystemDefinition_TypeDefinition
  <<< uPrism AST._TypeDefinition_ObjectTypeDefinition

inputFieldsLens :: forall l w. Traversable l => Wander w => w AST.InputValueDefinition AST.InputValueDefinition -> w (l AST.InputFieldsDefinition) (l AST.InputFieldsDefinition)
inputFieldsLens =
  traversed
    <<< uPrism AST._InputFieldsDefinition
    <<< traversed

uPrism :: forall s a c. Tuple (a -> s) (s -> Maybe a) -> (Choice c => c a a -> c s s)
uPrism = uncurry prism'

applyNullableOverrides :: Map String (Map String Boolean) -> AST.Document -> AST.Document
applyNullableOverrides overrides =
  over (inputObjectTypeDefinitionLens <<< _Newtype) applyToInputDefinition
    >>> over (objectTypeDefinitionLens <<< _Newtype) applyToTypeDefinition
  where
  applyToInputDefinition def@{ name, inputFieldsDefinition } | Just objOverrides <- lookup name overrides =
    def { inputFieldsDefinition = over (inputFieldsLens <<< _Newtype) (applyToInputFieldsDefinition objOverrides) inputFieldsDefinition }
  applyToInputDefinition def = def

  applyToInputFieldsDefinition objOverrides def@{ name, type: tipe } | Just nullable <- lookup name objOverrides =
    def { type = setNullable nullable tipe }
  applyToInputFieldsDefinition _ def = def

  applyToTypeDefinition def@{ name, fieldsDefinition } | Just objOverrides <- lookup name overrides =
    def
      { fieldsDefinition = over (traversed <<< _Newtype <<< traversed <<< _Newtype) (applyToFieldsDefinition objOverrides) fieldsDefinition
      }

  applyToTypeDefinition def = def

  applyToFieldsDefinition objOverrides def@{ name, type: tipe } | Just nullable <- lookup name objOverrides =
    def { type = setNullable nullable tipe }

  applyToFieldsDefinition _ def = def

setNullable :: Boolean -> AST.Type -> AST.Type
setNullable = case _, _ of
  true, AST.Type_NonNullType (AST.NonNullType_NamedType t) -> AST.Type_NamedType t
  true, AST.Type_NonNullType (AST.NonNullType_ListType t) -> AST.Type_ListType t
  false, AST.Type_NamedType t -> AST.Type_NonNullType $ AST.NonNullType_NamedType t
  false, AST.Type_ListType t -> AST.Type_NonNullType $ AST.NonNullType_ListType t
  _, t -> t