import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme } from './services/theme';
import { Loader } from './components/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isLoading = signal(true);

  constructor(public theme: Theme) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading.set(false);
    }, 3000);
  }

  toggleTheme(): void {
    this.theme.toggleTheme();
  }
}