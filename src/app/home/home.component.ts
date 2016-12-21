import { Component } from '@angular/core';

import { XLarge } from './x-large';
import { WordlistComponent } from './wordlist';

import { Words } from './words';

@Component({
  selector: 'home',
  providers: [
    Words
  ],
  styleUrls: [ './home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  wordLists = { es: [], en: [] };
  loading: boolean = true;
  viewLanguage = 'es';
  activeWordId = null;

  constructor(public words: Words) {}

  ngOnInit() {
    this.words.loadWordsFromServer().subscribe(data => {
      this.loading = false;
      this.wordLists = this.words.getWordListsByLanguage();
    });
  }
}
