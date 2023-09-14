module Test.Data.GraphQL.ParseFull0 where

import Prelude

import Data.Either (either)
import Data.GraphQL.AST as AST
import Data.GraphQL.Parser as GP
import Data.Lens (class Wander)
import Data.Lens as L
import Data.Lens.Index as LI
import Data.Lens.Record as LR
import Data.List (List, length)
import Data.Maybe (Maybe(..), maybe)
import Data.Profunctor.Choice (class Choice)
import Type.Proxy (Proxy(..))
import Data.Tuple (uncurry)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Exception (throw)
import Test.Spec (Spec, before, describe, it)
import Test.Spec.Assertions (shouldEqual, fail)
import Parsing (runParser)

parseDocument ∷ String → Aff (AST.Document)
parseDocument t = liftEffect (either (throw <<< show) pure (runParser t GP.document))

schema =
  """type Tweet {
    id: ID!
    # The tweet text. No more than 140 characters!
    body: String
    # When the tweet was published
    date: Date
    # Who published the tweet
    Author: User
    # Views, retweets, likes, etc
    Stats: Stat
}

type User {
    id: ID!
    username: String
    first_name: String
    last_name: String
    full_name: String
    name: String @deprecated
    avatar_url: Url
}

type Stat {
    views: Int
    likes: Int
    retweets: Int
    responses: Int
}

type Notification {
    id: ID
    date: Date
    type: String
}

type Meta {
    count: Int
}

scalar Url
scalar Date

type Query {
    Tweet(id: ID!): Tweet
    Tweets(limit: Int, skip: Int, sort_field: String, sort_order: String): [Tweet]
    TweetsMeta: Meta
    User(id: ID!): User
    Notifications(limit: Int): [Notification]
    NotificationsMeta: Meta
}

type Mutation {
    createTweet (
        body: String
    ): Tweet
    deleteTweet(id: ID!): Tweet
    markTweetRead(id: ID!): Boolean
}""" ∷
    String

lensToTweetObjectTypeDefinition ∷ ∀ m. Choice m ⇒ Wander m ⇒ m AST.ObjectTypeDefinition AST.ObjectTypeDefinition → m AST.Document AST.Document
lensToTweetObjectTypeDefinition =
  ( uncurry L.prism' AST._Document
      <<< LI.ix 0
      <<< uncurry L.prism' AST._Definition_TypeSystemDefinition
      <<< uncurry L.prism' AST._TypeSystemDefinition_TypeDefinition
      <<< uncurry L.prism' AST._TypeDefinition_ObjectTypeDefinition
  )

getTweetName ∷ AST.Document → Maybe String
getTweetName =
  L.preview
    $ ( lensToTweetObjectTypeDefinition
          <<< uncurry L.prism' AST._ObjectTypeDefinition
          <<< LR.prop (Proxy ∷ Proxy "name")
      )

getTweetFieldDefinitionList ∷ AST.Document → Maybe (List AST.FieldDefinition)
getTweetFieldDefinitionList =
  L.preview
    $ ( lensToTweetObjectTypeDefinition
          <<< uncurry L.prism' AST._ObjectTypeDefinition
          <<< LR.prop (Proxy ∷ Proxy "fieldsDefinition")
          <<< L._Just
          <<< uncurry L.prism' AST._FieldsDefinition
      )

getTweetIdArgName ∷ AST.Document → Maybe String
getTweetIdArgName =
  L.preview
    $ ( lensToTweetObjectTypeDefinition
          <<< uncurry L.prism' AST._ObjectTypeDefinition
          <<< LR.prop (Proxy ∷ Proxy "fieldsDefinition")
          <<< L._Just
          <<< uncurry L.prism' AST._FieldsDefinition
          <<< LI.ix 0
          <<< uncurry L.prism' AST._FieldDefinition
          <<< LR.prop (Proxy ∷ Proxy "name")
      )

lensToUserObjectTypeDefinition ∷ ∀ m. Choice m ⇒ Wander m ⇒ m AST.ObjectTypeDefinition AST.ObjectTypeDefinition → m AST.Document AST.Document
lensToUserObjectTypeDefinition =
  ( uncurry L.prism' AST._Document
      <<< LI.ix 1
      <<< uncurry L.prism' AST._Definition_TypeSystemDefinition
      <<< uncurry L.prism' AST._TypeSystemDefinition_TypeDefinition
      <<< uncurry L.prism' AST._TypeDefinition_ObjectTypeDefinition
  )

getUserFieldDefinitionList ∷ AST.Document → Maybe (List AST.FieldDefinition)
getUserFieldDefinitionList =
  L.preview
    $ ( lensToUserObjectTypeDefinition
          <<< uncurry L.prism' AST._ObjectTypeDefinition
          <<< LR.prop (Proxy ∷ Proxy "fieldsDefinition")
          <<< L._Just
          <<< uncurry L.prism' AST._FieldsDefinition
      )

spec ∷ Spec Unit
spec =
  describe "test full doc" do
    before (parseDocument schema)
      $ do
          it "should parse name of Tweet correctly" \doc → do
            getTweetName doc `shouldEqual` Just "Tweet"
          it "should have the right number of definitions in the Tweet type" \doc → do
            let
              fieldlist = getTweetFieldDefinitionList doc
            maybe (fail "List should not be empty") (shouldEqual 5 <<< length) fieldlist
          it "should parse name of Tweet.id correctly" \doc → do
            getTweetIdArgName doc `shouldEqual` Just "id"
          it "should have the right number of definitions in the User type" \doc → do
            let
              fieldlist = getUserFieldDefinitionList doc
            maybe (fail "List should not be empty") (shouldEqual 7 <<< length) fieldlist
