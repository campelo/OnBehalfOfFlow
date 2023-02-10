# On-Behalf-Of Middle Tier

For local development create a local.settings.json with this content:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "TenantId": "{tenant-id}",
    "ClientId": "{client-id}",
    "ClientSecret": "{client-secret}"
  },
  "Host": {
    "LocalHttpPort": 7090,
    "CORS": "*"
  }
}
```