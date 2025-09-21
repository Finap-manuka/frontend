import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { Feed } from './components/feed/feed';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'feed', component: Feed }        // feed page
];
