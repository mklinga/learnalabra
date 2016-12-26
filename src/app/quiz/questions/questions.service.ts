import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Users } from '../../user';

import { Guess, User, QuestionWord } from '../../interfaces';

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

  saveGuessesToServer (guesses: Array<Guess>): Observable<any> {
    console.log('Saving the following guesses', guesses);
    const currentUser: BehaviorSubject<User> = this.users.getCurrentUser();
    return currentUser.flatMap(user => {
      return this.http.post(`http://localhost:3030/users/${user.id}/guesses`, { guesses });
    });
  }
}
