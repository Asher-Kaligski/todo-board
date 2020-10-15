import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';

@NgModule({
  declarations: [LoginComponent, RegistrationComponent],
  imports: [CommonModule, SharedModule],
})
export class MembershipModule {}
