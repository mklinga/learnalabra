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

  @Output() onWordClick = new EventEmitter();
  constructor(public appState: AppState, public words: Words) { }

  ngOnInit() {
    this.wordLists = this.words.getWordListsByLanguage();
    console.log(this.wordLists);
  }

  onClick (id) {
    this.onWordClick.emit(id);
  }
}
