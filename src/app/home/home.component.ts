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

  constructor(public words: Words) {}

  ngOnInit() {
    this.refreshWords();
  }

  refreshWords () {
    this.loading = true;
    this.words.loadWordsFromServer().subscribe(data => {
      this.loading = false;
      this.wordLists = this.words.getWordListsByLanguage();
    });
  }
}
