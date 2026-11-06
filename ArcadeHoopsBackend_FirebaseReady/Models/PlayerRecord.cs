namespace ArcadeHoopsBackend_FirebaseReady.Models
{
    public class PlayerRecord
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public int HighestScore { get; set; }
        public int TotalPlays { get; set; }
    }
}
