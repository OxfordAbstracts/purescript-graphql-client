module DataTypes where

import Prelude

import Data.Argonaut.Decode (class DecodeJson)
import Data.Argonaut.Decode.Generic (genericDecodeJson)
import Data.Generic.Rep (class Generic)
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)


newtype MyNewtype = MyNewtype String 

derive instance Newtype MyNewtype _

derive instance Generic MyNewtype _

derive newtype instance DecodeJson MyNewtype 

instance Show MyNewtype where 
  show = genericShow
