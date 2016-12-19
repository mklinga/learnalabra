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

  constructor(public appState: AppState, public words: Words) {
    console.log(this.wordId);
    if (this.wordId) {
      this.updateCurrentWord(this.wordId);
    }
  }

  updateCurrentWord(id: number) {
    this.currentWord = this.words.getWord(id);
    this.currentTranslation = this.words.findTranslation(id);
  }

  ngOnChanges(changes) {
    if (changes.wordId && changes.wordId.currentValue) {
      this.updateCurrentWord(changes.wordId.currentValue);
    }
  }

}
