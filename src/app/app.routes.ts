import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Quiz } from './pages/quiz/quiz';
import { Result } from './pages/result/result';
import { Leaderboard } from './pages/leaderboard/leaderboard';
import { Profile } from './pages/profile/profile';
import { QuizInstructions } from './pages/quiz-instructions/quiz-instructions';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quiz', component: Quiz },
  { path: 'result', component: Result },
  { path: 'leaderboard', component: Leaderboard },
  { path: 'profile', component: Profile },
  { path: 'quiz-instructions', component: QuizInstructions },
 
  { path: '**', redirectTo: '' }
];