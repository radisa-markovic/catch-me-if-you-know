import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../environments/environment.development';
import { BehaviorSubject, Subject } from 'rxjs';
import { Question } from './app.component';

interface Player
{
  id: string;
  username: string;
  color?: string;
  position?: number;
}

enum ServerQuizMethods
{
  SendIdToPlayer = "SendIdToPlayer",
  ConfirmPlayerJoined = "ConfirmPlayerJoined",
  NewPlayerJoined = "NewPlayerJoined",
  StartGame = "StartGame",
  YouScored = "YouScored",
  PlayerSwitched = "PlayerSwitched"
}

enum InvokableQuizMethods
{
  JoinQuiz = "JoinQuiz",
  EvaluateAnswers = "EvaluateAnswers",
  SwitchPlayer = "SwitchPlayer"
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  public currentUsername: string = "";

  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$ = this.playersSubject.asObservable();
  private gameHasStartedSubject = new BehaviorSubject<boolean>(false);
  public gameHasStarted$ = this.gameHasStartedSubject.asObservable();
  private userWhoIsAnswerring = new BehaviorSubject<string>('');
  public userWhoIsAnswerring$ = this.userWhoIsAnswerring.asObservable();
  private fieldMovementSubject = new Subject<number>();
  public fieldMovement$ = this.fieldMovementSubject.asObservable();
  private questionsSubject = new BehaviorSubject<Question[]>([]);
  public questions$ = this.questionsSubject.asObservable();
    
  constructor() 
  {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.API_BASE}/questionsHub`, {
        withCredentials: false
      })
      .withAutomaticReconnect()
      .build();

    this.setupSignalREvents();
    this.startConnection();
  }

  private setupSignalREvents()
  {
    this.onQuizJoined();
    this.onPlayerJoined();
    this.onGameStarted();
    this.onAnswerEvaluationDone();
    this.onPlayerSwitched();
  }

  private async startConnection()
  {
    await this.hubConnection.start()
      .then(() => {
        console.log("SignalR connected");
      })
      .catch((error) => console.error("Error with connection: " + error))
  }

  public async joinQuiz(username: string)
  {
    await this.hubConnection.invoke(InvokableQuizMethods.JoinQuiz, username);
    this.currentUsername = username;
  }

  public async onPlayerJoined()
  {
    this.hubConnection.on(ServerQuizMethods.NewPlayerJoined, (players: Player[]) => {
      console.log(players);
      this.playersSubject.next(players);
    });
  }

  public async onQuizJoined()
  {
    this.hubConnection.on(ServerQuizMethods.ConfirmPlayerJoined, (username: string) => {
      console.log("Uspesno ste se pridruzili kvizu kao: " + username);
      this.currentUsername = username;
    });
  }

  public async onGameStarted(): Promise<void>
  {
    this.hubConnection.on(ServerQuizMethods.StartGame, (firstPlayersUsername: string, questions: Question[]) => {
      console.log("Igra je pocela!");
      console.log("Prvi igrac je: " + firstPlayersUsername);
      // depending on the username, client should have a different view
      // depending on whether they are currently answerting the question or waiting
      this.gameHasStartedSubject.next(true);
      this.userWhoIsAnswerring.next(firstPlayersUsername);
      console.log(questions);
      this.questionsSubject.next(questions);
    });
  }

  public async onAnswerEvaluationDone(): Promise<void>
  {
    this.hubConnection.on(ServerQuizMethods.YouScored, (correctAnswerCount: number) => {
      console.log("Odgovori su evaluirani!");
      console.log("Tacan broj odgovora je: " + correctAnswerCount);
      // depending on the username, client should have a different view
      // depending on whether they are currently answerting the question or waiting
      this.fieldMovementSubject.next(correctAnswerCount);
      this.switchPlayer();
      // after this, the userWhoIsAnswerring should be updated to the next player
      // this is handled in the backend, so we just need to listen for the StartGame event again
    })
  }

  public async submitAnswers(username: string, answers: {id: number, givenAnswer: string}[])
  {
    await this.hubConnection.invoke(
      InvokableQuizMethods.EvaluateAnswers,
      username,
      answers
    );
  }

  public async switchPlayer()
  {
    await this.hubConnection.invoke(InvokableQuizMethods.SwitchPlayer);
  }

  public async onPlayerSwitched(): Promise<void>
  {
    this.hubConnection.on(ServerQuizMethods.PlayerSwitched, (nextPlayer: string, questions: Question[]) => {
      console.log("Sledeci igrac je: " + nextPlayer);
      this.userWhoIsAnswerring.next(nextPlayer);
      // send the new questions to the component that handles displaying them
      // this can be done via a Subject in a shared service
      // or via an EventEmitter in the component that handles displaying them
      // for simplicity, we'll use a Subject in this service
      // and the component can subscribe to it
      // this.questionsSubject.next(questions);
      console.log(questions);
      this.questionsSubject.next(questions);
    });    
  }
}
