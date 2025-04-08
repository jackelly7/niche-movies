using Microsoft.EntityFrameworkCore;
namespace NicheMovies.API.Data;

public class MovieDbContext: DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
        
    }

    // ema changed this from public DbSet<Movie> Movies { get; set; } // keep this

    public DbSet<Movie> Movies { get; set; }
}





    