namespace CatchMeIfYouKnowAPI.Dtos;

public record class PlayerDto(
    string Id,
    string Username,
    int Position,
    string Color
);