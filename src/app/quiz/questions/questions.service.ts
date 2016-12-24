import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

@Injectable()
export class Questions {

  constructor(public http: Http) {}

  loadQuestionsFromServer () {
    return this.http.get('http://localhost:3030/user/1/questions')
      .map(response => response.json());
  }
}
