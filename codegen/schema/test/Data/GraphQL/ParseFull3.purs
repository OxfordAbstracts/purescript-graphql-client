module Test.Data.GraphQL.ParseFull3 where

import Prelude
import Data.Either (either)
import Data.GraphQL.AST as AST
import Data.GraphQL.Parser as GP
import Data.Lens (class Wander, Prism', _2, _Just, preview, prism', toListOf, traversed)
import Data.Lens.Common (simple)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.List (List(..), length, (:))
import Data.Maybe (Maybe(..))
import Data.Profunctor.Choice (class Choice)
import Type.Proxy (Proxy(..))
import Data.Tuple (Tuple(..), uncurry)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Exception (throw)
import Node.Encoding (Encoding(..))
import Node.FS.Sync (readTextFile)
import Test.Spec (SpecT, before, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Parsing (runParser)

parseDocument :: String -> Aff AST.Document
parseDocument t = do
  rtf <- liftEffect $ readTextFile UTF8 t
  liftEffect (either (throw <<< show) pure (runParser rtf GP.document))

lensToObjectDefinitions ∷ ∀ m. Choice m ⇒ Wander m ⇒ m AST.ObjectTypeDefinition AST.ObjectTypeDefinition → m AST.Document AST.Document
lensToObjectDefinitions =
  ( uncurry prism' AST._Document
      <<< traversed
      <<< uncurry prism' AST._Definition_TypeSystemDefinition
      <<< uncurry prism' AST._TypeSystemDefinition_TypeDefinition
      <<< uncurry prism' AST._TypeDefinition_ObjectTypeDefinition
  )

peel :: forall a. Prism' (List a) (Tuple a (List a))
peel =
  prism' (\(Tuple f s) -> (Cons f s))
    ( \l -> case l of
        Nil -> Nothing
        (Cons a b) -> Just $ Tuple a b
    )

testSwapi ∷ ∀ m. Monad m ⇒ SpecT Aff Unit m Unit
testSwapi =
  describe "test swapi" do
    before (parseDocument "schemas/swapi.graphql")
      $ do
          -- 52 was confirmed by a quick n' dirty parsing of the document in python
          it "should get 52 type definitions" \doc → do
            (length (toListOf lensToObjectDefinitions doc)) `shouldEqual` 52
          it "should hvae a type Film that implements an interface called Node" \doc → do
            preview
              ( simple _Newtype
                  <<< peel
                  <<< _2
                  <<< traversed
                  <<< uncurry prism' AST._Definition_TypeSystemDefinition
                  <<< uncurry prism' AST._TypeSystemDefinition_TypeDefinition
                  <<< uncurry prism' AST._TypeDefinition_ObjectTypeDefinition
                  <<< simple _Newtype
                  <<< (prop (Proxy :: Proxy "implementsInterfaces"))
                  <<< _Just
              )
              doc
              `shouldEqual`
                Just (AST.ImplementsInterfaces (AST.NamedType "Node" : Nil))
