using ArcadeHoopsBackend_FirebaseReady.Models;
using System.Collections.Concurrent;

namespace ArcadeHoopsBackend_FirebaseReady.Services
{
    // Simple in-memory game session manager. In production this would be persisted.
    public class GameService : IGameService
    {
        private readonly ConcurrentDictionary<string, Player> _players = new();
        private readonly ConcurrentDictionary<string, GameSession> _sessions = new();
        private readonly Random _rng = new();

        public Player Login(string playerName)
        {
            var id = Guid.NewGuid().ToString("N");
            var player = new Player { Id = id, Name = playerName };
            _players[id] = player;
            return player;
        }

        public GameSession StartSession(string playerId)
        {
            var sid = Guid.NewGuid().ToString("N");
            var session = new GameSession
            {
                SessionId = sid,
                PlayerId = playerId,
                Score = 0,
                StartedAt = DateTime.UtcNow
            };
            _sessions[playerId] = session;
            return session;
        }

        public GameSession? Shoot(string playerId)
        {
            if (!_sessions.TryGetValue(playerId, out var session)) return null;
            // Random score between 2 and 6 inclusive
            var add = _rng.Next(2, 7);
            session.Score += add;
            return session;
        }

        public GameSession? EndSession(string playerId)
        {
            if (!_sessions.TryRemove(playerId, out var session)) return null;
            // Return final session (score)
            return session;
        }
    }
}
