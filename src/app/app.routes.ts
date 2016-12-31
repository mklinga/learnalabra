import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { QuizComponent } from './quiz';
import { StatsComponent } from './stats';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'quiz',      component: QuizComponent },
  { path: 'stats',      component: StatsComponent },
  { path: '**',    component: NoContentComponent },
];
