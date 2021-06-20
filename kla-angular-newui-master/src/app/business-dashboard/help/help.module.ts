import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { HelpDetailsComponent } from './help-details/help-details.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [HelpComponent, HelpDetailsComponent],
  imports: [
    CommonModule,
    HelpRoutingModule,TranslateModule
  ]
})
export class HelpModule { }
