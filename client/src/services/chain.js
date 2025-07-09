import { contracts, hackatonia } from "@polkadot-api/descriptors"
import { getInkClient } from "polkadot-api/ink"
import { createClient } from "polkadot-api"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web"
 
const client = createClient(
  withPolkadotSdkCompat(
    getWsProvider("ws://127.0.0.1:9944"),
  ),
)
 
// Create a psp22 ink! client
const psp22Client = getInkClient(contracts.psp22)
 
// typedAPI for test AlephZero
const typedApi = client.getTypedApi(testAzero)