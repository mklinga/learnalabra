import { Component } from '@angular/core';

import { Questions } from './questions';

@Component({
  providers: [
    Questions
  ],
  selector: 'quiz',
  styleUrls: [ './quiz.component.scss' ],
  templateUrl: './quiz.component.html'
})
export class QuizComponent {

  currentQuestions = [];

  constructor(public questions: Questions) {}

  ngOnInit () {
    this.questions.loadQuestionsFromServer()
      .subscribe(data => this.currentQuestions = data);
  }
}
