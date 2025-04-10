using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("movies_titles")]
public class MovieTitle
{
    [Key]
    [Column("show_id")]
    public string? ShowId { get; set; }

    [Required]
    [Column("type")]
    public string Type { get; set; }

    [Required]
    [Column("title")]
    public string Title { get; set; }

    public string? Director { get; set; }

    public string? Cast { get; set; }

    public string? Country { get; set; }

    [Required]
    [Column("release_year")]
    public int? ReleaseYear { get; set; }

    public string? Rating { get; set; }

    [Required]
    public string Duration { get; set; }
    
    [Required]
    public string Description { get; set; }

    [Required]
    public bool Action { get; set; }

    [Required]
    public bool Adventure { get; set; }

    [Required]
    [Column("Anime Series International TV Shows")]
    public bool Anime_Series_International_TV_Shows { get; set; }

    [Required]
    [Column("British TV Shows Docuseries International TV Shows")]
    public bool British_TV_Shows_Docuseries_International_TV_Shows { get; set; }

    [Required]
    public bool Children { get; set; }

    [Required]
    public bool Comedies { get; set; }

    [Required]
    [Column("Comedies Dramas International Movies")]
    public bool Comedies_Dramas_International_Movies { get; set; }

    [Required]
    [Column("Comedies International Movies")]
    public bool Comedies_International_Movies { get; set; }

    [Required]
    [Column("Comedies Romantic Movies")]
    public bool Comedies_Romantic_Movies_ { get; set; }

    [Required]
    [Column("Crime TV Shows Docuseries")]
    public bool Crime_TV_Shows_Docuseries { get; set; }

    [Required]
    public bool Documentaries { get; set; }

    [Required]
    [Column("Documentaries International Movies")]
    public bool Documentaries_International_Movies { get; set; }

    [Required]
    public bool Docuseries { get; set; }

    [Required]
    public bool Dramas { get; set; }

    [Required]
    [Column("Dramas International Movies")]
    public bool Dramas_International_Movies { get; set; }

    [Required]
    [Column("Dramas Romantic Movies")]
    public bool Dramas_Romantic_Movies { get; set; }

    [Required]
    [Column("Family Movies")]
    public bool Family_Movies { get; set; }

    [Required]
    public bool Fantasy { get; set; }

    [Required]
    [Column("Horror Movies")]
    public bool Horror_Movies { get; set; }

    [Required]
    [Column("International Movies Thrillers")]
    public bool International_Movies_Thrillers { get; set; }

    [Required]
    [Column("International TV Shows Romantic TV Shows TV Dramas")]
    public bool International_TV_Shows_Romantic_TV_Dramas { get; set; }

    [Required]
    [Column("Kids' TV")]
    public bool KidsTV { get; set; }

    [Required]
    [Column("Language TV Shows")]
    public bool Language_TV_Shows { get; set; }

    [Required]
    public bool Musicals { get; set; }

    [Required]
    [Column("Nature TV")]
    public bool Nature_TV { get; set; }

    [Required]
    [Column("Reality TV")]
    public bool Reality_TV { get; set; }

    [Required]
    public bool Spirituality { get; set; }

    [Required]
    [Column("TV Action")]
    public bool TV_Action { get; set; }

    [Required]
    [Column("TV Comedies")]
    public bool TV_Comedies { get; set; }

    [Required]
    [Column("TV Dramas")]
    public bool TV_Dramas { get; set; }

    [Required]
    [Column("Talk Shows TV Comedies")]
    public bool Talk_Shows_TV_Comedies { get; set; }

    [Required]
    public bool Thrillers { get; set; }
}
