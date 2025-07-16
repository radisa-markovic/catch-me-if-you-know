namespace CatchMeIfYouKnowAPI.Dtos;

public record class QuestionDto(
    int Id,
    string Question,
    string Answer
);