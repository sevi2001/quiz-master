
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css'
})
export class Quiz implements OnInit, OnDestroy {

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
  timeLeft = 15;
  completed = false;

  private timerId?: ReturnType<typeof setInterval>;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get progress(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  get isCorrect(): boolean {
    return this.selectedAnswer ===
      this.questions[this.currentQuestionIndex].answer;
  }

  ngOnInit(): void {

    const category =
      this.route.snapshot.queryParamMap.get('category') || 'technology';

    this.questions =
      this.questionSets[category] || this.questionSets['technology'];

    this.categoryName =
      category.charAt(0).toUpperCase() + category.slice(1);

    this.startTimer();
  }

  startTimer(): void {
    this.timerId = setInterval(() => {

      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.nextQuestion();
      }

    }, 1000);
  }

  selectAnswer(option: string): void {
    if (this.selectedAnswer === null) {
      this.selectedAnswer = option;
    }
  }

  nextQuestion(): void {

    if (this.selectedAnswer === null && this.timeLeft > 0) {
      return;
    }

    clearInterval(this.timerId);

    if (
      this.selectedAnswer ===
      this.questions[this.currentQuestionIndex].answer
    ) {
      this.score++;
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {

      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      this.timeLeft = 15;

      this.startTimer();

    } else {
this.completed = true;

// Get previous quiz results
const savedResults = JSON.parse(
  localStorage.getItem('quizResults') || '[]'
);

// Create a new result
const newResult = {
  name: 'You',
  avatar: '👩🏻',
  score: this.score,
  total: this.questions.length,
  category: this.categoryName,
  level: this.score >= 4 ? 'Quiz Champion' : 'Quiz Explorer',
  date: new Date().toISOString()
};

// Save the new result
savedResults.push(newResult);

localStorage.setItem(
  'quizResults',
  JSON.stringify(savedResults)
);

// Navigate to results page
this.router.navigate(['/result'], {
  state: {
    score: this.score,
    total: this.questions.length,
    category: this.categoryName
  }
});

    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }

}
