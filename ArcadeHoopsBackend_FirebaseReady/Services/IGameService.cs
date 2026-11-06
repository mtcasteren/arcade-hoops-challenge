using ArcadeHoopsBackend_FirebaseReady.Models;

namespace ArcadeHoopsBackend_FirebaseReady.Services
{
    public interface IGameService
    {
        Player Login(string playerName);
        GameSession StartSession(string playerId);
        GameSession? Shoot(string playerId);
        GameSession? EndSession(string playerId);
    }
}
