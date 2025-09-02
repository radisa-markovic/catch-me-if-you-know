import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from "./board/board.component";
import { AnswersService } from './answers.service';
import { QuestionFormComponent } from "./questionForm/question-form/question-form.component";
import { HomeComponent } from "./home/home.component";

export interface Question {
  id: number,
  content: string,
  answer: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'catch-me-if-you-know';
  
  constructor(private answersService: AnswersService) {}

  async ngOnInit() {
    await this.answersService.loadQuestions();    
  }
}