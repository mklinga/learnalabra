import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

let USER = {};

@Injectable()
export class Users {

  constructor(private http: Http) {}

  setUserFromResponse (response) {
    const body = response.json();
    USER = body;
    return USER;
  }

  loadUserFromServer (id) {
    return this.http.get(`http://localhost:3030/users/${id}`)
      .map(this.setUserFromResponse.bind(this));
  }

  getUser(id) {
    return USER;
  }
}

