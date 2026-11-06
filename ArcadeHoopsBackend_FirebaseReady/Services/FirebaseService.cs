using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace ArcadeHoopsBackend_FirebaseReady.Services
{
    public class FirebaseService : IFirebaseService
    {
        private readonly HttpClient _http;
        private readonly FirebaseOptions _opts;

        public FirebaseService(HttpClient http, IOptions<FirebaseOptions> opts)
        {
            _http = http;
            _opts = opts.Value;
            if (!string.IsNullOrEmpty(_opts.BaseUrl))
            {
                var baseAddr = _opts.BaseUrl.TrimEnd('/') + "/";
                _http.BaseAddress = new Uri(baseAddr);
            }
        }

        public async Task<bool> SetScoreAsync(string playerId, int score)
        {
            var url = $"scores/{playerId}.json";
            var resp = await _http.PutAsJsonAsync(url, score);
            return resp.IsSuccessStatusCode;
        }

        public async Task<Dictionary<string, int>> GetAllScoresAsync()
        {
            var url = $"scores.json";
            try
            {
                var stream = await _http.GetStreamAsync(url);
                var doc = await JsonDocument.ParseAsync(stream);
                var dict = new Dictionary<string, int>();

                if (doc.RootElement.ValueKind == JsonValueKind.Object)
                {
                    foreach (var prop in doc.RootElement.EnumerateObject())
                    {
                        if (prop.Value.ValueKind == JsonValueKind.Number && prop.Value.TryGetInt32(out var v))
                            dict[prop.Name] = v;
                        else if (prop.Value.ValueKind == JsonValueKind.String && int.TryParse(prop.Value.GetString(), out var vs))
                            dict[prop.Name] = vs;
                        else if (prop.Value.ValueKind == JsonValueKind.Number && prop.Value.TryGetInt64(out var vl))
                            dict[prop.Name] = (int)vl;
                    }
                }
                return dict;
            }
            catch
            {
                return new Dictionary<string, int>();
            }
        }
    }
}
