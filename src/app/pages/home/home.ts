
import { Component, OnInit } from '@angular/core';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  exploreCategories(): void {
  document.getElementById('categories')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

  playerName = '';
  selectedDifficulty = 'easy';

  ngOnInit(): void {
    this.playerName = localStorage.getItem('playerName') || '';
    this.selectedDifficulty =
      localStorage.getItem('quizDifficulty') || 'easy';
  }

  constructor(public theme: Theme) {}

toggleTheme(): void {
  this.theme.toggleTheme();
}

  updatePlayerName(event: Event): void {
    this.playerName = (event.target as HTMLInputElement).value;
  }

  savePlayerName(): void {
    const name = this.playerName.trim();

    if (name.length < 2) {
      alert('Please enter at least 2 characters!');
      return;
    }

    this.playerName = name;
    localStorage.setItem('playerName', name);

    alert(`Welcome to QuizMaster, ${name}! 🎉`);
  }

  selectDifficulty(difficulty: string): void {
    this.selectedDifficulty = difficulty;

    localStorage.setItem('quizDifficulty', difficulty);
  }

}
