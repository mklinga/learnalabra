import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from '@angular/http';

import { Sentences } from '../sentences';

let WORDS = [];

const stripArticle = (lang: string, word: string) => {
  switch (lang) {
    case 'es':
      return word.replace(/^(la|el)\s+/i, '');
    case 'en':
      return word.replace(/^(a|the)\s+/i, '');
    default:
      return word;
  }
};

@Injectable()
export class Words {

  constructor(public http: Http, private sentences: Sentences) {}

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

  saveNewWord (content) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    const { word, sentence } = content;

    return Observable.forkJoin(
      this.http.post('http://localhost:3030/words', word, options),
      this.http.post('http://localhost:3030/sentences', sentence, options)
    )
    .flatMap(data => {
      const words = data[0].json();
      const sentences = data[1].json();

      return this.http.post(
        'http://localhost:3030/bind-words-and-sentences',
        { words, sentences },
        options
      );
    });
  }

  getWordListsByLanguage() {
    return WORDS
      .sort((a, b) => stripArticle(a.lang, a.value).localeCompare(stripArticle(b.lang, b.value)))
      .reduce((result, word) => {
        result[word.lang] = result[word.lang] || [];
        result[word.lang].push(word);
        return result;
      }, {});
  }

  getWord(id: number) {
    return WORDS.find(word => word.id === id);
  }

  getRelatedSentencesMap () {
    return WORDS.reduce((result, word) => {
      return Object.assign(result, { [word.id]: this.sentences.getSentences(word.sentences) });
    }, {});
  }

  findTranslations(id: number) {
    return WORDS.filter(word => word.translations.indexOf(id) !== -1);
  }

  getRelatedSentences (ids: Array<number>) {
    return this.sentences.getSentences(ids);
  }

  findByValue (value: string) {
    return WORDS.find(word => word.value.toLowerCase() === value.toLowerCase());
  }
}
