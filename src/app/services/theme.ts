import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Theme {

  isDarkMode = localStorage.getItem('quizTheme') === 'dark';

  constructor() {
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();

    localStorage.setItem(
      'quizTheme',
      this.isDarkMode ? 'dark' : 'light'
    );
  }

  applyTheme(): void {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }
}