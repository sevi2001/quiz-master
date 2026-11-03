import { Component, OnInit } from '@angular/core';

interface Player {
  name: string;
  avatar: string;
  score: number;
  level: string;
}

interface QuizResult {
  name: string;
  avatar: string;
  score: number;
  total: number;
  category: string;
  level: string;
  date: string;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css'
})
export class Leaderboard implements OnInit {

  players: Player[] = [];
  filteredPlayers: Player[] = [];

  sortType = 'highest';
  searchText = '';

  // Get the top three players
  get topPlayers(): Player[] {
    return [...this.players]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  ngOnInit(): void {
    this.loadPlayers();
  }

  // Load quiz results from localStorage
  loadPlayers(): void {

    let savedResults: QuizResult[] = [];

    try {
      savedResults = JSON.parse(
        localStorage.getItem('quizResults') || '[]'
      );
    } catch (error) {
      console.error('Unable to load quiz results:', error);
    }

    const playerScores: Record<string, Player> = {};

    savedResults.forEach(result => {

      const playerName = result.name || 'Guest';

      if (!playerScores[playerName]) {
        playerScores[playerName] = {
          name: playerName,
          avatar: result.avatar || '👤',
          score: 0,
          level: 'Quiz Explorer'
        };
      }

      // Add correct answers from each quiz attempt
      playerScores[playerName].score += Number(result.score) || 0;

      // Update player level
      const totalScore = playerScores[playerName].score;

      if (totalScore >= 20) {
        playerScores[playerName].level = 'Quiz Master';
      } else if (totalScore >= 12) {
        playerScores[playerName].level = 'Quiz Champion';
      } else if (totalScore >= 5) {
        playerScores[playerName].level = 'Knowledge Expert';
      } else {
        playerScores[playerName].level = 'Quiz Explorer';
      }

    });

    this.players = Object.values(playerScores)
      .sort((a, b) => b.score - a.score);

    this.applyFilters();
  }

  // Search players
  searchPlayers(event: Event): void {

    this.searchText = (
      event.target as HTMLInputElement
    ).value.toLowerCase().trim();

    this.applyFilters();
  }

  // Change sorting
  changeSort(event: Event): void {

    this.sortType = (
      event.target as HTMLSelectElement
    ).value;

    this.applyFilters();
  }

  // Apply search and sorting
  applyFilters(): void {

    this.filteredPlayers = this.players.filter(player =>
      player.name.toLowerCase().includes(this.searchText)
    );

    if (this.sortType === 'highest') {

      this.filteredPlayers.sort(
        (a, b) => b.score - a.score
      );

    } else if (this.sortType === 'lowest') {

      this.filteredPlayers.sort(
        (a, b) => a.score - b.score
      );

    } else {

      this.filteredPlayers.sort(
        (a, b) => a.name.localeCompare(b.name)
      );

    }
  }

}