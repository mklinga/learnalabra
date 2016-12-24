/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { Users } from './user';

/*
 * App Component
 * Top Level Component
 */
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
  user;

  constructor(private users: Users) {
    this.user = { name: '' };
    this.users.loadUserFromServer(1)
      .subscribe(user => { this.user = user; });
  }
}
