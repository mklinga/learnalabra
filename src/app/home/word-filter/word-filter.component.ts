import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'word-filter',
  styleUrls: [ './word-filter.component.scss' ],
  templateUrl: './word-filter.component.html'
})

export class WordFilterComponent {

  @Output('onFilterChange') onFilterChange = new EventEmitter();
  constructor() {}

  onFilterKeyUp (event) {
    this.onFilterChange.emit(event.target.value);
  }
}
