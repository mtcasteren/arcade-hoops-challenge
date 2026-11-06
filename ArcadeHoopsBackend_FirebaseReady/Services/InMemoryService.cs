using System;
using System.Collections.Generic;
using System.Linq;
using ArcadeHoopsBackend_FirebaseReady.Models;

namespace ArcadeHoopsBackend_FirebaseReady.Services
{
    public class InMemoryService : IFirebaseService
    {
        private readonly Dictionary<string, PlayerRecord> _players = new();
        private readonly List<ScoreRecord> _scores = new();
        private readonly Dictionary<string, Dictionary<string, bool>> _achievements = new();

        public InMemoryService()
        {
            Seed();
        }

        private void Seed()
        {
            var p1 = new PlayerRecord { Id = "p1", Name = "Alex", CreatedAt = DateTime.UtcNow, HighestScore = 420, TotalPlays = 12 };
            var p2 = new PlayerRecord { Id = "p2", Name = "Jordan", CreatedAt = DateTime.UtcNow, HighestScore = 300, TotalPlays = 8 };
            var p3 = new PlayerRecord { Id = "p3", Name = "Taylor", CreatedAt = DateTime.UtcNow, HighestScore = 220, TotalPlays = 6 };

            _players[p1.Id!] = p1;
            _players[p2.Id!] = p2;
            _players[p3.Id!] = p3;

            _achievements[p1.Id!] = new() { { "FirstShot", true }, { "ProShooter", true }, { "GoldenHand", true }, { "400Streak", true }, { "GodOfHoops", false } };
            _achievements[p2.Id!] = new() { { "FirstShot", true }, { "ProShooter", true }, { "GoldenHand", false }, { "400Streak", false }, { "GodOfHoops", false } };
            _achievements[p3.Id!] = new() { { "FirstShot", true }, { "ProShooter", false }, { "GoldenHand", false }, { "400Streak", false }, { "GodOfHoops", false } };

            _scores.Add(new ScoreRecord { PlayerId = p1.Id!, Score = 420, When = DateTime.UtcNow.AddDays(-2) });
            _scores.Add(new ScoreRecord { PlayerId = p2.Id!, Score = 300, When = DateTime.UtcNow.AddDays(-1) });
            _scores.Add(new ScoreRecord { PlayerId = p3.Id!, Score = 220, When = DateTime.UtcNow.AddDays(-3) });
        }

        public PlayerRecord CreateOrGetPlayer(string name)
        {
            var existing = _players.Values.FirstOrDefault(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
            if (existing != null) return existing;

            var id = "u" + Guid.NewGuid().ToString("N").Substring(0, 8);
            var p = new PlayerRecord
            {
                Id = id,
                Name = name,
                CreatedAt = DateTime.UtcNow,
                HighestScore = 0,
                TotalPlays = 0
            };

            _players[id] = p;
            _achievements[id] = new()
            {
                { "FirstShot", false },
                { "ProShooter", false },
                { "GoldenHand", false },
                { "400Streak", false },
                { "GodOfHoops", false }
            };

            return p;
        }

        public void PostScore(string playerId, int score)
        {
            _scores.Add(new ScoreRecord { PlayerId = playerId, Score = score, When = DateTime.UtcNow });

            if (_players.TryGetValue(playerId, out var p))
            {
                if (score > p.HighestScore)
                    p.HighestScore = score;

                p.TotalPlays++;
            }

            var ach = _achievements.ContainsKey(playerId)
                ? _achievements[playerId]
                : (_achievements[playerId] = new()
                {
                    { "FirstShot", false },
                    { "ProShooter", false },
                    { "GoldenHand", false },
                    { "400Streak", false },
                    { "GodOfHoops", false }
                });

            if (score >= 1) ach["FirstShot"] = true;
            if (score >= 100) ach["ProShooter"] = true;
            if (score >= 200) ach["GoldenHand"] = true;
            if (score >= 400) ach["400Streak"] = true;
            if (score >= 500) ach["GodOfHoops"] = true;
        }

        public List<LeaderboardEntry> GetLeaderboard(int top)
        {
            return _players.Values
                .Select(p => new LeaderboardEntry { PlayerId = p.Id, Name = p.Name, Score = p.HighestScore })
                .OrderByDescending(x => x.Score)
                .Take(top)
                .ToList();
        }

        public Dictionary<string, bool> GetAchievements(string playerId)
        {
            if (_achievements.TryGetValue(playerId, out var a))
                return a;

            return new()
            {
                { "FirstShot", false },
                { "ProShooter", false },
                { "GoldenHand", false },
                { "400Streak", false },
                { "GodOfHoops", false }
            };
        }
    }
}
