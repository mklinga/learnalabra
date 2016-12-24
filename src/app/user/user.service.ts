import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { User } from '../interfaces';

let USER = new BehaviorSubject<User>({ id: -1, name: '', guesses: [] });

@Injectable()
export class Users {

  constructor(private http: Http) {}

  setUserFromResponse (response) {
    const body = response.json();
    USER.next(body);
    return USER;
  }

  loadUserFromServer (id): Observable<BehaviorSubject<User>> {
    const request = this.http.get(`http://localhost:3030/users/${id}`);
    return request.map(value => {
      return this.setUserFromResponse(value);
    });
  }

  getCurrentUser() {
    return USER;
  }
}

