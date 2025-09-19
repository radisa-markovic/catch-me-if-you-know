using System.Collections.Concurrent;
using CatchMeIfYouKnowAPI.Data;
using CatchMeIfYouKnowAPI.Dtos;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace CatchMeIfYouKnowAPI.Hubs;

public class QuestionsHub : Hub<IQuizHub>
{
    private static ConcurrentDictionary<string, PlayerDto> ConnectedPlayers = new();
    private const int MaximumPlayersAllowed = 1;
    private static List<string> PlayerOrder = new();
    private static int CurrentTurnIndex = 0;
    private QuizDbContext _dbContext;

    public QuestionsHub(QuizDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var connectionId = Context.ConnectionId;
        var player = ConnectedPlayers.Values.FirstOrDefault(player => player.Id == connectionId);
        if (player != null)
        {
            ConnectedPlayers.TryRemove(player.Username, out _);
            PlayerOrder.Remove(player.Username);
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
        if(!PlayerOrder.Contains(username))
            PlayerOrder.Add(username);

        await Clients.Caller.ConfirmPlayerJoined(username);
        await Clients.All.NewPlayerJoined(ConnectedPlayers);

        if (ConnectedPlayers.Count == MaximumPlayersAllowed)
        {
            // maybe add a logic of who goes first 
            Random random = new Random();
            // this needs to go in round robin fashion once first player is decided
            int firstPlayerToGo = random.Next(1, MaximumPlayersAllowed + 1);
            string usernameOfFirstPlayer = ConnectedPlayers.ElementAt(firstPlayerToGo - 1).Key;

            // or a countdown before starting the game on the client
            var questions = await _dbContext.Questions
                .Select(q => new SentQuestionDto(q.Id, q.Content))
                .Take(6)
                .ToListAsync();

            await Clients.All.StartGame(usernameOfFirstPlayer, questions);
        }
    }

    public async Task EvaluateAnswers(string username, GivenAnswerDto[] givenAnswers)
    {
        List<int> questionIds = givenAnswers.Select(answer => answer.Id).ToList();
        var questions = _dbContext.Questions
            .Where(q => questionIds.Contains(q.Id))
            .ToList();

        int correctAnswers = 0;
        for (int i = 0; i < questions.Count; i++)
        {
            if (questions[i].Answer.Equals(givenAnswers[i].GivenAnswer, StringComparison.OrdinalIgnoreCase))
            {
                correctAnswers++;
            }
        }

        await Clients.Caller.YouScored(correctAnswers);
    }

    public async Task SwitchPlayer()
    {
        if (PlayerOrder.Count == 0)
            return;

        // Advance turn index in round robin
        CurrentTurnIndex = (CurrentTurnIndex + 1) % PlayerOrder.Count;
        string nextPlayer = PlayerOrder[CurrentTurnIndex];

        var questions = await _dbContext.Questions
            .Select(q => new SentQuestionDto(q.Id, q.Content))
            .Take(6)
            .ToListAsync();

        await Clients.All.PlayerSwitched(nextPlayer, questions);
    }
}
