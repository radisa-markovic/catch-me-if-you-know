import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../environments/environment.development';
import { BehaviorSubject, Subject } from 'rxjs';

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
  NewPlayerJoined = "NewPlayerJoined"
}

enum InvokableQuizMethods
{
  JoinQuiz = "JoinQuiz"
}

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  public currentUsername: string = "";

  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$ = this.playersSubject.asObservable();
  
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
}
