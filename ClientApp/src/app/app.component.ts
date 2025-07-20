import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

interface Question {
  id: number,
  content: string,
  answer: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {

  title = 'catch-me-if-you-know';
  url: string = "http://localhost:5100";
  questionSet: Question[] | undefined;
  currentQuestionNumber: number = 0;
  enteredAnswer: string = "";
  givenAnswers: string[] = [];
  answerTimer: number = 30;
  answerTimerId: any;
  stepsForward: number = 0;



  async loadQuestions() {
    const result = await fetch(`${this.url}/questions`);
    let questions = await result.json();
    this.questionSet = questions;
  }

  async ngOnInit() {
    await this.loadQuestions();
    this.answerTimerId = setInterval(() => {
      this.answerTimer--;
      if (!this.playerCanStillAnswer()) {
        console.log(this.answerTimer);
        clearInterval(this.answerTimerId);
        this.evaluateAnswers();
      }
    }, 1_000);
  }

  playerCanStillAnswer(): boolean {
    return this.currentQuestionNumber < 6 && this.answerTimer !== 0;
  }

  onAnswerGiven(form: NgForm) {
    if (this.currentQuestionNumber !== 5) {
      this.givenAnswers.push(form.value['enteredAnswer']);
      this.currentQuestionNumber++;
    }
    this.enteredAnswer = '';

    if (this.currentQuestionNumber === 5) {
      this.evaluateAnswers();
      this.currentQuestionNumber = 0;
    }
  }

  onPassQuestion() {
    this.givenAnswers.push("");
    this.currentQuestionNumber++;
  }

  evaluateAnswers() {
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

    alert("Broj tacnih odgovora: " + this.stepsForward);
  }
}