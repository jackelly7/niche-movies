using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Movie
{
    [Key]
    public int Show_Id { get; set; }

    [Required]
    public string? Type { get; set; }

    [Required]
    public string? Title { get; set; }

    public string? Director { get; set; }

    public string? Cast { get; set; }

    public string? Country { get; set; }

    [Required]
    public int? ReleaseYear { get; set; }

    [Required]
    public int? Rating { get; set; }

    [Required]
    public int? Duration { get; set; }
    
    [Required]
    public int? Description { get; set; }

    [Required]
    public int? Action { get; set; }

    [Required]
    public int? Adventure { get; set; }

    [Required]
    [Column("Anime Series International TV Shows")]
    public int? Anime_Series_International_TV_Shows { get; set; }

    [Required]
    [Column("British TV Shows Docuseries International TV Shows")]
    public int? British_TV_Shows_Docuseries_International_TV_Shows { get; set; }

    [Required]
    public int? Children { get; set; }

    [Required]
    public int? Comedies { get; set; }

    [Required]
    [Column("Comedies Dramas International Movies")]
    public int? Comedies_Dramas_International_Movies { get; set; }

    [Required]
    [Column("Comedies International Movies")]
    public int? Comedies_International_Movies { get; set; }

    [Required]
    [Column("Comedies Romantic Movies")]
    public int? Comedies_Romantic_Movies_ { get; set; }

    [Required]
    [Column("Crime TV Shows Docuseries")]
    public int? Crime_TV_Shows_Docuseries { get; set; }

    [Required]
    public int? Documentaries { get; set; }

    [Required]
    [Column("Documentaries International Movies")]
    public int? Documentaries_International_Movies { get; set; }

    [Required]
    public int? Docuseries { get; set; }

    [Required]
    public int? Dramas { get; set; }

    [Required]
    [Column("Dramas International Movies")]
    public int? Dramas_International_Movies { get; set; }

    [Required]
    [Column("Dramas Romantic Movies")]
    public int? Dramas_Romantic_Movies { get; set; }

    [Required]
    [Column("Family Movies")]
    public int? Family_Movies { get; set; }

    [Required]
    public int? Fantasy { get; set; }

    [Required]
    [Column("Horror Movies")]
    public int? Horror_Movies { get; set; }

    [Required]
    [Column("International Movies Thrillers")]
    public int? International_Movies_Thrillers { get; set; }

    [Required]
    [Column("International TV Shows Romantic TV Dramas")]
    public int? International_TV_Shows_Romantic_TV_Dramas { get; set; }

    [Required]
    [Column("Kids' TV")]
    public bool KidsTV { get; set; }

    [Required]
    [Column("Language TV Shows")]
    public int? Language_TV_Shows { get; set; }

    [Required]
    public int? Musicals { get; set; }

    [Required]
    [Column("Nature TV")]
    public int? Nature_TV { get; set; }

    [Required]
    [Column("Reality TV")]
    public int? Reality_TV { get; set; }

    [Required]
    public int? Spirituality { get; set; }

    [Required]
    [Column("TV Action")]
    public int? TV_Action { get; set; }

    [Required]
    [Column("TV Comedies")]
    public int? TV_Comedies { get; set; }

    [Required]
    [Column("TV Dramas")]
    public int? TV_Dramas { get; set; }

    [Required]
    // [Column("Talk Shows TV Comedies")]
    public int? Talk_Shows_TV_Comedies { get; set; }

    [Required]
    public int? Thrillers { get; set; }
}
