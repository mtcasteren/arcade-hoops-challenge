using System.Collections.Generic;
using System.Threading.Tasks;

namespace ArcadeHoopsBackend_FirebaseReady.Services
{
    public interface IFirebaseService
    {
        Task<bool> SetScoreAsync(string playerId, int score);
        Task<Dictionary<string, int>> GetAllScoresAsync();
    }
}
