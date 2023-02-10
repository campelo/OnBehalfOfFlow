using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using HttpRequestData = Microsoft.Azure.Functions.Worker.Http.HttpRequestData;

namespace Obo.MiddleTier.Function;

public class MiddleTierFunction
{
    private readonly ILogger _logger;

    public MiddleTierFunction(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<MiddleTierFunction>();
    }

    [Function(nameof(MiddleTierAPI))]
    public async Task<HttpResponseData> MiddleTierAPI([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req)
    {
        _logger.LogInformation($"C# HTTP trigger function {nameof(MiddleTierAPI)} processed a request.");

        string? tenantId = Environment.GetEnvironmentVariable("TenantId");
        string? clientId = Environment.GetEnvironmentVariable("ClientId");
        string? clientSecret = Environment.GetEnvironmentVariable("ClientSecret");
        string[] downstreamApiScopes = { "https://graph.microsoft.com/.default" };

        try
        {
            if (string.IsNullOrEmpty(tenantId) ||
           string.IsNullOrEmpty(tenantId) ||
           string.IsNullOrEmpty(tenantId))
                throw new Exception("Configuration values are missing.");

            string authority = $"https://login.microsoftonline.com/{tenantId}";
            string issuer = $"https://sts.windows.net/{tenantId}/";
            string audience = $"api://{clientId}";

            IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
              .WithAuthority(authority)
              .WithClientSecret(clientSecret)
              .Build();

            HttpHeadersCollection headers = req.Headers;
            string token = string.Empty;
            if (headers.TryGetValues("Authorization", out IEnumerable<string>? authHeader))
            {
                if (authHeader.Any() && authHeader.ElementAt(0).StartsWith("Bearer "))
                    token = authHeader.ElementAt(0).Substring(7, authHeader.ElementAt(0).Length - 7);
                else
                    return req.CreateResponse(HttpStatusCode.Unauthorized);
            }

            var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
               issuer + "/.well-known/openid-configuration",
               new OpenIdConnectConfigurationRetriever(),
               new HttpDocumentRetriever());

            await ValidateToken(token, issuer, audience, configurationManager);

            UserAssertion userAssertion = new UserAssertion(token);
            AuthenticationResult result = await app.AcquireTokenOnBehalfOf(downstreamApiScopes, userAssertion).ExecuteAsync();

            string accessToken = result.AccessToken;
            if (accessToken == null)
            {
                throw new Exception("Access Token could not be acquired.");
            }

            var myObj = new { access_token = accessToken };
            var jsonToReturn = JsonConvert.SerializeObject(myObj);

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.WriteString(jsonToReturn);

            return response;
        }
        catch (Exception ex)
        {
            HttpResponseData response = req.CreateResponse(HttpStatusCode.BadRequest);
            response.WriteString(ex.Message);
            return response;
        }
    }

    private static async Task ValidateToken(
        string token,
        string issuer,
        string audience,
        IConfigurationManager<OpenIdConnectConfiguration> configurationManager)
    {
        if (string.IsNullOrEmpty(token)) throw new ArgumentNullException(nameof(token));
        if (string.IsNullOrEmpty(issuer)) throw new ArgumentNullException(nameof(issuer));

        var discoveryDocument = await configurationManager.GetConfigurationAsync(default(CancellationToken));
        var signingKeys = discoveryDocument.SigningKeys;

        var validationParameters = new TokenValidationParameters
        {
            RequireExpirationTime = true,
            RequireSignedTokens = true,
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudience = audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKeys = signingKeys,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),
        };

        try
        {
            new JwtSecurityTokenHandler().ValidateToken(token, validationParameters, out var rawValidatedToken);
        }
        catch (SecurityTokenValidationException)
        {
            throw new Exception("Token validation failed.");
        }
    }
}
