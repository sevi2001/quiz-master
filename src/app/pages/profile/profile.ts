import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

interface QuizResult {
  name: string;
  avatar: string;
  score: number;
  total: number;
  category: string;
  difficulty?: string;
  level: string;
  date: string;
}

interface Achievement {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  get unlockedAchievementsCount(): number {
  return this.achievements.filter(a => a.unlocked).length;
}

  playerName = 'Guest Player';
  playerAvatar = '👤';
  playerLevel = 'Quiz Explorer';

  quizResults: QuizResult[] = [];

  totalXP = 0;
  totalQuizzes = 0;
  averageScore = 0;
  bestScore = 0;

  achievements: Achievement[] = [];

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    try {
      this.quizResults = JSON.parse(
        localStorage.getItem('quizResults') || '[]'
      );
    } catch {
      this.quizResults = [];
    }

    // Get saved player name
    const savedName = localStorage.getItem('playerName');

    if (savedName) {
      this.playerName = savedName;
    } else if (this.quizResults.length > 0) {
      this.playerName = this.quizResults[
        this.quizResults.length - 1
      ].name || 'Guest Player';
    }

    // Get avatar from latest quiz
    if (this.quizResults.length > 0) {
      const latestResult = this.quizResults[
        this.quizResults.length - 1
      ];

      this.playerAvatar = latestResult.avatar || '👤';
    }

    // Calculate statistics
    this.totalQuizzes = this.quizResults.length;

    this.totalXP = this.quizResults.reduce(
      (sum, result) => sum + (Number(result.score) || 0),
      0
    );

    const totalPossibleScore = this.quizResults.reduce(
      (sum, result) => sum + (Number(result.total) || 0),
      0
    );

    this.averageScore = totalPossibleScore > 0
      ? Math.round((this.totalXP / totalPossibleScore) * 100)
      : 0;

    this.bestScore = this.quizResults.reduce(
      (best, result) => Math.max(best, Number(result.score) || 0),
      0
    );

    // Calculate player level
    if (this.totalXP >= 20) {
      this.playerLevel = 'Quiz Master';
    } else if (this.totalXP >= 12) {
      this.playerLevel = 'Quiz Champion';
    } else if (this.totalXP >= 5) {
      this.playerLevel = 'Knowledge Expert';
    } else {
      this.playerLevel = 'Quiz Explorer';
    }

    // Create achievements
    this.loadAchievements();
  }

  loadAchievements(): void {
    this.achievements = [
      {
        icon: '🚀',
        title: 'First Step',
        description: 'Complete your first quiz',
        unlocked: this.totalQuizzes >= 1
      },
      {
        icon: '🔥',
        title: 'Quiz Addict',
        description: 'Complete 5 quizzes',
        unlocked: this.totalQuizzes >= 5
      },
      {
        icon: '⭐',
        title: 'Knowledge Expert',
        description: 'Earn 5 XP',
        unlocked: this.totalXP >= 5
      },
      {
        icon: '🏆',
        title: 'Quiz Champion',
        description: 'Earn 12 XP',
        unlocked: this.totalXP >= 12
      },
      {
        icon: '👑',
        title: 'Quiz Master',
        description: 'Earn 20 XP',
        unlocked: this.totalXP >= 20
      },
      {
        icon: '🎯',
        title: 'Perfect Score',
        description: 'Get every question correct in a quiz',
        unlocked: this.quizResults.some(
          result => result.total > 0 && result.score === result.total
        )
      }
    ];
  }

  formatDate(date: string): string {
    if (!date) {
      return 'Date unavailable';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

}