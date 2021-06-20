import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssuranceRoutingModule } from './assurance-routing.module';
import { AssuranceComponent } from './assurance.component';
import { ListAssuranceComponent } from './list-assurance/list-assurance.component';
import { CreateAssuranceComponent } from './create-assurance/create-assurance.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from "ngx-quill";
@NgModule({
  declarations: [AssuranceComponent, ListAssuranceComponent, CreateAssuranceComponent],
  imports: [
    CommonModule,
    AssuranceRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
  ]
})
export class AssuranceModule { }
