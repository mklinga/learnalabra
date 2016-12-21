import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

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

  @ViewChild('firstInput') firstInput;

  dialogIsOpen: boolean = false;
  addMultiple: boolean = false;
  needsResetFocus: boolean = true;
  data;

  constructor(public words: Words) {}

  ngOnInit () {
    this.data = { word: {}, sentence: {} };
  }

  openDialog (event) {
    event.preventDefault();
    this.needsResetFocus = true;
    this.dialogIsOpen = true;
  }

  ngAfterViewChecked() {
    if (this.needsResetFocus && this.firstInput) {
      this.firstInput.nativeElement.focus();
      this.needsResetFocus = false;
    }
  }

  onSubmit (form) {
    this.words.saveNewWord(this.data)
      .subscribe(response => {
        this.data = { word: {}, sentence: {} };
        if (this.addMultiple) {
          this.firstInput.nativeElement.focus();
        } else {
          this.dialogIsOpen = false;
        }
        this.onAddNewWord.emit('saved');
      });
  }
}
