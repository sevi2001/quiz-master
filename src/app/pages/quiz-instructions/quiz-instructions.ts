
import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quiz-instructions',
  standalone: true,
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './quiz-instructions.html',
  styleUrl: './quiz-instructions.css',
})
export class QuizInstructions implements OnInit {

  category = 'technology';
  difficulty = 'easy';
  questionCount = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.category =
      this.route.snapshot.queryParamMap.get('category') || 'technology';

    this.difficulty =
      this.route.snapshot.queryParamMap.get('difficulty') || 'easy';

    const validDifficulties = ['easy', 'medium', 'hard'];

    if (!validDifficulties.includes(this.difficulty)) {
      this.difficulty = 'easy';
    }

    const questionCounts: { [key: string]: number } = {
      technology: 5,
      science: 5,
      general: 5,
      mathematics: 5
    };

    this.questionCount = questionCounts[this.category] || 5;
  }

  get categoryName(): string {
    if (this.category === 'general') {
      return 'General Knowledge';
    }

    return this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }

  get timePerQuestion(): number {
    if (this.difficulty === 'easy') return 20;
    if (this.difficulty === 'medium') return 15;
    return 10;
  }

  beginQuiz(): void {
    localStorage.setItem('quizDifficulty', this.difficulty);

    this.router.navigate(['/quiz'], {
      queryParams: {
        category: this.category,
        difficulty: this.difficulty
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
