import { NgModule } from '@angular/core';
import { DigitisationRoutingModule } from './digitisation-routing.module';
import { DigitisationComponent } from './digitisation.component';
import { CreateDigitisationComponent } from './create-digitisation/create-digitisation.component';
import { ListDigitisationComponent } from './list-digitisation/list-digitisation.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [DigitisationComponent, CreateDigitisationComponent, ListDigitisationComponent],
  imports: [NgZorroAntdModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DigitisationRoutingModule,
    TranslateModule],
  exports: [DigitisationComponent]
})
export class DigitisationModule { }
