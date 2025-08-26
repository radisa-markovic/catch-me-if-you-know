using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;

namespace CatchMeIfYouKnowAPI.Hubs;

public class QuestionsHub : Hub
{
    private static ConcurrentDictionary<string, string> ConnectedPlayers = new();
    private const int MaximumPlayersAllowed = 4;
    private const string ConnectionRejectedEvent = "ConnectionRejected";
    private const string SendIdToPlayerEvent = "SendIdToPlayer";

    public override async Task OnConnectedAsync()
    {
        if (ConnectedPlayers.Count >= MaximumPlayersAllowed)
        {
            await Clients.Caller.SendAsync(ConnectionRejectedEvent, "Quiz is full");
            Context.Abort();
            return;
        }

        ConnectedPlayers.TryAdd(Context.ConnectionId, ConnectedPlayers.Count.ToString());
        await Clients.Caller.SendAsync(SendIdToPlayerEvent, ConnectedPlayers.Count.ToString());
        await base.OnConnectedAsync();
    }

    
}
