module GraphQL.Hasura.Encode (class EncodeHasura, EncodeHasuraProp, encodeHasura) where

import Prelude
import Data.Argonaut.Core (Json)
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Encode.Encoders (encodeString)
import Data.DateTime (Date, DateTime(..), Time(..), day, month, year)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Maybe (Maybe)
import Heterogeneous.Mapping (class HMap, class Mapping, hmap)
import Unsafe.Coerce (unsafeCoerce)

class EncodeHasura a where
  encodeHasura :: a -> Json

instance encodeHasuraBoolean :: EncodeHasura Boolean where
  encodeHasura = encodeJson

instance encodeHasuraString :: EncodeHasura String where
  encodeHasura = encodeJson

instance encodeHasuraInt :: EncodeHasura Int where
  encodeHasura = encodeJson

instance encodeHasuraNumber :: EncodeHasura Number where
  encodeHasura = encodeJson

instance encodeHasuraJson :: EncodeHasura Json where
  encodeHasura = encodeJson

instance encodeHasuraArray :: EncodeHasura a => EncodeHasura (Array a) where
  encodeHasura = map encodeHasura >>> encodeJson

instance encodeHasuraMaybe :: EncodeHasura a => EncodeHasura (Maybe a) where
  encodeHasura = map encodeHasura >>> encodeJson

instance encodeHasuraDateTime :: EncodeHasura DateTime where
  encodeHasura (DateTime d t) = encodeString $ dateString d <> "T" <> timeString t

instance encodeHasuraDate :: EncodeHasura Date where
  encodeHasura = dateString >>> encodeString

dateString :: Date -> String
dateString d =
  showEnum (year d)
    <> "-"
    <> showEnum (month d)
    <> "-"
    <> showEnum (day d)

instance encodeHasuraTime :: EncodeHasura Time where
  encodeHasura = timeString >>> encodeString

timeString :: Time -> String
timeString (Time h m s ms) =
  showEnum h
    <> ":"
    <> showEnum m
    <> ":"
    <> showEnum s
    <> "."
    <> showEnum ms

showEnum :: forall b. BoundedEnum b => b -> String
showEnum = show <<< fromEnum

instance encodeHasuraRecord :: HMap EncodeHasuraProp { | r } jsonRecord => EncodeHasura { | r } where
  encodeHasura = encodeRecordProps >>> unsafeToJson

unsafeToJson :: forall a. a -> Json
unsafeToJson = unsafeCoerce

data EncodeHasuraProp = EncodeHasuraProp

instance addOneAndShow ::
  EncodeHasura a =>
  Mapping EncodeHasuraProp a Json where
  mapping EncodeHasuraProp = encodeHasura

encodeRecordProps :: forall r1 r2. HMap EncodeHasuraProp r1 r2 => r1 -> r2
encodeRecordProps = hmap EncodeHasuraProp
