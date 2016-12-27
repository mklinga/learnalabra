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

  onQuizFinished (value) {
    this.loadQuestions();
  }
}
