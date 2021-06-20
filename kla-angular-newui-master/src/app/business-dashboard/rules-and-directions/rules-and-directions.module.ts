import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RulesAndDirectionsRoutingModule } from './rules-and-directions-routing.module';
import { RulesAndDirectionsComponent } from './rules-and-directions.component';
import { RulesComponent } from './rules/rules.component';
import { DirectionsComponent } from './directions/directions.component';
import { NzTableModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@NgModule({
  declarations: [RulesAndDirectionsComponent, RulesComponent, DirectionsComponent],
  imports: [
    CommonModule,TranslateModule,
    RulesAndDirectionsRoutingModule,
    NzTableModule,
    NzBreadCrumbModule
  ]
})
export class RulesAndDirectionsModule { }
