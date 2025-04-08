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
                    Admin = false
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

        // MovieController.cs
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


    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
