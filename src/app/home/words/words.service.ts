import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

let WORDS = [];

const stripArticle = word => {
  switch (word.lang) {
    case 'es':
      return word.replace(/^(la|el)\s*/i, '');
    case 'en':
      return word.replace(/^(a|the)\s*/i, '');
    default:
      return word;
  }
};

@Injectable()
export class Words {

  constructor(private http: Http) {}

  setWords (words) {
    WORDS = words;
    return WORDS;
  }

  setWordsFromResponse (response) {
    const body = response.json();
    return this.setWords(body);
  }

  loadWordsFromServer () {
    return this.http.get('http://localhost:3030/words')
      .map(this.setWordsFromResponse.bind(this));
  }

  saveNewWord (word) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('http://localhost:3030/words', word, options)
      .map(this.setWordsFromResponse.bind(this));
  }

  getWordListsByLanguage() {
    return WORDS
      .sort((a, b) => stripArticle(a.value).localeCompare(stripArticle(b.value)))
      .reduce((result, word) => {
        result[word.lang] = result[word.lang] || [];
        result[word.lang].push(word);
        return result;
      }, {});
  }

  getWord(id: number) {
    return WORDS.find(word => word.id === id);
  }

  findTranslation(id: number) {
    return WORDS.find(word => word.translation === id);
  }

}
