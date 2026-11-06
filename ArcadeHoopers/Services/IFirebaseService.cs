using ArcadeHoops.Models;

namespace ArcadeHoops.Services;
public interface IFirebaseService
{
    PlayerRecord CreateOrGetPlayer(string name);
    void PostScore(string playerId, int score);
    List<LeaderboardEntry> GetLeaderboard(int top);
    Dictionary<string,bool> GetAchievements(string playerId);
}
