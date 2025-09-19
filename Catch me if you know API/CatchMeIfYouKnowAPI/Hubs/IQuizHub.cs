using System;
using System.Collections.Concurrent;
using CatchMeIfYouKnowAPI.Dtos;

namespace CatchMeIfYouKnowAPI.Hubs;

public interface IQuizHub
{
    Task InvalidUsername(string message);
    Task ConfirmPlayerJoined(string username);
    Task NewPlayerJoined(ConcurrentDictionary<string, PlayerDto> players);
    Task StartGame(string usernameOfFirstPlayer, List<SentQuestionDto> questions);
    // the given answers should be a dictionary of questionId and given answers
    // or blank answer if none given (still counts as an answer)
    Task YouScored(int correctAnswers);
    Task PlayerSwitched(string usernameOfNextPlayer, List<SentQuestionDto> questions);
}
