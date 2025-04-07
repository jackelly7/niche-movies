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
    }
}  