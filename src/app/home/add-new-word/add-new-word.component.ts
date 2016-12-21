import { Component, Input } from '@angular/core';

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
      .subscribe(response => console.log(response));
  }
}
