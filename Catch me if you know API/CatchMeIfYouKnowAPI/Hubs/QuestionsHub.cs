using System.Collections.Concurrent;
using CatchMeIfYouKnowAPI.Dtos;
using Microsoft.AspNetCore.SignalR;

namespace CatchMeIfYouKnowAPI.Hubs;

public class QuestionsHub : Hub<IQuizHub>
{
    private static ConcurrentDictionary<string, PlayerDto> ConnectedPlayers = new();
    private const int MaximumPlayersAllowed = 4;

    // public override async Task OnConnectedAsync()
    // {
    //     if (ConnectedPlayers.Count >= MaximumPlayersAllowed)
    //     {
    //         await Clients.Caller.SendAsync(ConnectionRejectedEvent, "Quiz is full");
    //         Context.Abort();
    //         return;
    //     }

    //     ConnectedPlayers.TryAdd(Context.ConnectionId, ConnectedPlayers.Count.ToString());
    //     PlayerOrder.Add(Context.ConnectionId);
    //     PlayerScores[Context.ConnectionId] = 0;
    //     await Clients.Caller.SendAsync(SendIdToPlayerEvent, ConnectedPlayers.Count.ToString());

    //     if (ConnectedPlayers.Count == MaximumPlayersAllowed)
    //     {
    //         await StartGame();
    //     }

    //     await base.OnConnectedAsync();
    // }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var connectionId = Context.ConnectionId;
        var player = ConnectedPlayers.Values.FirstOrDefault(player => player.Id == connectionId);
        if (player != null)
        {
            ConnectedPlayers.TryRemove(player.Username, out _);
        }

        return base.OnDisconnectedAsync(exception);
    }

    public async Task JoinQuiz(string username)
    {
        if (string.IsNullOrWhiteSpace(username) || username.Length < 3)
        {
            await Clients.Caller.InvalidUsername("Invalid username");
            Context.Abort();
            return;
        }

        ConnectedPlayers[username] = new PlayerDto(
            Id: Context.ConnectionId,
            Username: username,
            Position: ConnectedPlayers.Count + 1,
            Color: $"hsl({ConnectedPlayers.Count * 90 % 360}, 70%, 50%)"
        );
        await Clients.Caller.ConfirmPlayerJoined(username);
        await Clients.All.NewPlayerJoined(ConnectedPlayers);
    }
}
