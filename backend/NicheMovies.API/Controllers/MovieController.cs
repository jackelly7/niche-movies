using Microsoft.AspNetCore.Mvc;
using NicheMovies.API.Data;

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
        public IActionResult Register([FromBody] RegisterRequest request)
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
