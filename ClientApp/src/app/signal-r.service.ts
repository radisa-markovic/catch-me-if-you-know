import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: HubConnection;
  private playerIdSubject: Subject<string> = new Subject<string>();
  public playerId$ = this.playerIdSubject.asObservable();
  
  constructor() 
  {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.API_BASE}/questionsHub`, {
        withCredentials: false
      })
      .build();
  }

  public async startConnection()
  {
    await this.hubConnection.start()
      .then(() => {
        console.log("SignalR connected");
        this.receiveIdFromServer();
      })
      .catch((error) => console.error("Error with connection: " + error))
  }

  public receiveIdFromServer()
  {
    this.hubConnection.on("SendIdToPlayer", (id) => {
      console.log("ID igraca: " + id);
      this.playerIdSubject.next(id);
    });
  }
}
