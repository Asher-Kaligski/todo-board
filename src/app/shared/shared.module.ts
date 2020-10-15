import { TodoService } from './services/todo.service';
import { CustomFormsModule } from 'ng2-validation';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { UserFormComponent } from 'shared/components/user-form/user-form.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AvatarModule } from 'ngx-avatar';

import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [UserFormComponent, ConfirmationDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    FlexLayoutModule,
    CustomFormsModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
  ],
  providers: [AuthService, AuthGuard, UserService, TodoService],
  exports: [
    UserFormComponent,
    Ng2SearchPipeModule,
    AvatarModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    FlexLayoutModule,
    ConfirmationDialogComponent
  ],
  entryComponents: [ConfirmationDialogComponent],
})
export class SharedModule {}
