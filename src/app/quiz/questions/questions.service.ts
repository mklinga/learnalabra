import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Users } from '../../user';

import {
  AnswerMap,
  Guess,
  GuessError,
  GuessFormMap,
  QuestionMap,
  QuestionWord,
  User,
  Word
} from '../../interfaces';

function removeAccents (text: string): string {
  return text.toLowerCase()
    .replace(new RegExp('[àáâãäå]', 'g'), 'a')
    .replace(new RegExp('æ', 'g'), 'ae')
    .replace(new RegExp('ç', 'g'), 'c')
    .replace(new RegExp('[èéêë]', 'g'), 'e')
    .replace(new RegExp('[ìíîï]', 'g'), 'i')
    .replace(new RegExp('ñ', 'g'), 'n')
    .replace(new RegExp('[òóôõö]', 'g'), 'o')
    .replace(new RegExp('œ', 'g'), 'oe')
    .replace(new RegExp('[ùúûü]', 'g'), 'u')
    .replace(new RegExp('[ýÿ]', 'g'), 'y');
}

@Injectable()
export class Questions {

  constructor(public http: Http, public users: Users) {}

  loadQuestionsFromServer (): Observable<Array<QuestionWord>> {
    const currentUser: BehaviorSubject<User> = this.users.getCurrentUser();
    return currentUser.flatMap(user => {
      return (user.id !== -1)
        ? this.http.get(`http://localhost:3030/users/${user.id}/questions`)
          .map(response => response.json())
        : [];
    });
  }

  saveGuessesToServer (guesses: Array<Guess>): Observable<Response> {
    console.log('Saving the following guesses', guesses);
    const currentUser: BehaviorSubject<User> = this.users.getCurrentUser();
    return currentUser.flatMap(user => {
      return this.http.post(`http://localhost:3030/users/${user.id}/guesses`, { guesses });
    });
  }

  checkErrors (guess: string, question: QuestionWord) {
    const isCorrect = (text: string): boolean =>
      !!(question.translations.find((translation: Word) => text === translation.value));

    if (isCorrect(guess)) {
      return { wordId: question.word.id, correct: true };
    }

    // Check for bad accents on the answer
    const guessWithoutAccents = removeAccents(guess);
    if (isCorrect(guessWithoutAccents)) {
      return { wordId: question.word.id, correct: false, error: GuessError.ACCENT };
    }

    // TODO: Check for typos

    // Finally, let's return UNRECOGNIZED
    return { wordId: question.word.id, correct: false, error: GuessError.UNRECOGNIZED };
  }

  checkAnswers (questions: QuestionMap, guesses: GuessFormMap): Observable<AnswerMap> {
    const correctAnswerMap: AnswerMap = Object.keys(guesses).reduce((result, key) => {
      return Object.assign(
        result,
        { [key]: this.checkErrors(guesses[key], questions[key]) }
      );
    }, {});

    const guessesToSave: Array<Guess> = Object.keys(guesses).map(key => correctAnswerMap[key]);

    return this.saveGuessesToServer(guessesToSave)
      .map(() => correctAnswerMap);
  }
}
