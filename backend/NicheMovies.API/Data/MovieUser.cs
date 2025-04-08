using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NicheMovies.API.Data;

public class MovieUser
{
    [Key]
    public int UserId { get; set; } // primary key
    [Required]
    public string Name { get; set; }
    public string? Phone { get; set; }
    [Required]
    public string Email { get; set; }
    public int? Age { get; set; }
    public string? Gender { get; set; }
    public bool? Netlfix { get; set; }
    public bool? AmazonPrime { get; set; }
    [Column("Disney+")]
    public bool? DisneyPlus { get; set; }
    [Column("Paramount+")]
    public bool? ParamountPlus { get; set; }

    public bool? Max { get; set; }

    public bool? Hulu { get; set; }
    [Column("Apple TV+")]
    public bool? AppleTVPlus { get; set; }

    public bool? Peacock { get; set; }

    public string? City { get; set; }
    public string? State { get; set; }

    public int? Zip { get; set; }
    [Required]
    public bool Admin { get; set; }
    [Required]
    public string Password { get; set; }
}