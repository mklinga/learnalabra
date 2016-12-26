import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AnswerMap, Guess, QuestionMap, QuestionWord } from '../../interfaces';
import { Questions } from '../questions';

@Component({
  selector: 'quiz-form',
  providers: [
    Questions
  ],
  styleUrls: [ './quiz-form.component.scss' ],
  templateUrl: './quiz-form.component.html'
})
export class QuizFormComponent {

  hasBeenChecked: boolean = false;
  checkResults: AnswerMap = {};
  answers = {};
  @Input('questions') questions: Array<QuestionWord>;

  constructor(public questionService: Questions) {}

  makeQuestionMap (questions): QuestionMap {
    return questions.reduce((map, question) =>
      Object.assign(map, { [question.id]: question }), {});
  }

  onSubmit(form) {
    this.questionService.checkAnswers(this.makeQuestionMap(this.questions), form.value)
      .take(1)
      .subscribe((checkResults: AnswerMap) => {
        this.checkResults = checkResults;
        this.hasBeenChecked = true;
      });
  }
}
