import { Component, Output, EventEmitter } from '@angular/core';

import { AppState } from '../../app.service';
import { Words } from '../words';

@Component({
  selector: 'wordlist',
  providers: [
    Words
  ],
  styleUrls: [ './wordlist.component.scss' ],
  templateUrl: './wordlist.component.html'
})
export class WordlistComponent {
  wordLists = { es: [], en: [] };
  viewLanguage = 'es';
  loading = true;

  constructor(public appState: AppState, public words: Words) {}

  ngOnInit() {
    this.words.loadWordsFromServer().subscribe(data => {
      this.loading = false;
      this.wordLists = this.words.getWordListsByLanguage();
    });
  }
}
