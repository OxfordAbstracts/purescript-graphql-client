module Test.MSW where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, JsonDecodeError, decodeJson)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (Either, hush)
import Data.Maybe (fromJust)
import Data.Symbol (class IsSymbol)
import Effect (Effect)
import Foreign (Foreign, unsafeToForeign)
import Partial.Unsafe (unsafePartial)
import Prim.Row as Row
import Prim.RowList (class RowToList, RowList)
import Prim.RowList as RL
import Record as Record
import Type.Prelude (Proxy(..))

newtype SchemaText = SchemaText String

foreign import setupMswImpl :: SchemaText -> Foreign -> Effect Unit

setupMsw
  :: forall @root rootForeign rl
   . RowToList root rl
  => MapHandler rl root rootForeign
  => SchemaText
  -> { | root }
  -> Effect Unit
setupMsw schemaText root = setupMswImpl schemaText $ unsafeToForeign rootMapped
  where
  rootMapped :: { | rootForeign }
  rootMapped = mapHandlers root

-- | Maps a record of functions (req -> res) to (Json -> Json)
-- | by composing each function with decodeJson and encodeJson
class MapHandler :: RowList Type -> Row Type -> Row Type -> Constraint
class MapHandler rl root rootForeign | rl -> root rootForeign where
  mapHandlerImpl :: Proxy rl -> { | root } -> { | rootForeign }

instance MapHandler RL.Nil () () where
  mapHandlerImpl _ _ = {}

instance
  ( IsSymbol sym
  , EncodeJson res
  , DecodeJson req
  , Row.Cons sym (req -> res) r_in' r_in
  , Row.Cons sym (Json -> Json) r_out' r_out
  , Row.Lacks sym r_out'
  , MapHandler tail r_in r_out'
  ) =>
  MapHandler (RL.Cons sym (req -> res) tail) r_in r_out where
  mapHandlerImpl _ rec =
    let
      tail = mapHandlerImpl (Proxy :: Proxy tail) rec
      sym = Proxy :: Proxy sym
      fn = Record.get sym rec
      encodedFn req = do
        -- OK for test purposes, should never fail anyway
        let
          (varsE :: Either JsonDecodeError req) = decodeJson req
          vars = unsafePartial $ fromJust $ hush varsE
        encodeJson $ fn vars
    in
      Record.insert sym encodedFn tail

mapHandlers
  :: forall root rootForeign rl
   . RowToList root rl
  => MapHandler rl root rootForeign
  => { | root }
  -> { | rootForeign }
mapHandlers = mapHandlerImpl (Proxy :: Proxy rl)

