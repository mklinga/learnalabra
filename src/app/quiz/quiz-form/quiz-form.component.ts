import { ViewChildren, Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AnswerMap, Guess, GuessFormMap, QuestionMap, QuestionWord } from '../../interfaces';
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
  needsResetFocus: boolean = true;
  @Input('questions') questions: Array<QuestionWord>;
  @Output('done') quizDone = new EventEmitter();
  @ViewChildren('answerInput') answerInput;

  constructor(public questionService: Questions) {}

  ngOnChanges (changes: SimpleChanges) {
    // We reset the hasBeenChecked/checkResults when we get new questions
    this.hasBeenChecked = false;
    this.checkResults = {};
    this.needsResetFocus = true;
  }

  ngAfterViewChecked() {
    if (this.needsResetFocus && this.answerInput && this.answerInput.first) {
      setTimeout(() => {
        this.answerInput.first.nativeElement.focus();
        this.needsResetFocus = false;
      });
    }
  }

  makeQuestionMap (questions): QuestionMap {
    return questions.reduce((map, question) =>
      Object.assign(map, { [question.id]: question }), {});
  }

  onSubmit(form) {

    const done = (answers): void => {
      const finalResults = Object.keys(answers).reduce((result, key) => {
        result.total++;
        result.correct += answers[key].correct ? 1 : 0;
        return result;
      }, { correct: 0, total: 0 });

      this.answers = {};
      this.quizDone.emit(finalResults);
    };

    const guesses: GuessFormMap = form.value;
    const correctAnswers: AnswerMap = this.questionService
      .checkAnswers(this.makeQuestionMap(this.questions), guesses);

    const allCorrect: boolean = Object
      .keys(correctAnswers)
      .reduce((result: boolean, key: string) => result && correctAnswers[key].correct, true);

    if (!this.hasBeenChecked) {
      const guessesToSave: Array<Guess> = Object
        .keys(guesses)
        .map(key => correctAnswers[key]);

      this.questionService
        .saveGuessesToServer(guessesToSave)
        .subscribe(() => {
          if (allCorrect) {
            done(correctAnswers);
          } else {
            // The results are checked, but we still have some errors in the form
            this.checkResults = correctAnswers;
            this.hasBeenChecked = true;
            this.needsResetFocus = true;
          }
        });
    } else if (allCorrect) {
      done(this.checkResults);
    }

    // Clean up wrong answers
    Object.keys(correctAnswers).forEach((key: string) => {
      if (!correctAnswers[key].correct) {
        this.answers[key] = '';
      }
    });

  }

  showQuestionStats(statistics) {
    // add one to the total if has been checked
    const total = statistics.guesses.length + (this.hasBeenChecked ? 1 : 0);

    return (total === 0) ? 'no answers yet' : `${+(100 * statistics.correct / total).toFixed(2)}%`;
  }
}
