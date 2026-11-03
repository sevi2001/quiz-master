import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class Result implements OnInit, OnDestroy {

  score = 0;
  total = 5;
  percentage = 0;
  displayedPercentage = 0;

  category = 'technology';
  categoryName = 'Technology';
  difficulty = 'easy';
  difficultyName = 'Easy';

  message = 'Keep Practicing!';
  feedback = 'Every challenge is a new opportunity to learn.';

  private animationId?: ReturnType<typeof setInterval>;
  private audioContext?: AudioContext;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const result = history.state;

    this.score = Number(result.score ?? 0);
    this.total = Number(result.total ?? 5);

    if (this.total <= 0) {
      this.total = 5;
    }

    this.score = Math.min(this.total, Math.max(0, this.score));

    this.category = result.category || 'technology';
    this.difficulty = result.difficulty || 'easy';

    this.categoryName = this.getCategoryName(this.category);
    this.difficultyName = this.getDifficultyName(this.difficulty);

    this.percentage = Math.round((this.score / this.total) * 100);

    this.setFeedback();
    this.animateScore();
  }

  getCategoryName(category: string): string {
    const categories: Record<string, string> = {
      technology: 'Technology',
      science: 'Science',
      general: 'General Knowledge',
      'general-knowledge': 'General Knowledge',
      mathematics: 'Mathematics'
    };

    return categories[category] || 'Technology';
  }

  getDifficultyName(difficulty: string): string {
    const difficulties: Record<string, string> = {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard'
    };

    return difficulties[difficulty] || 'Easy';
  }

  setFeedback(): void {
    if (this.percentage === 100) {
      this.message = 'Perfect Score!';
      this.feedback = 'Absolutely incredible! You are a Quiz Champion! 🏆';
    } else if (this.percentage >= 80) {
      this.message = 'Excellent Work!';
      this.feedback = 'Amazing performance! You really know your stuff!';
    } else if (this.percentage >= 60) {
      this.message = 'Great Job!';
      this.feedback = 'You are doing great! Keep improving your knowledge.';
    } else if (this.percentage >= 40) {
      this.message = 'Good Effort!';
      this.feedback = 'You are getting there. Practice makes progress!';
    } else {
      this.message = 'Keep Practicing!';
      this.feedback = 'Every mistake helps you learn something new. Try again!';
    }
  }

  animateScore(): void {
    let current = 0;

    this.animationId = setInterval(() => {
      if (current >= this.percentage) {
        if (this.animationId) {
          clearInterval(this.animationId);
        }
        return;
      }

      current++;
      this.displayedPercentage = current;
    }, 20);
  }

  // Play victory melody when the user clicks the button
  playCelebrationSound(): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const context = this.audioContext;

      if (context.state === 'suspended') {
        void context.resume();
      }

      const melody = [
        { frequency: 523.25, duration: 0.22 },
        { frequency: 659.25, duration: 0.22 },
        { frequency: 783.99, duration: 0.22 },
        { frequency: 1046.50, duration: 0.40 },
        { frequency: 783.99, duration: 0.22 },
        { frequency: 1046.50, duration: 0.50 }
      ];

      let startTime = context.currentTime;

      melody.forEach((note) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(
          note.frequency,
          startTime
        );

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(
          0.18,
          startTime + 0.03
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + note.duration
        );

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);

        startTime += note.duration + 0.06;
      });

    } catch (error) {
      console.warn('Unable to play celebration sound:', error);
    }
  }

  retakeQuiz(): void {
    this.router.navigate(['/quiz'], {
      queryParams: {
        category: this.category,
        difficulty: this.difficulty
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      clearInterval(this.animationId);
    }

    if (this.audioContext) {
      void this.audioContext.close();
    }
  }
}