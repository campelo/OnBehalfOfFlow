import { ProtectedResourceScopes } from "@azure/msal-angular"

export interface IAppConfig{
  api: {
    uri: string
  },
  graph: {
    uri: string
  }
  msal: {
    protectedResource: Iterable<readonly [string, (string | ProtectedResourceScopes)[] | null]> | null | undefined
    clientId: string
    redirectUri: string | undefined
    authority: string | undefined
  }
}