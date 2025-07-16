using CatchMeIfYouKnowAPI.Data;
using CatchMeIfYouKnowAPI.Endpoints;

var builder = WebApplication.CreateBuilder(args);
string connectionString = builder.Configuration.GetConnectionString("sqlite");
builder.Services.AddSqlite<QuizDbContext>(connectionString);

var app = builder.Build();

app.MapQuestionsEndpoints();
app.MigrateDb();
app.Run();