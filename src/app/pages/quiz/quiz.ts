import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TitleCasePipe, DecimalPipe } from '@angular/common';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizResult {
  name: string;
  avatar: string;
  score: number;
  total: number;
  category: string;
  difficulty: string;
  level: string;
  date: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css'
})
export class Quiz implements OnInit, OnDestroy {

  difficulty = 'easy';

  // Sound settings
  soundEnabled = true;
  private audioContext?: AudioContext;

  // Question sets
  questionSets: Record<string, Question[]> = {

    technology: [
      {
        question: 'Which language is used to build Angular applications?',
        options: ['Python', 'TypeScript', 'Java', 'PHP'],
        answer: 'TypeScript'
      },
      {
        question: 'Which company maintains Angular?',
        options: ['Microsoft', 'Meta', 'Google', 'Amazon'],
        answer: 'Google'
      },
      {
        question: 'Which symbol is used for property binding in Angular?',
        options: ['()', '[]', '{}', '#'],
        answer: '[]'
      },
      {
        question: 'Which command starts an Angular development server?',
        options: ['ng build', 'ng serve', 'ng test', 'ng update'],
        answer: 'ng serve'
      },
      {
        question: 'What is an Angular component?',
        options: [
          'A database',
          'A reusable UI building block',
          'A programming language',
          'A web browser'
        ],
        answer: 'A reusable UI building block'
      }
    ],

    science: [
      {
        question: 'What planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
        answer: 'Mars'
      },
      {
        question: 'What is the chemical symbol for water?',
        options: ['CO2', 'O2', 'H2O', 'NaCl'],
        answer: 'H2O'
      },
      {
        question: 'Which gas do plants absorb?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
        answer: 'Carbon dioxide'
      },
      {
        question: 'What is the center of an atom called?',
        options: ['Electron', 'Nucleus', 'Proton', 'Neutron'],
        answer: 'Nucleus'
      },
      {
        question: 'How many bones are in an adult human body?',
        options: ['206', '201', '210', '196'],
        answer: '206'
      }
    ],

    general: [
      {
        question: 'What is the capital of Japan?',
        options: ['Seoul', 'Tokyo', 'Beijing', 'Bangkok'],
        answer: 'Tokyo'
      },
      {
        question: 'Which is the largest ocean?',
        options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
        answer: 'Pacific'
      },
      {
        question: 'How many continents are there?',
        options: ['5', '6', '7', '8'],
        answer: '7'
      },
      {
        question: 'Which country is famous for the Eiffel Tower?',
        options: ['Italy', 'France', 'Germany', 'Spain'],
        answer: 'France'
      },
      {
        question: 'Who wrote Romeo and Juliet?',
        options: [
          'Charles Dickens',
          'William Shakespeare',
          'Mark Twain',
          'Jane Austen'
        ],
        answer: 'William Shakespeare'
      }
    ],

    mathematics: [
      {
        question: 'What is 15 × 4?',
        options: ['45', '50', '60', '65'],
        answer: '60'
      },
      {
        question: 'What is the square root of 81?',
        options: ['7', '8', '9', '10'],
        answer: '9'
      },
      {
        question: 'What is 100 ÷ 5?',
        options: ['10', '15', '20', '25'],
        answer: '20'
      },
      {
        question: 'What is 25 + 37?',
        options: ['52', '62', '72', '57'],
        answer: '62'
      },
      {
        question: 'How many sides does a hexagon have?',
        options: ['5', '6', '7', '8'],
        answer: '6'
      }
    ]
  };

  questions: Question[] = this.questionSets['technology'];

  categoryName = 'Technology';

  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;

  score = 0;
  timeLeft = 20;
  completed = false;

  private timerId?: ReturnType<typeof setInterval>;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Progress percentage
  get progress(): number {
    return (
      ((this.currentQuestionIndex + 1) / this.questions.length) * 100
    );
  }

  // Check answer
  get isCorrect(): boolean {
    return this.selectedAnswer ===
      this.questions[this.currentQuestionIndex].answer;
  }

  // Time limit based on difficulty
  get timeLimit(): number {
    switch (this.difficulty) {
      case 'easy':
        return 20;

      case 'medium':
        return 15;

      case 'hard':
        return 10;

      default:
        return 20;
    }
  }

