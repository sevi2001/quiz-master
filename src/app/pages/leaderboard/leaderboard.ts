
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

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {

    const savedResults: QuizResult[] = JSON.parse(
      localStorage.getItem('quizResults') || '[]'
    );

    // Group quiz attempts by player name
    const playerScores: Record<string, Player> = {};

    savedResults.forEach(result => {

      if (!playerScores[result.name]) {
        playerScores[result.name] = {
          name: result.name,
          avatar: result.avatar,
          score: 0,
          level: result.level
        };
      }

      // Add points for each correct answer
      playerScores[result.name].score += result.score;

      // Update player level
      const totalScore = playerScores[result.name].score;

      if (totalScore >= 20) {
        playerScores[result.name].level = 'Quiz Master';
      } else if (totalScore >= 12) {
        playerScores[result.name].level = 'Quiz Champion';
      } else if (totalScore >= 5) {
        playerScores[result.name].level = 'Knowledge Expert';
      } else {
        playerScores[result.name].level = 'Quiz Explorer';
      }

    });

    this.players = Object.values(playerScores);

    this.applyFilters();
  }

  searchPlayers(event: Event): void {

    this.searchText = (
      event.target as HTMLInputElement
    ).value.toLowerCase();

    this.applyFilters();
  }

  changeSort(event: Event): void {

    this.sortType = (
      event.target as HTMLSelectElement
    ).value;

    this.applyFilters();
  }

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
