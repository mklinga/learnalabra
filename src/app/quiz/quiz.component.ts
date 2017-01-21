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

  onQuizFinished (results) {
    this.totalAnswered += results.total;
    this.correctAnswers += results.correct;

    const percentage = (this.totalAnswered)
      ? ' (' + (+(100 * this.correctAnswers / this.totalAnswered).toFixed(2)) + '%)'
      : '';
    this.currentSessionInfo = `${this.correctAnswers} / ${this.totalAnswered}${percentage}`;
    this.loadQuestions();
  }
}
