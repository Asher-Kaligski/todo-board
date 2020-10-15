import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpConfigInterceptor } from './core/services/interceptor.service';
import { MembershipModule } from './membership/membership.module';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { TodoBoardModule } from './todo-board/todo-board.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    NgbModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    SharedModule,
    MembershipModule,
    TodoBoardModule,
    CoreModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
