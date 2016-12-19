import { Injectable } from '@angular/core';

const WORDS = require('assets/words.json');

@Injectable()
export class Words {

  constructor() {
  }

  getWordListsByLanguage() {
    return WORDS.reduce((result, word) => {
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
