using Microsoft.AspNetCore.Mvc;
using ArcadeHoops.Models;
using ArcadeHoops.Services;

namespace ArcadeHoops.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FirebaseController : ControllerBase
{
    private readonly IFirebaseService _svc;
    public FirebaseController(IFirebaseService svc) => _svc = svc;

    [HttpPost("login")]
    public IActionResult Login([FromBody] PlayerLogin login)
    {
        if (string.IsNullOrWhiteSpace(login.Name)) return BadRequest("Name required");
        var player = _svc.CreateOrGetPlayer(login.Name);
        return Ok(player);
    }

    [HttpPost("score")]
    public IActionResult PostScore([FromBody] ScorePost score)
    {
        if (string.IsNullOrWhiteSpace(score.PlayerId)) return BadRequest("PlayerId required");
        _svc.PostScore(score.PlayerId, score.Score);
        return Ok(new { ok = true });
    }

    [HttpGet("leaderboard")]
    public IActionResult Leaderboard(int top = 10)
    {
        var board = _svc.GetLeaderboard(top);
        return Ok(board);
    }

    [HttpGet("achievements/{playerId}")]
    public IActionResult GetAchievements(string playerId)
    {
        var ach = _svc.GetAchievements(playerId);
        return Ok(ach);
    }
}
