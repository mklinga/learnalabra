import { Component } from '@angular/core';

import { Questions } from './questions';
import { Word, QuestionWord } from '../interfaces';

@Component({
  providers: [
    Questions
  ],
  selector: 'quiz',
  styleUrls: [ './quiz.component.scss' ],
  templateUrl: './quiz.component.html'
})
export class QuizComponent {

  currentQuestions: Array<QuestionWord> = [];
  correctAnswers: number = 0;
  totalAnswered: number = 0;
  currentSessionInfo: string = '';

  constructor(public questions: Questions) {}

  ngOnInit () {
    this.loadQuestions();
  }

  loadQuestions () {
    this.questions.loadQuestionsFromServer()
      .take(1)
      .subscribe(data => {
        this.currentQuestions = data;
      });
  }

  onQuizFinished (correctAnswer) {
    this.totalAnswered++;
    if (correctAnswer) {
      this.correctAnswers++;
    }
    this.currentSessionInfo = `${this.correctAnswers} / ${this.totalAnswered}`;
    this.loadQuestions();
  }
}
