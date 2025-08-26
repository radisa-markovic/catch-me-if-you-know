using CatchMeIfYouKnowAPI.Data;
using CatchMeIfYouKnowAPI.Endpoints;
using CatchMeIfYouKnowAPI.Hubs;


var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("sqlite");
builder.Services.AddSqlite<QuizDbContext>(connectionString);
builder.Services.AddCorsServices();
builder.Services.AddSignalR();

var app = builder.Build();

app.ApplyCorsConfig();
app.MapQuestionsEndpoints();
app.MigrateDb();
app.MapHub<QuestionsHub>("/questionsHub");
app.Run();