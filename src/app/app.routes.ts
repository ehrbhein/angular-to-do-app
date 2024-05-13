import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TasksComponent } from './tasks/tasks.component';
import { UnauthorizedPageComponent } from './401/401.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'tasks', component: TasksComponent },
  { path: '401', component: UnauthorizedPageComponent },
];
