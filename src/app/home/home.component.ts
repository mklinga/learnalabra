import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { XLarge } from './x-large';
import { WordlistComponent } from './wordlist';

import { Sentences } from './sentences';
import { Words } from './words';

@Component({
  selector: 'home',
  providers: [
    Sentences,
    Words
  ],
  styleUrls: [ './home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  viewLanguage = 'es';
  wordLists = { es: [], en: [] };
  relatedSentences = {};
  loading: boolean = true;
  textFilter: string = '';

  filteredWordList = [];

  constructor(public words: Words, public sentences: Sentences) {}

  ngOnInit() {
    this.refreshWords();
  }

  onWordFilterChange (filter) {
    // Escape the string, as it's used in regexp
    this.textFilter = filter.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    this.updateFilteredWordList();
  }

  updateFilteredWordList () {
    const matcher = new RegExp(this.textFilter, 'i');
    this.filteredWordList = this.wordLists[this.viewLanguage]
      .filter(word => matcher.test(word.value));
  }

  refreshWords () {
    this.loading = true;
    Observable.forkJoin(
      this.words.loadWordsFromServer(),
      this.sentences.loadSentencesFromServer()
    )
    .subscribe(data => {
      this.loading = false;
      this.wordLists = this.words.getWordListsByLanguage();
      this.relatedSentences = this.words.getRelatedSentencesMap();
      this.updateFilteredWordList();
    });
  }
}
