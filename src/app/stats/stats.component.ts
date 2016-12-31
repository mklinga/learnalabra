import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { Users } from '../user';
import { Guess, User } from '../interfaces';

@Component({
  selector: 'stats',
  styleUrls: [ './stats.component.scss' ],
  templateUrl: './stats.component.html'
})
export class StatsComponent {

  guesses: Array<Guess> = [];
  rightGuesses: number;
  rightPercentage: string;

  constructor(public userService: Users) {}

  ngOnInit () {
    const currentUser: BehaviorSubject<User> = this.userService.getCurrentUser();

    currentUser.subscribe((user: User) => {
      this.guesses = user.guesses;
      this.rightGuesses = user.guesses.reduce((result: number, guess: Guess): number => {
        return result + (guess.correct ? 1 : 0);
      }, 0);

      this.rightPercentage = (this.guesses.length === 0)
        ? 'no answers yet'
        : +(100 * this.rightGuesses / this.guesses.length).toFixed(2) + '%';
    });
  }

  ngOnDestroy () {
    console.log('onDestroy');
  }

  ngAfterViewChecked () {
    console.log('afterViewChecked');
  }
}
