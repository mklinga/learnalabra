import { Component, Input } from '@angular/core';

@Component({
  selector: 'wordlist',
  styleUrls: [ './wordlist.component.scss' ],
  templateUrl: './wordlist.component.html'
})
export class WordlistComponent {

  @Input('words') wordLists;
  @Input('sentences') relatedSentences;
  viewLanguage = 'es';

  constructor () {}
}
