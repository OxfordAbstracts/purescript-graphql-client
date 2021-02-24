module GraphQL.Hasura.Encode.Test (spec) where

import Prelude
import Data.DateTime (DateTime(..), Time(..), canonicalDate)
import Data.Either (Either(..))
import Data.Enum (class BoundedEnum, toEnum)
import Data.Maybe (Maybe, fromMaybe)
import Effect.Class (liftEffect)
import GraphQL.Hasura.Decode (class DecodeHasura, decodeHasura)
import GraphQL.Hasura.Encode (class EncodeHasura, encodeHasura)
import Test.QuickCheck (class Arbitrary, arbitrary, quickCheck, (===))
import Test.QuickCheck.Gen (Gen)
import Test.Spec (Spec, describe, it)

spec :: Spec Unit
spec =
  describe "GraphQL.Hasura.Encode.Test" do
    describe "encodeHasura and decodeHasura" do
      it "all values encoded by encodeHasura should be successfully decoded by decodeHasura" do
        pure unit
        liftEffect
          $ quickCheck \(input :: Array Input) ->
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
    }

newtype ArbDateTime
  = ArbDateTime DateTime

derive newtype instance encodeHasuraArbDateTime :: EncodeHasura ArbDateTime

derive newtype instance decodeHasuraArbDateTime :: DecodeHasura ArbDateTime

derive newtype instance eqArbDateTime :: Eq ArbDateTime

derive newtype instance showArbDateTime :: Show ArbDateTime

instance arbitraryDateTime :: Arbitrary ArbDateTime where
  arbitrary = do
    y <- arbEnumBounded
    mon <- arbEnumBounded
    d <- arbEnumBounded
    h <- arbEnumBounded
    m <- arbEnumBounded
    s <- arbEnumBounded
    ms <- arbEnumBounded
    pure $ ArbDateTime $ DateTime (canonicalDate y mon d) (Time h m s ms)

arbEnumBounded :: forall g. BoundedEnum g => Gen g
arbEnumBounded = arbitrary <#> clamp 1 1000 <#> toEnum <#> fromMaybe bottom
