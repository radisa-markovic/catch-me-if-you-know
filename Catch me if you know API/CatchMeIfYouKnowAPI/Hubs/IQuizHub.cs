using System;
using System.Collections.Concurrent;
using CatchMeIfYouKnowAPI.Dtos;

namespace CatchMeIfYouKnowAPI.Hubs;

public interface IQuizHub
{
    Task InvalidUsername(string message);
    Task ConfirmPlayerJoined(string username);
    Task NewPlayerJoined(ConcurrentDictionary<string, PlayerDto> players);
}
