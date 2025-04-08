using Microsoft.EntityFrameworkCore;
namespace NicheMovies.API.Data;

public class MovieDbContext: DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
        
    }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<MoviesUsers> MovieUser { get; set; }

}





    