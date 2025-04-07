using Microsoft.EntityFrameworkCore;
namespace NicheMovies.API.Data;

public class MovieDbContext: DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
        
    }
    public DbSet<Movies> Movies { get; set; }
}





    