
import { Component, OnInit, OnDestroy } from '@angular/core';

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

  message = 'Keep Practicing!';
  feedback = 'Every challenge is a new opportunity to learn.';

  private animationId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    const result = history.state;

    this.score = Number(result.score ?? 0);
    this.total = Number(result.total ?? 5);

    if (this.total <= 0) {
      this.total = 5;
    }

    this.score = Math.min(this.total, Math.max(0, this.score));

    this.percentage = Math.round((this.score / this.total) * 100);

    this.setFeedback();
    this.animateScore();
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
      this.feedback = 'Youre doing great! Keep improving your knowledge.';
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
        clearInterval(this.animationId);
        return;
      }

      current++;
      this.displayedPercentage = current;
    }, 20);
  }

  ngOnDestroy(): void {
    clearInterval(this.animationId);
  }
}
