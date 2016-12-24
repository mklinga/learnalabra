import { Component, ViewEncapsulation } from '@angular/core';

import { Users } from './user';

import { User } from './interfaces';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  providers: [
    Users
  ],
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <div class='container'>
      <nav>
        <span>
          <a [routerLink]=" ['./'] ">
            Words
          </a>
        </span>
        <span>
          <a [routerLink]=" ['./quiz'] ">
            Quiz
          </a>
        </span>
        <div class='user-name-box'>
          Heya, <span class='user-name'>{{ user.name }}</span>
        </div>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  user: User;

  constructor(private users: Users) {
    this.user = { id: -1, name: '', guesses: [] };
  }

  ngOnInit () {
    this.users.loadUserFromServer(1)
      .subscribe(user => {
        this.user = user.getValue();
      });
  }
}
