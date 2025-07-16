using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatchMeIfYouKnowAPI.Entities;

public class Question
{
    public int Id { get; set; }

    [MaxLength(60)]
    [Column(TypeName = "varchar(60)")]
    public required string Content { get; set; }

    [MaxLength(60)]
    [Column(TypeName = "varchar(60)")]
    public required string Answer { get; set; }
}
