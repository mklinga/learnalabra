import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Words } from '../words';

@Component({
  selector: 'add-new-word',
  providers: [
    Words
  ],
  styleUrls: [ './add-new-word.component.scss' ],
  templateUrl: './add-new-word.component.html'
})

export class AddNewWordComponent {

  @Output('onAddNewWord') onAddNewWord = new EventEmitter();
  dialogIsOpen: boolean = false;
  data;

  constructor(public words: Words) {}

  ngOnInit () {
    this.data = { word: {}, sentence: {} };
  }

  openDialog (event) {
    event.preventDefault();
    this.dialogIsOpen = true;
  }

  onSubmit (form) {
    this.words.saveNewWord(this.data)
      .subscribe(response => {
        this.data = { word: {}, sentence: {} };
        this.dialogIsOpen = false;
        this.onAddNewWord.emit('saved');
      });
  }
}
