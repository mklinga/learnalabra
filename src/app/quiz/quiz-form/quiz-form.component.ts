import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Guess, QuestionWord } from '../../interfaces';
import { Questions } from '../questions';

interface AnswerMap {
  [questionWordId: string]: any;
}

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
  checkResults = {};
  answers = {};
  @Input('questions') questions: Array<QuestionWord>;

  constructor(public questionService: Questions) {}

  makeQuestionMap (questions) {
    return questions.reduce((map, question) =>
      Object.assign(map, { [question.id]: question }), {});
  }

  checkAnswers (questions, guesses): Observable<AnswerMap> {
    const correctAnswerMap = Object.keys(guesses).reduce((result, key) => {
      const isCorrect = !!questions[key].translations
        .find(translation => guesses[key] === translation.value);

      return Object.assign(result, { [key]: isCorrect });
    }, {});

    const guessesToSave: Array<Guess> = Object.keys(guesses).map(key => {
      return { wordId: questions[key].word.id, correct: correctAnswerMap[key] };
    });

    return this.questionService.saveGuessesToServer(guessesToSave)
      .map(() => correctAnswerMap);
  }

  onSubmit(form) {
    this.checkAnswers(this.makeQuestionMap(this.questions), form.value)
      .take(1)
      .subscribe(checkResults => {
        this.checkResults = checkResults;
        this.hasBeenChecked = true;
      });
  }
}
