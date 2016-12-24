import {
  inject,
  TestBed
} from '@angular/core/testing';

import {
  BaseRequestOptions,
  ConnectionBackend,
  Http
} from '@angular/http';

import { MockBackend } from '@angular/http/testing';
// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { Users } from './user';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BaseRequestOptions,
      MockBackend,
      {
        provide: Http,
        useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      },
      AppState,
      AppComponent,
      Users
    ]}));

  it('should have an user', inject([ AppComponent ], (app: AppComponent) => {
    expect(app.user).toBeDefined();
  }));

});
