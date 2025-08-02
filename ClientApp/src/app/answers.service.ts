import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question } from './app.component';

interface PlayerInfo
{
  currentPlayerId: number,
  numberOfCorrectAnswers: number,
  currentPlayerPosition: number
}

@Injectable({
  providedIn: 'root'
})
export class AnswersService {
  url: string = "http://localhost:5100";
  questionSet: Question[] | undefined;

  private questionSetSource = new BehaviorSubject<Question[]>([]);
  public currentQuestionSet = this.questionSetSource.asObservable();

  private playerInfoSource = new BehaviorSubject<PlayerInfo>({
    currentPlayerId: -1,
    currentPlayerPosition: -1,
    numberOfCorrectAnswers: -1
  });

  public currentInfo = this.playerInfoSource.asObservable();

  constructor() { }

  async loadQuestions() {
    const result = await fetch(`${this.url}/questions`);
    let questions = await result.json();
    this.questionSetSource.next(questions);
    // this.questionSet = questions;
  }

  emitPlayerInfo(newInfo: PlayerInfo)
  {
    this.playerInfoSource.next(newInfo);
  }
}
