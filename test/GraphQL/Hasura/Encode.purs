module GraphQL.Hasura.Encode.Test (spec) where

import Prelude

import Data.DateTime (DateTime)
import Data.DateTime.Gen (genDateTime)
import Data.Either (Either(..))
import Data.Maybe (Maybe)
import Effect.Class (liftEffect)
import GraphQL.Hasura.Array (Hasura_text)
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import GraphQL.Hasura.Encode (class EncodeHasura, encodeHasura)
import Test.QuickCheck (class Arbitrary, quickCheck, (===))
import Test.Spec (Spec, describe, it)

spec :: Spec Unit
spec =
  describe "GraphQL.Hasura.Encode.Test" do
    describe "encodeHasura and decodeHasura" do
      it "all values encoded by encodeHasura should be successfully decoded by decodeHasura" do
        liftEffect
          $ quickCheck \(input :: Array Input) ->
              decodeHasura (encodeHasura input) === Right input

      describe "Hasura_text" do 
        it "should encode and decode Hasura_text" do
          liftEffect
            $ quickCheck \(input :: Hasura_text) ->
                decodeHasura (encodeHasura input) === Right input

type Input
  = { string :: String
    , strings :: Array String
    , stringM :: Maybe String
    , boolean :: Boolean
    , int :: Int
    , ints :: Array Int
    , numberM :: Maybe Number
    , datetime :: ArbDateTime
    , datetimes :: Array ArbDateTime
    -- , hasura_text :: Hasura_text
    }

newtype ArbDateTime
  = ArbDateTime DateTime

derive newtype instance encodeHasuraArbDateTime :: EncodeHasura ArbDateTime

derive newtype instance decodeHasuraArbDateTime :: DecodeHasura ArbDateTime

derive newtype instance eqArbDateTime :: Eq ArbDateTime

derive newtype instance showArbDateTime :: Show ArbDateTime

instance arbitraryDateTime :: Arbitrary ArbDateTime where
  arbitrary = ArbDateTime <$> genDateTime

