import { Component, OnInit } from '@angular/core';
import { Question } from '../../app.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AnswersService } from '../../answers.service';
import { SignalRService } from '../../signal-r.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})
export class QuestionFormComponent implements OnInit {
  questionSet: Question[] = [];
  currentQuestionNumber: number = 0;
  answerTimer: number = 30;
  givenAnswers: {id: number, givenAnswer: string}[] = [];
  enteredAnswer: string = "";
  QUESTION_SET_LIMIT: number = 6;//zero-based index
  timerId: any;

  playerId: number = -1;
  playerColor: string = "blue";

  constructor(
    private answersService: AnswersService,
    private signalRService: SignalRService
  ) {}

  async ngOnInit(): Promise<void> {
    this.signalRService.questions$.subscribe((questionSet) => {
      this.answerTimer = 30;
      this.currentQuestionNumber = 0;
      this.givenAnswers = [];

      if(this.timerId) //to clear holdout intervals
        clearInterval(this.timerId);
      
      if(questionSet.length !== 0)
      {
        this.questionSet = questionSet;
        this.timerId = setInterval(() => {
          this.answerTimer--;
          if(this.questionsAnsweredOrIntervalExpired())
          {
            clearInterval(this.timerId);   
          }
        }, 1_000);
      }
    });
  
  }

  questionsAnsweredOrIntervalExpired(): boolean {
    return this.currentQuestionNumber === this.QUESTION_SET_LIMIT || this.answerTimer === 0;
  }

  playerCanStillAnswer(): boolean {
    return this.currentQuestionNumber < this.QUESTION_SET_LIMIT && this.answerTimer !== 0;
  }
  
  onAnswerGiven(form: NgForm) {
    if (this.currentQuestionNumber !== this.QUESTION_SET_LIMIT) {
      this.givenAnswers.push({
        id: this.questionSet[this.currentQuestionNumber].id,
        givenAnswer: form.value['enteredAnswer']
      });
      this.currentQuestionNumber++;
    }
    this.enteredAnswer = '';

    if (this.currentQuestionNumber === this.QUESTION_SET_LIMIT) {
      this.evaluateAnswers();
      this.currentQuestionNumber = 0;
      if(this.timerId)
        clearInterval(this.timerId);
      // this.answersService.loadQuestions();
      this.answerTimer = 0;
      this.givenAnswers = [];
    }
  }

  onPassQuestion(id: number) {
    debugger;
    this.givenAnswers.push({
      id: id,
      givenAnswer: ""
    });
    this.currentQuestionNumber++;
  }

  evaluateAnswers() {
    if(this.timerId)
    {
      clearInterval(this.timerId);
      this.answerTimer = 0;
    }

    if (this.givenAnswers.length === 0) {
      alert("Nema tacnih odgovora");
      return;
    }

    this.signalRService.submitAnswers(
      this.signalRService.currentUsername,
      this.givenAnswers
    );
  }
}
