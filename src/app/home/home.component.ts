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
  wordLists = { es: [], en: [] };
  relatedSentences = {};
  loading: boolean = true;

  constructor(public words: Words, public sentences: Sentences) {}

  ngOnInit() {
    this.refreshWords();
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
    });
  }
}
