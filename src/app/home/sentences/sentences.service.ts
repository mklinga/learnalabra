import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

let SENTENCES = [];

@Injectable()
export class Sentences {

  constructor(private http: Http) {}

  setSentences (sentences) {
    SENTENCES = sentences;
    return SENTENCES;
  }

  setSentencesFromResponse (response) {
    const body = response.json();
    return this.setSentences(body);
  }

  loadSentencesFromServer () {
    return this.http.get('http://localhost:3030/sentences')
      .map(this.setSentencesFromResponse.bind(this));
  }

  getSentenceListsByLanguage() {
    return SENTENCES
      .reduce((result, sentence) => {
        result[sentence.lang] = result[sentence.lang] || [];
        result[sentence.lang].push(sentence);
        return result;
      }, {});
  }

  getSentences(ids?: Array<number>) {
    return ids ? SENTENCES.filter(sentence => ids.indexOf(sentence.id) !== -1) : SENTENCES;
  }

  findTranslation(id: number) {
    return SENTENCES.find(sentence => sentence.translation === id);
  }
}
