var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles(); // para mag-load ng index.html automatically
app.UseStaticFiles();  // para gumana ang CSS/JS

app.Run();
