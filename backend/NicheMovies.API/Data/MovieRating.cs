using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NicheMovies.API.Data;

[Table("movies_ratings")]
public class MovieRating
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RatingId { get; set; }

    [Required]
    [ForeignKey("User")]
    public int UserId { get; set; }

    [Required]
    public string ShowId { get; set; }

    [Range(1, 5)]
    public int? Rating { get; set; }

    // public MoviesUsers User { get; set; }
}