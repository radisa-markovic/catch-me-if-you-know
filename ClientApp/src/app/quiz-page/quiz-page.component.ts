import { Component, OnInit } from '@angular/core';
import { BoardComponent } from "../board/board.component";
import { QuestionFormComponent } from "../questionForm/question-form/question-form.component";
import { SignalRService } from '../signal-r.service';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [BoardComponent, QuestionFormComponent],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.css'
})
export class QuizPageComponent implements OnInit{
  public usernames: string[] = [];
  public loggedInUsername: string = this.signalRService.currentUsername;

  constructor(
    private signalRService: SignalRService
  ) { }

  ngOnInit(): void {
    this.signalRService.players$.subscribe(players => {
      console.log(players);
      this.usernames = Object.keys(players);
      // this.usernames = players.map(player => player.username);
    });
  }
}
