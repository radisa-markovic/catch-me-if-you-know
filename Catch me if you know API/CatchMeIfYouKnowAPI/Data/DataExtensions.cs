using Microsoft.EntityFrameworkCore;

namespace CatchMeIfYouKnowAPI.Data;

public static class DataExtensions
{
    public static void MigrateDb(this WebApplication app)
    {
        var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<QuizDbContext>();
        dbContext.Database.Migrate();
    }
}
