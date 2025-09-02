import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: "quiz",
        component: QuizPageComponent
    }
];
