using Microsoft.AspNetCore.Mvc;
using ArcadeHoopsBackend_FirebaseReady.Models;
using ArcadeHoopsBackend_FirebaseReady.Services;

namespace ArcadeHoopsBackend_FirebaseReady.Controllers
{
    [ApiController]
    [Route("api/game")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IFirebaseService _firebase;

        public GameController(IGameService gameService, IFirebaseService firebase)
        {
            _gameService = gameService;
            _firebase = firebase;
        }

        [HttpPost("player/login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            var player = _gameService.Login(req.PlayerName);
            return Ok(new { PlayerId = player.Id });
        }

        [HttpPost("start")]
        public IActionResult Start([FromBody] StartRequest req)
        {
            var session = _gameService.StartSession(req.PlayerId);
            return Ok(session);
        }

        [HttpPost("shoot")]
        public IActionResult Shoot([FromBody] ShootRequest req)
        {
            var result = _gameService.Shoot(req.PlayerId);
            if (result == null) return BadRequest("Session not found for player.");
            return Ok(result);
        }

        [HttpPost("end")]
        public async Task<IActionResult> End([FromBody] EndRequest req)
        {
            var session = _gameService.EndSession(req.PlayerId);
            if (session == null) return BadRequest("Session not found for player.");

            // Push total score to Firebase under /scores/{playerId}.json
            var success = await _firebase.SetScoreAsync(session.PlayerId, session.Score);
            if (!success) return StatusCode(500, "Failed to write to Firebase.");

            return Ok(new { session.PlayerId, session.Score });
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> Leaderboard()
        {
            var scores = await _firebase.GetAllScoresAsync();
            // Sort descending by score
            var ordered = scores.OrderByDescending(kv => kv.Value)
                                .Select(kv => new { PlayerId = kv.Key, Score = kv.Value })
                                .ToList();
            return Ok(ordered);
        }
    }
}
