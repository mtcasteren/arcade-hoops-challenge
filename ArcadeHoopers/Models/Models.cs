namespace ArcadeHoops.Models;

public class PlayerLogin { public string Name { get; set; } = string.Empty; }

public class PlayerRecord
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int HighestScore { get; set; } = 0;
    public int TotalPlays { get; set; } = 0;
}

public class ScorePost { public string PlayerId { get; set; } = string.Empty; public int Score { get; set; } }

public class ScoreRecord { public string PlayerId { get; set; } = string.Empty; public int Score { get; set; } public DateTime When { get; set; } }

public class LeaderboardEntry { public string? PlayerId { get; set; } public string Name { get; set; } = string.Empty; public int Score { get; set; } }
