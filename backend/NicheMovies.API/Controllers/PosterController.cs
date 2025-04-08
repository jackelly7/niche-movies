using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NicheMovies.API.Service;
using DotNetEnv;

namespace NicheMovies.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PosterController : ControllerBase
    {
        private readonly BlobService _blobService;
        public PosterController()
        {
            // Replace with your actual connection string and container name
            Env.Load();
            var connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_URL");
            var containerName = "posters";
            _blobService = new BlobService(connectionString, containerName);
        }
        [HttpGet]
        public async Task<IActionResult> GetPosters()
        {
            var posters = await _blobService.ListBlobsAsync();
            var posterList = posters
                .Take(5);
            return Ok(posterList);
        }
    }
}
