import { Component, Input } from '@angular/core';

import { QuestionWord } from '../../interfaces';

@Component({
  selector: 'quiz-form',
  styleUrls: [ './quiz-form.component.scss' ],
  templateUrl: './quiz-form.component.html'
})
export class QuizFormComponent {

  hasBeenChecked: boolean = false;
  checkResults = {};
  answers = {};
  @Input('questions') questions: Array<QuestionWord>;

  constructor() {}

  makeQuestionMap (questions) {
    return questions.reduce((map, question) =>
      Object.assign(map, { [question.id]: question }), {});
  }

  checkAnswers (questions, guesses) {
    return Object.keys(guesses).reduce((result, key) => {
      const isCorrect = !!questions[key].translations
        .find(translation => guesses[key] === translation.value);

      return Object.assign(result, { [key]: isCorrect });
    }, {});
  }

  onSubmit(form) {
    this.checkResults = this.checkAnswers(this.makeQuestionMap(this.questions), form.value);
    this.hasBeenChecked = true;
  }
}
