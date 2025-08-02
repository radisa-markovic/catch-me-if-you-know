import { Component, OnInit } from '@angular/core';
import { Question } from '../../app.component';
import { FormsModule, NgForm } from '@angular/forms';
import { AnswersService } from '../../answers.service';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})
export class QuestionFormComponent implements OnInit {
  questionSet: Question[] = [];
  currentQuestionNumber: number = 0;
  answerTimer: number = 30;
  givenAnswers: string[] = [];
  enteredAnswer: string = "";
  stepsForward: number = 0;
  QUESTION_SET_LIMIT: number = 6;//zero-based index
  timerId: any;

  constructor(private answersService: AnswersService) {}

  async ngOnInit(): Promise<void> {
    this.answersService.currentQuestionSet.subscribe((questionSet) => {
      if(this.timerId) //to clear holdout intervals
        clearInterval(this.timerId);
      
      if(questionSet.length !== 0)
      {
        this.questionSet = questionSet;
        this.timerId = setInterval(() => {
          this.answerTimer--;
          if(this.answerTimer === 0 || this.currentQuestionNumber === this.QUESTION_SET_LIMIT)
          {
            clearInterval(this.timerId);   
          }
        }, 1_000);
      }
    });
  
  }

  playerCanStillAnswer(): boolean {
    return this.currentQuestionNumber < this.QUESTION_SET_LIMIT && this.answerTimer !== 0;
  }
  
  onAnswerGiven(form: NgForm) {
    if (this.currentQuestionNumber !== this.QUESTION_SET_LIMIT) {
      this.givenAnswers.push(form.value['enteredAnswer']);
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

  onPassQuestion() {
    this.givenAnswers.push("");
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

    this.questionSet?.forEach((question, questionNumber) => {
      if (
        this.givenAnswers[questionNumber] &&
        this.givenAnswers[questionNumber].toLowerCase().trim() === question.answer.toLowerCase()
      ) {
        this.stepsForward++;
      }
    });

    this.answersService.emitPlayerInfo({
      currentPlayerId: 0, //needs logic for dynamic selection later
      currentPlayerPosition: 0,
      numberOfCorrectAnswers: this.stepsForward
    });
    this.stepsForward = 0;
  }
}
