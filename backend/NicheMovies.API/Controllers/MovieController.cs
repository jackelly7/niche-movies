using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using NicheMovies.API.Data;

namespace NicheMovies.API.Controllers
{
    [Route("")]
    [ApiController]

    public class MovieController : ControllerBase
    {
        private MovieDbContext _movieContext;

        // GET
        public MovieController(MovieDbContext poop) => _movieContext = poop;

        // public OkObjectResult Get(int pageLength, int pageNum)
        // {
        //     // IS414 COOKIES
        //     HttpContext.Response.Cookies.Append("Horror", "Comedy", new CookieOptions()
        //     {
        //         HttpOnly = true,
        //         Secure = true,
        //         SameSite = SameSiteMode.Strict,
        //         Expires = DateTime.Now.AddMinutes(1),
        //     });
        //
        //     var blah = _movieContext.Movies
        //         .Skip((pageNum - 1) * pageLength)
        //         .Take(pageLength)
        //         .ToList();
        //
        //     var totalNumBooks = _movieContext.Movies.Count();
        //
        //     return Ok(new
        //     {
        //         Books = blah,
        //         TotalBooks = totalNumBooks
        //     });
        // }


        [HttpGet("api/movies")]
        public IActionResult GetMovies()
        {
            var movies = _movieContext.Movies.Take(10).ToList();
            return Ok(movies);
        }

        [HttpPost("api/movies")]
        public IActionResult AddMovie([FromBody] Movie movie)
        {
            _movieContext.Movies.Add(movie);
            _movieContext.SaveChanges();
            return Created("", movie);
        }

        [HttpDelete("api/movies/{id}")]
        public IActionResult DeleteMovie(int id)
        {
            var movie = _movieContext.Movies.Find(id);
            if (movie == null) return NotFound();

            _movieContext.Movies.Remove(movie);
            _movieContext.SaveChanges();
            return NoContent();
        }
    }
}  