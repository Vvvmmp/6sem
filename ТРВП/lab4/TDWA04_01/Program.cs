using Microsoft.AspNetCore.Mvc;
var builder = WebApplication.CreateBuilder(args);

var nick = args.FirstOrDefault(a => a.StartsWith("--Nick="))?.Split('=')[1] ?? "Default";
var port = args.FirstOrDefault(a => a.StartsWith("--Port="))?.Split('=')[1] ?? "5001";

builder.WebHost.UseUrls($"http://localhost:{port}");

var app = builder.Build();

app.Map("/A", (HttpContext context) =>
{
    Console.WriteLine($"--- Получен запрос {context.Request.Method} ---");

    return Results.Ok(new { Nick = nick, Method = context.Request.Method });
});

app.Run();

// curl -X GET http://localhost:5000/api

// curl -X POST http://localhost:5000/api

// curl -X PUT http://localhost:5000/api

// curl -X DELETE http://localhost:5000/api
