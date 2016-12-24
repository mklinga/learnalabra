import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

let USER = new BehaviorSubject({ id: -1, name: '', guesses: [] });

@Injectable()
export class Users {

  constructor(private http: Http) {}

  setUserFromResponse (response) {
    const body = response.json();
    USER.next(body);
    return USER;
  }

  loadUserFromServer (id) {
    return this.http.get(`http://localhost:3030/users/${id}`)
      .map(this.setUserFromResponse.bind(this));
  }

  getCurrentUser() {
    return USER;
  }
}

