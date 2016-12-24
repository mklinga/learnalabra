import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Users } from '../../user';

@Injectable()
export class Questions {

  constructor(public http: Http, public users: Users) {}

  loadQuestionsFromServer () {
    const currentUser = this.users.getCurrentUser();
    return currentUser.flatMap(user => {
      return (user.id !== -1)
        ? this.http.get(`http://localhost:3030/users/${user.id}/questions`)
          .map(response => response.json())
        : [];
    });
  }
}
