using CatchMeIfYouKnowAPI.Data;
using CatchMeIfYouKnowAPI.Dtos;
using CatchMeIfYouKnowAPI.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CatchMeIfYouKnowAPI.Endpoints;

public static class QuestionsEndpoint
{
    private static readonly string GetQuestionRoute = "getQuestion";

    public static RouteGroupBuilder MapQuestionsEndpoints(this WebApplication app)
    {
        var routeGroup = app.MapGroup("questions");

        routeGroup.MapGet("/", async (QuizDbContext dbContext) =>
        {
            var questions = await dbContext.Questions.ToListAsync();
            return Results.Ok(questions);
        });

        routeGroup.MapGet("/{id}", async (int id, QuizDbContext dbContext) =>
        {
            var question = await dbContext.Questions.FindAsync(id);

            if (question is not null)
                return Results.Ok(question);

            return Results.NotFound();
        }).WithName(GetQuestionRoute);

        routeGroup.MapPost("/", async (QuestionDto newQuestion, QuizDbContext dbContext) =>
        {
            Question question = new()
            {
                Content = newQuestion.Question,
                Answer = newQuestion.Answer,
            };
            await dbContext.Questions.AddAsync(question);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(
                GetQuestionRoute,
                new { id = newQuestion.Id },
                question
            );
        });

        return routeGroup;
    }
}
