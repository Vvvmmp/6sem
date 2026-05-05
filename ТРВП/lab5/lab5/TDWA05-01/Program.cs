var builder = WebApplication.CreateBuilder(args);

var nick = args.FirstOrDefault(a => a.StartsWith("--Nick="))?.Split('=')[1] ?? "Default";
var port = args.FirstOrDefault(a => a.StartsWith("--Port="))?.Split('=')[1] ?? "5001";
int delay = int.Parse(args.FirstOrDefault(a => a.StartsWith("--Delay="))?.Split('=')[1] ?? "0");

builder.WebHost.UseUrls($"http://localhost:{port}");
var app = builder.Build();

async Task HandleRequest(HttpContext context, int specificDelay)
{
    if (specificDelay > 0)
    {
        await Task.Delay(specificDelay); 
    }
    await context.Response.WriteAsJsonAsync(new { Nick = nick, Method = context.Request.Method });
}

app.MapGet("/A", (HttpContext ctx) => HandleRequest(ctx, delay / 3));
app.MapPost("/A", (HttpContext ctx) => HandleRequest(ctx, 2 * delay / 3));
app.MapPut("/A", (HttpContext ctx) => HandleRequest(ctx, delay));
app.MapDelete("/A", (HttpContext ctx) => HandleRequest(ctx, delay / 4));

Console.WriteLine($"Сервер {nick} запущен на порту {port} с базовой задержкой {delay}ms");
app.Run();

//dotnet run --Nick=Server1 --Port=5001 --Delay=300
//dotnet run --Nick=Server2 --Port=5002 --Delay=300
//dotnet run --Nick=Server3 --Port=5003 --Delay=300
