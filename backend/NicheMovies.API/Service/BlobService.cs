namespace NicheMovies.API.Service
{
    using Azure.Storage.Blobs;
    public class BlobService
    {
        private readonly BlobContainerClient _containerClient;
        public BlobService(string connectionString, string containerName)
        {
            var blobServiceClient = new BlobServiceClient(connectionString);
            _containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        }
        public async Task<List<string>> ListBlobsAsync()
        {
            var blobs = new List<string>();
            await foreach (var blobItem in _containerClient.GetBlobsAsync())
            {
                blobs.Add($"{_containerClient.Uri}/{blobItem.Name}");
            }
            return blobs;
        }
    }
}
