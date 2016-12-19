/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <div class='container'>
      <nav>
        <span>
          <a [routerLink]=" ['./'] ">
            Index
          </a>
        </span>
      </nav>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  name = 'Learn the word';

  constructor(
    public appState: AppState) {
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}
