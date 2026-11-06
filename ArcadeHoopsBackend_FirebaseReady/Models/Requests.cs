namespace ArcadeHoopsBackend_FirebaseReady.Models
{
    public class LoginRequest
    {
        public string PlayerName { get; set; } = null!;
    }

    public class StartRequest
    {
        public string PlayerId { get; set; } = null!;
    }

    public class ShootRequest
    {
        public string PlayerId { get; set; } = null!;
    }

    public class EndRequest
    {
        public string PlayerId { get; set; } = null!;
    }
}
