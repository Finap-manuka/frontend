import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { Feed } from './components/feed/feed';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'feed', component: Feed },
    { path: 'admin', component: Admin },
    { path: '**', redirectTo: '/login' }
];
