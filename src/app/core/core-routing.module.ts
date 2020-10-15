import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from 'shared/components/user-form/user-form.component';

import { LoginComponent } from './../membership/components/login/login.component';
import { RegistrationComponent } from './../membership/components/registration/registration.component';
import { AuthGuard } from './../shared/services/auth-guard.service';
import { ViewBoardComponent } from './../todo-board/components/board/view-board/view-board.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  { path: 'reporter', component: ViewBoardComponent, canActivate: [AuthGuard] },
  {
    path: 'edit-user/:id',
    component: UserFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'not-found',
    component: PageNotFoundComponent,
  },

  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
