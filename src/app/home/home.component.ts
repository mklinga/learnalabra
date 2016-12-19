import { Component } from '@angular/core';

import { AppState } from '../app.service';
import { XLarge } from './x-large';
import { WordlistComponent } from './wordlist';

@Component({
  selector: 'home',
  styleUrls: [ './home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  words = { es: [], en: [] };
  viewLanguage = 'es';
  activeWordId = null;

  constructor(public appState: AppState) {}

  handleWordClick (wordId) {
    this.activeWordId = wordId;
  }
}