  // Initialize quiz
  ngOnInit(): void {

    const category =
      this.route.snapshot.queryParamMap.get('category') || 'technology';

    const normalizedCategory =
      category === 'general-knowledge' ? 'general' : category.toLowerCase();

    this.questions =
      this.questionSets[normalizedCategory] ||
      this.questionSets['technology'];

    this.categoryName =
      normalizedCategory.charAt(0).toUpperCase() +
      normalizedCategory.slice(1);

    const urlDifficulty =
      this.route.snapshot.queryParamMap.get('difficulty');

    const savedDifficulty =
      localStorage.getItem('quizDifficulty') || 'easy';

    const selectedDifficulty =
      urlDifficulty || savedDifficulty;

    if (
      selectedDifficulty === 'easy' ||
      selectedDifficulty === 'medium' ||
      selectedDifficulty === 'hard'
    ) {
      this.difficulty = selectedDifficulty;
    } else {
      this.difficulty = 'easy';
    }

    localStorage.setItem('quizDifficulty', this.difficulty);

    this.timeLeft = this.timeLimit;

    this.startTimer();
  }

  // Enable or disable quiz sounds
  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;

    if (this.soundEnabled) {
      this.playSound('correct');
    }
  }

  // Play sound effects using Web Audio API
  playSound(
    type: 'correct' | 'wrong' | 'timeout' | 'complete'
  ): void {

    if (!this.soundEnabled) {
      return;
    }

    try {

      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const context = this.audioContext;

      if (context.state === 'suspended') {
        context.resume();
      }

      const now = context.currentTime;

      let frequencies: number[] = [];
      let durations: number[] = [];
      let gap = 0.08;

      switch (type) {

        case 'correct':
          frequencies = [660, 880];
          durations = [0.12, 0.18];
          break;

        case 'wrong':
          frequencies = [220, 160];
          durations = [0.15, 0.2];
          break;

        case 'timeout':
          frequencies = [440, 330, 220];
          durations = [0.12, 0.12, 0.25];
          break;

        case 'complete':
          frequencies = [523, 659, 784, 1047];
          durations = [0.15, 0.15, 0.15, 0.35];
          gap = 0.12;
          break;
      }

      let startTime = now;

      frequencies.forEach((frequency, index) => {

        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'sine';

        oscillator.frequency.setValueAtTime(
          frequency,
          startTime
        );

        gainNode.gain.setValueAtTime(0.0001, startTime);

        gainNode.gain.exponentialRampToValueAtTime(
          0.2,
          startTime + 0.02
        );

        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + durations[index]
        );

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + durations[index]);

        startTime += durations[index] + gap;

      });

    } catch (error) {
      console.warn('Unable to play sound:', error);
    }
  }

  // Countdown timer
  startTimer(): void {

    if (this.timerId) {
      clearInterval(this.timerId);
    }

    this.timerId = setInterval(() => {

      if (this.timeLeft > 0) {

        this.timeLeft--;

      } else {

        this.playSound('timeout');
        this.nextQuestion();

      }

    }, 1000);
  }

  // Select answer
  selectAnswer(option: string): void {

    if (this.selectedAnswer !== null || this.completed) {
      return;
    }

    this.selectedAnswer = option;

    if (
      option === this.questions[this.currentQuestionIndex].answer
    ) {
      this.playSound('correct');
    } else {
      this.playSound('wrong');
    }
  }

  // Move to next question
  nextQuestion(): void {

    if (
      this.selectedAnswer === null &&
      this.timeLeft > 0
    ) {
      return;
    }

    if (this.timerId) {
      clearInterval(this.timerId);
    }

    if (
      this.selectedAnswer ===
      this.questions[this.currentQuestionIndex].answer
    ) {
      this.score++;
    }

    if (
      this.currentQuestionIndex <
      this.questions.length - 1
    ) {

      this.currentQuestionIndex++;

      this.selectedAnswer = null;

      this.timeLeft = this.timeLimit;

      this.startTimer();

    } else {

      this.completed = true;

      // Celebration sound
      this.playSound('complete');

      const savedResults: QuizResult[] = JSON.parse(
        localStorage.getItem('quizResults') || '[]'
      );

      const playerName =
        localStorage.getItem('playerName') || 'Guest';

      const newResult: QuizResult = {
        name: playerName,
        avatar: '👤',
        score: this.score,
        total: this.questions.length,
        category: this.categoryName,
        difficulty: this.difficulty,
        level:
          this.score >= 4
            ? 'Quiz Champion'
            : 'Quiz Explorer',
        date: new Date().toISOString()
      };

      savedResults.push(newResult);

      localStorage.setItem(
        'quizResults',
        JSON.stringify(savedResults)
      );

      this.router.navigate(['/result'], {
        state: {
          score: this.score,
          total: this.questions.length,
          category: this.categoryName,
          difficulty: this.difficulty
        }
      });

    }
  }

  // Navigate to results page
  goToResults(): void {
    this.router.navigate(['/result'], {
      state: {
        score: this.score,
        total: this.questions.length,
        category: this.categoryName,
        difficulty: this.difficulty
      }
    });
  }

  // Clean up timer and audio
  ngOnDestroy(): void {

    if (this.timerId) {
      clearInterval(this.timerId);
    }

    if (this.audioContext) {
      this.audioContext.close();
    }

  }

}