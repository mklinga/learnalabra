import { Component, Input } from '@angular/core';

@Component({
  selector: 'quiz-form',
  styleUrls: [ './quiz-form.component.scss' ],
  templateUrl: './quiz-form.component.html'
})
export class QuizFormComponent {

  @Input('questions') questions;

  constructor() {}
}
