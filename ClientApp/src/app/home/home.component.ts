import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../signal-r.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [FormsModule],
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private signalRService: SignalRService,
    private router: Router
  ) { }

  async onNameEntered(name: string) {
    await this.signalRService.joinQuiz(name);
    this.router.navigate(['/quiz']);
  }
}
