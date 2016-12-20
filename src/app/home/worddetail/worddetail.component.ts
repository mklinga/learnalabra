import { Component, Input } from '@angular/core';

import { AppState } from '../../app.service';
import { Words } from '../words';

@Component({
  selector: 'word-detail',
  providers: [
    Words
  ],
  styleUrls: [ './worddetail.component.scss' ],
  templateUrl: './worddetail.component.html'
})

export class WordDetailComponent {

  @Input('id') wordId: number;
  currentWord;
  currentTranslation;

  constructor(public appState: AppState, public words: Words) {}

  ngOnInit () {
    this.currentWord = this.words.getWord(this.wordId);
    this.currentTranslation = this.words.findTranslation(this.wordId);
  }
}
