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
      it "decodes a date time without milliseconds"
        $ decodeHasura (unsafeCoerce "2020-10-09T08:07:06")
            `shouldEqual`
              ( Right
                  $ DateTime
                      (canonicalDate (toEnumB 2020) (toEnumB 10) (toEnumB 9))
                      (Time (toEnumB 8) (toEnumB 7) (toEnumB 6) (toEnumB 0))
              )
      it "decodes a date time with milliseconds"
        $ decodeHasura (unsafeCoerce "2020-10-09T08:07:06.555")
            `shouldEqual`
              ( Right
                  $ DateTime
                      (canonicalDate (toEnumB 2020) (toEnumB 10) (toEnumB 9))
                      (Time (toEnumB 8) (toEnumB 7) (toEnumB 6) (toEnumB 555))
              )
      it "decodes a date time with microseconds"
        $ decodeHasura (unsafeCoerce "2020-10-09T08:07:06.555555")
            `shouldEqual`
              ( Right
                  $ DateTime
                      (canonicalDate (toEnumB 2020) (toEnumB 10) (toEnumB 9))
                      (Time (toEnumB 8) (toEnumB 7) (toEnumB 6) (toEnumB 555))
              )
      it "decodes a date time with a positive timezone"
        $ decodeHasura (unsafeCoerce "2020-10-09T08:07:06.555555+01:00")
            `shouldEqual`
              ( Right
                  $ DateTime
                      (canonicalDate (toEnumB 2020) (toEnumB 10) (toEnumB 9))
                      (Time (toEnumB 9) (toEnumB 7) (toEnumB 6) (toEnumB 555))
              )
      it "decodes a date time with a negative timezone"
        $ decodeHasura (unsafeCoerce "2020-10-09T08:00:00.555555-02:30")
            `shouldEqual`
              ( Right
                  $ DateTime
                      (canonicalDate (toEnumB 2020) (toEnumB 10) (toEnumB 9))
                      (Time (toEnumB 5) (toEnumB 30) (toEnumB 0) (toEnumB 555))
              )


toEnumB :: forall a. BoundedEnum a => Int -> a
toEnumB = toEnum >>> fromMaybe bottom