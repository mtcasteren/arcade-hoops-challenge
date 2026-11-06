namespace ArcadeHoopsBackend_FirebaseReady.Models
{
    public class GameSession
    {
        public string SessionId { get; set; } = null!;
        public string PlayerId { get; set; } = null!;
        public int Score { get; set; }
        public DateTime StartedAt { get; set; }
    }
}
