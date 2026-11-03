import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-challenge',
  standalone: true,
  imports: [],
  templateUrl: './daily-challenge.html',
  styleUrl: './daily-challenge.css',
})
export class DailyChallenge {

  completed = localStorage.getItem('dailyChallengeCompleted') === new Date().toDateString();

  constructor(private router: Router) {}

  startChallenge(): void {
    if (this.completed) {
      return;
    }

    localStorage.setItem('quizDifficulty', 'medium');

    this.router.navigate(['/quiz'], {
      queryParams: {
        category: 'general',
        difficulty: 'medium',
        daily: 'true'
      }
    });
  }
}