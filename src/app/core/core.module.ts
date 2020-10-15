import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from './../shared/shared.module';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CoreRoutingModule } from './core-routing.module';

@NgModule({
  declarations: [NavBarComponent, PageNotFoundComponent],
  imports: [CommonModule, CoreRoutingModule, NgbModule, SharedModule],
  exports: [NavBarComponent],
})
export class CoreModule {}
