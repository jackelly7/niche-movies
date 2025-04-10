using Microsoft.EntityFrameworkCore;
using NicheMovies.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddHttpClient();

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MoviesConnection")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5001", "https://nichemovies.pro", "https://niche-movies-machine-learning-api-ashtcnfzdjh7b9bm.eastus-01.azurewebsites.net")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MoviesConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Content-Security-Policy", 
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' http://localhost:3000 https://nichemovies.pro; " +
        "font-src 'self' " +
        "img-src 'self' data:; " +
        "connect-src 'self' http://localhost:3000 https://localhost:4000 https://nichemovies.pro;");
    await next();
});

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();