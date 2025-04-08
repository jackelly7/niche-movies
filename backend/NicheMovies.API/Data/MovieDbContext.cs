using Microsoft.EntityFrameworkCore;
namespace NicheMovies.API.Data;

public class MovieDbContext: DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options)
    {
        
    }
    public DbSet<MovieTitle> MoviesTitles { get; set; }
    public DbSet<MovieUser> MoviesUsers { get; set; }

}





    