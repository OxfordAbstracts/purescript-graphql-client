module GraphQL.Hasura.Decode.Test where

import Prelude

import Data.DateTime (DateTime(..), Time(..), canonicalDate)
import Data.Either (Either(..))
import Data.Enum (class BoundedEnum, toEnum)
import Data.Maybe (fromMaybe)
import GraphQL.Hasura.Decode (decodeHasura)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Unsafe.Coerce (unsafeCoerce)

spec :: Spec Unit
spec =
  describe " GraphQL.Hasura.Decode" do
    describe "decodeHasura" do
      it "converts a date time with milliseconds"
        $ decodeHasura (unsafeCoerce "2020-10-09T08:07:06.555555")
            `shouldEqual`
              ( Right
                  $ DateTime
                      (canonicalDate (toEnumB 2020) (toEnumB 10) (toEnumB 9))
                      (Time (toEnumB 8) (toEnumB 7) (toEnumB 6) (toEnumB 555))
              )


toEnumB :: forall a. BoundedEnum a => Int -> a
toEnumB = toEnum >>> fromMaybe bottom