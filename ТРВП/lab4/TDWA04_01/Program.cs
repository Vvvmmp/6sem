using Microsoft.AspNetCore.Mvc;
var builder = WebApplication.CreateBuilder(args);

var nick = args.FirstOrDefault(a => a.StartsWith("Nick="))?.Split('=')[1] ?? "Default";
var port = args.FirstOrDefault(a => a.StartsWith("Port="))?.Split('=')[1] ?? "5001";

builder.WebHost.UseUrls($"http://localhost:{port}");

var app = builder.Build();

app.Map("/A", (HttpContext context) =>
{
    Console.WriteLine($"--- Получен запрос {context.Request.Method} ---");

    return Results.Ok(new { Nick = nick, Method = context.Request.Method });
});

app.Run();


//TDWA04_01
//dotnet run -- Nick=X Port=5001
//dotnet run -- Nick=Y Port=5002
//dotnet run -- Nick=Z Port=5003

//ApiGateway
//dotnet run


// curl -X GET http://localhost:5000/api
// curl -X POST http://localhost:5000/api
// curl -X PUT http://localhost:5000/api
// curl -X DELETE http://localhost:5000/api
