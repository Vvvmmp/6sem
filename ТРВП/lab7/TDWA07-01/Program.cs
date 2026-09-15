using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

string connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") 
    ?? "Server=localhost;Database=Celebrities;User Id=sa;Password=YourPassword;TrustServerCertificate=True;";

IDbConnection GetConnection() => new SqlConnection(connectionString);

app.MapPost("/api/celebrities", async (Celebrity celebrity) => {
    using var db = GetConnection();
    var sql = "INSERT INTO Celebrities (FullName, Nationality, ReqPhotoPath) " +
              "OUTPUT INSERTED.* VALUES (@FullName, @Nationality, @ReqPhotoPath)";
    var created = await db.QuerySingleAsync<Celebrity>(sql, celebrity);
    return Results.Created($"/api/celebrities/{created.Id}", created);
});

app.MapGet("/api/celebrities", async () => {
    using var db = GetConnection();
    var list = await db.QueryAsync<Celebrity>("SELECT * FROM Celebrities");
    return Results.Ok(list);
});

app.MapGet("/api/celebrities/{id:int}", async (int id) => {
    using var db = GetConnection();
    var item = await db.QueryFirstOrDefaultAsync<Celebrity>("SELECT * FROM Celebrities WHERE Id = @id", new { id });
    return item is not null ? Results.Ok(item) : Results.NotFound();
});

app.MapPut("/api/celebrities/{id:int}", async (int id, Celebrity celebrity) => {
    using var db = GetConnection();
    celebrity.Id = id;
    var sql = "UPDATE Celebrities SET FullName = @FullName, Nationality = @Nationality, ReqPhotoPath = @ReqPhotoPath " +
              "WHERE Id = @Id";
    var affected = await db.ExecuteAsync(sql, celebrity);
    return affected > 0 ? Results.Ok(celebrity) : Results.NotFound();
});

app.MapDelete("/api/celebrities/{id:int}", async (int id) => {
    using var db = GetConnection();
    var affected = await db.ExecuteAsync("DELETE FROM Celebrities WHERE Id = @id", new { id });
    return affected > 0 ? Results.Ok(new { message = "Удалено" }) : Results.NotFound();
});

app.Run();

public class Celebrity {
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Nationality { get; set; } = "";
    public string? ReqPhotoPath { get; set; }
}