using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using NicheMovies.API.Data;

namespace NicheMovies.API.Controllers
{
    [Route("/api")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieDbContext _movieContext;

        public MovieController(MovieDbContext context)
        {
            _movieContext = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (_movieContext.MovieUsers.Any(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email already registered." });
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new MovieUser
            {
                Email = request.Email,
                Password = hashedPassword,
                Name = request.Name,
                Admin = false
            };

            _movieContext.MovieUsers.Add(user);
            _movieContext.SaveChanges();

            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _movieContext.MovieUsers
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

    // [HttpGet("AllMovies")]
    // public IActionResult GetAllMovies(int pageSize, int pageNum, [FromQuery] List<string>? MovieCategories = null)
    // {
    //     var moviesQuery = _movieContext.Movies.AsQueryable();
    //
    //     // Apply category filter if categories are provided
    //     if (movieCategories != null &&  movieCategories.Any())
    //     {
    //         moviessQuery = moviesQuery.Where(b => movieCategories.Contains(b.Category));
    //     }
    //
    //     var totalNumMovies = moviesQuery.Count();
    //         
    //     var movies = moviesQuery
    //         .Skip((pageNum - 1) * pageSize)
    //         .Take(pageSize)
    //         .ToList();
    //
    //     return Ok(new
    //     {
    //         movies,
    //         totalNumMovies
    //     });
    // }
}
