namespace CatchMeIfYouKnowAPI.Dtos;

public record class NewPlayerDto(
    int Id,
    string Username,
    int Position,
    string Color
);