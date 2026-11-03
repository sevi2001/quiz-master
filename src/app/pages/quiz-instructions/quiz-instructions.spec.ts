import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizInstructions } from './quiz-instructions';

describe('QuizInstructions', () => {
  let component: QuizInstructions;
  let fixture: ComponentFixture<QuizInstructions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizInstructions],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizInstructions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
