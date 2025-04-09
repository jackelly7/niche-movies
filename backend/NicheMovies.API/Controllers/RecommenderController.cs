using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;


namespace NicheMovies.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommenderController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public RecommenderController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("content-based")]
        public async Task<IActionResult> GetContentBasedRecommendations(int userId, int topN = 5)
        {
            var response = await _httpClient.GetAsync($"http://localhost:5001/recommend/content?user_id={userId}&top_n={topN}");
            var jsonString = await response.Content.ReadAsStringAsync();
            var recommendations = JsonConvert.DeserializeObject<List<MovieRecommendation>>(jsonString);
            return Ok(recommendations);
        }

        [HttpGet("collaborative")]
        public async Task<IActionResult> GetCollaborativeRecommendations(int userId, int topN = 5)
        {
            var response = await _httpClient.GetAsync($"http://localhost:5001/recommend/collaborative?user_id={userId}&top_n={topN}");
            var jsonString = await response.Content.ReadAsStringAsync();
            var recommendations = JsonConvert.DeserializeObject<List<MovieRecommendation>>(jsonString);
            return Ok(recommendations);
        }

        [HttpGet("hybrid")]
        public async Task<IActionResult> GetHybridRecommendations(int userId, int topN = 5)
        {
            var response = await _httpClient.GetAsync($"http://localhost:5001/recommend/hybrid?user_id={userId}&top_n={topN}");
            var jsonString = await response.Content.ReadAsStringAsync();
            var recommendations = JsonConvert.DeserializeObject<List<MovieRecommendation>>(jsonString);
            return Ok(recommendations);
        }

        [HttpGet("movie-to-movie")]
        public async Task<IActionResult> GetMovieToMovieRecommendations(string movieTitle, int topN = 5)
        {
            var response = await _httpClient.GetAsync($"http://localhost:5001/recommend/movie-to-movie?movie_title=Jaws&top_n={topN}");
            var jsonString = await response.Content.ReadAsStringAsync();
            var recommendations = JsonConvert.DeserializeObject<List<MovieRecommendation>>(jsonString);
            return Ok(recommendations);
        }

        [HttpGet("hidden-gems")]
        public async Task<IActionResult> GetHiddenGems()
        {
            var response = await _httpClient.GetAsync($"http://localhost:5001/recommend/hidden-gems");
            var jsonString = await response.Content.ReadAsStringAsync();
            var recommendations = JsonConvert.DeserializeObject<List<MovieRecommendation>>(jsonString);
            return Ok(recommendations);
        }

        [HttpGet("genre-based")]
        public async Task<IActionResult> GetGenreBasedRecommendations()
        {
            var response = await _httpClient.GetAsync($"http://localhost:5001/genre-based");
            var jsonString = await response.Content.ReadAsStringAsync();
            var recommendations = JsonConvert.DeserializeObject<List<MovieRecommendation>>(jsonString);
            return Ok(recommendations);
        }
    }

    public class MovieRecommendation
    {
        public string title { get; set; }
        public string description { get; set; }
    }
}