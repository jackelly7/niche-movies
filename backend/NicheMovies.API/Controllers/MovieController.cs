using Microsoft.AspNetCore.Mvc;
using NicheMovies.API.Data;
using Microsoft.EntityFrameworkCore;

namespace NicheMovies.API.Controllers
{
    [Route("")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieDbContext _movieContext;

        public MovieController(MovieDbContext context)
        {
            _movieContext = context;
        }

        [HttpPost("/register")]
        public IActionResult Register([FromBody] MoviesUsers request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (_movieContext.MovieUser.Any(u => u.Email == request.Email))
                {
                    return BadRequest(new { message = "Email already registered." });
                }

                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var user = new MoviesUsers
                {
                    Email = request.Email,
                    Password = hashedPassword,
                    Name = request.Name,
                    Admin = false,
                    Age = request.Age,
                    Phone = request.Phone,
                    Gender = request.Gender,
                    Netflix = request.Netflix,
                    AmazonPrime = request.AmazonPrime,
                    DisneyPlus = request.DisneyPlus,
                    ParamountPlus = request.ParamountPlus,
                    Max = request.Max,
                    Hulu = request.Hulu,
                    AppleTVPlus = request.AppleTVPlus,
                    Peacock = request.Peacock,
                    City = request.City,
                    State = request.State,
                    Zip = request.Zip,
                };

                _movieContext.MovieUser.Add(user);
                _movieContext.SaveChanges();

                return Ok(new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Register Error] {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong during registration." });
            }
        }

        [HttpPost("/login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = _movieContext.MovieUser
                    .FirstOrDefault(u => u.Email == request.Email);

                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                {
                    return Unauthorized(new { message = "Invalid email or password." });
                }

                return Ok(new
                {
                    message = "Login successful",
                    name = user.Name,
                    email = user.Email,
                    isAdmin = user.Admin
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Login Error] {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong during login." });
            }
        }
        
        [HttpGet("AllMovies")]
        public IActionResult GetAllMovies()
        {
            var movies = _movieContext.MoviesTitles
                .OrderBy(m => m.Title)
                .Take(5)
                .Select(m => new
                {
                    m.ShowId,
                    m.Title,
                    m.Description,
                    m.Rating,
                    m.ReleaseYear,
                    m.Director,
                    m.Cast,
                    m.Duration,
                    m.Action,
                    m.Adventure,
                    m.Anime_Series_International_TV_Shows,
                    m.Children,
                    m.Comedies,
                    m.Dramas_International_Movies,
                    m.Comedies_Dramas_International_Movies,
                    m.Comedies_International_Movies,
                    m.Comedies_Romantic_Movies_,
                    m.Crime_TV_Shows_Docuseries,
                    m.Documentaries,
                    m.Documentaries_International_Movies,
                    m.Docuseries,
                    m.Dramas,
                    m.Dramas_Romantic_Movies,
                    m.Family_Movies,
                    m.Fantasy,
                    m.Horror_Movies,
                    m.International_Movies_Thrillers,
                    m.International_TV_Shows_Romantic_TV_Dramas,
                    m.KidsTV,
                    m.Language_TV_Shows,
                    m.Musicals,
                    m.Nature_TV,
                    m.Reality_TV,
                    m.Spirituality,
                    m.TV_Action,
                    m.TV_Comedies,
                    m.TV_Dramas,
                    m.Talk_Shows_TV_Comedies,
                    m.Thrillers
                })
                .ToList();
            return Ok(movies);
        }
        
        [HttpGet("AdminAllMovies")]
        public IActionResult GetAdminAllMovies(int page = 1, int pageSize = 10)
        {
            var skipAmount = (page - 1) * pageSize;
            var totalMovies = _movieContext.MoviesTitles.Count();
            
            var movies = _movieContext.MoviesTitles
                .OrderBy(m => m.Title)
                .Skip(skipAmount)
                .Take(pageSize)
                .Select(m => new
                {
                    m.ShowId,
                    m.Title,
                    m.Description,
                    m.Rating,
                    m.ReleaseYear,
                    m.Director,
                    m.Cast,
                    m.Duration,
                    m.Action,
                    m.Adventure,
                    m.Anime_Series_International_TV_Shows,
                    m.Children,
                    m.Comedies,
                    m.Dramas_International_Movies,
                    m.Comedies_Dramas_International_Movies,
                    m.Comedies_International_Movies,
                    m.Comedies_Romantic_Movies_,
                    m.Crime_TV_Shows_Docuseries,
                    m.Documentaries,
                    m.Documentaries_International_Movies,
                    m.Docuseries,
                    m.Dramas,
                    m.Dramas_Romantic_Movies,
                    m.Family_Movies,
                    m.Fantasy,
                    m.Horror_Movies,
                    m.International_Movies_Thrillers,
                    m.International_TV_Shows_Romantic_TV_Dramas,
                    m.KidsTV,
                    m.Language_TV_Shows,
                    m.Musicals,
                    m.Nature_TV,
                    m.Reality_TV,
                    m.Spirituality,
                    m.TV_Action,
                    m.TV_Comedies,
                    m.TV_Dramas,
                    m.Talk_Shows_TV_Comedies,
                    m.Thrillers
                })
                .ToList();
            
            return Ok(new
            {
                total  = totalMovies,
                data = movies,
            });
        }


        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        // below is the add, update, and delete.
        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] MovieTitle newMovie)
        {
            _movieContext.MoviesTitles.Add(newMovie);
            _movieContext.SaveChanges();
            return Ok(newMovie);
        }

        [HttpPut("UpdateMovie/{movieId}")]
        public IActionResult UpdateMovie(string movieId, [FromBody] MovieTitle updatedMovie)
        {
            var existingMovie = _movieContext.MoviesTitles.Find(movieId);

            if (existingMovie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            existingMovie.Title = updatedMovie.Title;
            existingMovie.ReleaseYear = updatedMovie.ReleaseYear;
            existingMovie.Rating = updatedMovie.Rating;
            existingMovie.Description = updatedMovie.Description;
            existingMovie.Duration = updatedMovie.Duration;
            existingMovie.Cast = updatedMovie.Cast;

            _movieContext.MoviesTitles.Update(existingMovie);
            _movieContext.SaveChanges();

            return Ok(existingMovie);
        }

        [HttpDelete("DeleteMovie/{movieId}")]
        public IActionResult DeleteMovie(string movieId)
        {
            var movie = _movieContext.MoviesTitles.Find(movieId);

            if (movie == null)
            {
                return NotFound(new { message = "Movie not found" });
            }

            _movieContext.MoviesTitles.Remove(movie);
            _movieContext.SaveChanges();

            return NoContent();
        }




    }
}
