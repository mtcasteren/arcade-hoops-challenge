namespace ArcadeHoopsBackend_FirebaseReady.Models
{
    public class ScoreRecord
    {
        public string? PlayerId { get; set; }
        public int Score { get; set; }
        public DateTime When { get; set; }
    }
}
