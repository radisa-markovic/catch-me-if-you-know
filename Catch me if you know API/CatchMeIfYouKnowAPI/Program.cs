using CatchMeIfYouKnowAPI.Data;
using CatchMeIfYouKnowAPI.Endpoints;

var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("sqlite");
builder.Services.AddSqlite<QuizDbContext>(connectionString);
builder.Services.AddCorsServices();

var app = builder.Build();

app.ApplyCorsConfig();
app.MapQuestionsEndpoints();
app.MigrateDb();
app.Run();