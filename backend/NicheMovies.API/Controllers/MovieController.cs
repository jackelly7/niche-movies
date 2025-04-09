using Microsoft.AspNetCore.Mvc;
using NicheMovies.API.Data;
using Microsoft.EntityFrameworkCore;
using OtpNet;

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
                    MfaSecret = null,
                    IsMfaEnabled = false,
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
        
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
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

		        if (user.IsMfaEnabled)
		        {
			        return Ok(new
			        {
				        mfaRequired = true,
				        email = user.Email
			        });
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
        
        [HttpPost("login-mfa")]
        public IActionResult LoginMfa([FromBody] MfaVerifyDto dto)
        {
	        var user = _movieContext.MovieUser.FirstOrDefault(u => u.Email == dto.Email);
	        if (user == null || string.IsNullOrEmpty(user.MfaSecret)) return Unauthorized();

	        var totp = new Totp(Base32Encoding.ToBytes(user.MfaSecret));
	        bool isValid = totp.VerifyTotp(dto.Code, out _, new VerificationWindow(2, 2));

	        if (!isValid) return Unauthorized(new { message = "Invalid MFA code." });

	        return Ok(new { isAdmin = user.Admin });
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
                .ToList();
            
            return Ok(new
            {
                total  = totalMovies,
                data = movies,
            });
        }
        
        [HttpPost("AddMovie")]
        public IActionResult AddMovie([FromBody] MovieTitle newMovie)
        {
	        newMovie.ShowId = Guid.NewGuid().ToString(); // generate unique string ID
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

			// Update all fields
			existingMovie.Title = updatedMovie.Title;
			existingMovie.Type = updatedMovie.Type;
			existingMovie.ReleaseYear = updatedMovie.ReleaseYear;
			existingMovie.Rating = updatedMovie.Rating;
			existingMovie.Description = updatedMovie.Description;
			existingMovie.Duration = updatedMovie.Duration;
			existingMovie.Cast = updatedMovie.Cast;
			existingMovie.Director = updatedMovie.Director;
			existingMovie.Country = updatedMovie.Country;

			existingMovie.Action = updatedMovie.Action;
			existingMovie.Adventure = updatedMovie.Adventure;
			existingMovie.Anime_Series_International_TV_Shows = updatedMovie.Anime_Series_International_TV_Shows;
			existingMovie.British_TV_Shows_Docuseries_International_TV_Shows = updatedMovie.British_TV_Shows_Docuseries_International_TV_Shows;
			existingMovie.Children = updatedMovie.Children;
			existingMovie.Comedies = updatedMovie.Comedies;
			existingMovie.Comedies_Dramas_International_Movies = updatedMovie.Comedies_Dramas_International_Movies;
			existingMovie.Comedies_International_Movies = updatedMovie.Comedies_International_Movies;
			existingMovie.Comedies_Romantic_Movies_ = updatedMovie.Comedies_Romantic_Movies_;
			existingMovie.Crime_TV_Shows_Docuseries = updatedMovie.Crime_TV_Shows_Docuseries;
			existingMovie.Documentaries = updatedMovie.Documentaries;
			existingMovie.Documentaries_International_Movies = updatedMovie.Documentaries_International_Movies;
			existingMovie.Docuseries = updatedMovie.Docuseries;
			existingMovie.Dramas = updatedMovie.Dramas;
			existingMovie.Dramas_International_Movies = updatedMovie.Dramas_International_Movies;
			existingMovie.Dramas_Romantic_Movies = updatedMovie.Dramas_Romantic_Movies;
			existingMovie.Family_Movies = updatedMovie.Family_Movies;
			existingMovie.Fantasy = updatedMovie.Fantasy;
			existingMovie.Horror_Movies = updatedMovie.Horror_Movies;
			existingMovie.International_Movies_Thrillers = updatedMovie.International_Movies_Thrillers;
			existingMovie.International_TV_Shows_Romantic_TV_Dramas = updatedMovie.International_TV_Shows_Romantic_TV_Dramas;
			existingMovie.KidsTV = updatedMovie.KidsTV;
			existingMovie.Language_TV_Shows = updatedMovie.Language_TV_Shows;
			existingMovie.Musicals = updatedMovie.Musicals;
			existingMovie.Nature_TV = updatedMovie.Nature_TV;
			existingMovie.Reality_TV = updatedMovie.Reality_TV;
			existingMovie.Spirituality = updatedMovie.Spirituality;
			existingMovie.TV_Action = updatedMovie.TV_Action;
			existingMovie.TV_Comedies = updatedMovie.TV_Comedies;
			existingMovie.TV_Dramas = updatedMovie.TV_Dramas;
			existingMovie.Talk_Shows_TV_Comedies = updatedMovie.Talk_Shows_TV_Comedies;
			existingMovie.Thrillers = updatedMovie.Thrillers;

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
        
        [HttpPost("setup-mfa")]
        public IActionResult SetupMfa([FromBody] string email)
        {
	        var user = _movieContext.MovieUser.FirstOrDefault(u => u.Email == email);
	        if (user == null) return NotFound("User not found");

	        // Generate secret
	        var secretKey = KeyGeneration.GenerateRandomKey(20);
	        var base32Secret = Base32Encoding.ToString(secretKey);

	        // Save it to the user
	        user.MfaSecret = base32Secret;
	        _movieContext.SaveChanges();

	        // Generate the QR code link for Google Authenticator
	        var otpUri = new OtpUri(OtpType.Totp, base32Secret, user.Email, "Niche Movies");
	        var qrCodeUrl = $"https://api.qrserver.com/v1/create-qr-code/?data={Uri.EscapeDataString(otpUri.ToString())}";

	        return Ok(new { qrCodeUrl, secret = base32Secret });
        }

        [HttpPost("verify-mfa-setup")]
        public IActionResult VerifyMfaSetup([FromBody] MfaVerifyDto dto)
        {
	        var user = _movieContext.MovieUser.FirstOrDefault(u => u.Email == dto.Email);
	        if (user == null || string.IsNullOrEmpty(user.MfaSecret))
	        {
		        return BadRequest(new { message = "User not found or MFA not set up." });
	        }

	        var totp = new Totp(Base32Encoding.ToBytes(user.MfaSecret));
	        bool isValid = totp.VerifyTotp(dto.Code, out _, new VerificationWindow(2, 2));

	        if (!isValid)
	        {
		        Console.WriteLine($"[MFA VERIFY FAIL] Code: {dto.Code}");
		        return Unauthorized(new { message = "Invalid MFA code." });
	        }

	        user.IsMfaEnabled = true;
	        _movieContext.SaveChanges();

	        Console.WriteLine($"[MFA VERIFIED] User {user.Email} enabled MFA.");
	        return Ok(new { message = "MFA enabled successfully." });
        }


    }
}
