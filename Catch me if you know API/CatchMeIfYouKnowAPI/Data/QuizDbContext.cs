using CatchMeIfYouKnowAPI.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatchMeIfYouKnowAPI.Data;

public class QuizDbContext(DbContextOptions<QuizDbContext> options)
    : DbContext(options)
{
    public DbSet<Question> Questions => Set<Question>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Question>().HasData(
            new
            {
                Id = 1,
                Content = "Najvisi vrh Evrope?",
                Answer = "Elbrus"
            },
            new
            {
                Id = 2,
                Content = "Najvisi vrh Azije?",
                Answer = "Mont Everest"
            },
            new
            {
                Id = 3,
                Content = "Najvisi vrh Afrike?",
                Answer = "Kilimandzaro"
            },
            new
            {
                Id = 4,
                Content = "Najvisi vrh Juzne Amerike?",
                Answer = "Akonkagva"
            },
            new
            {
                Id = 5,
                Content = "Najvisi vrh Severne Amerike?",
                Answer = "Denali/Makinli"
            },
            new
            {
                Id = 6,
                Content = "Najvisi vrh Okeanije?",
                Answer = "Koscusko"
            }
        );
    }
}
