import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NoticeTemplateRoutingModule } from './notice-template-routing.module';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ListTemplatesComponent } from './list-templates/list-templates.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';


@NgModule({
  declarations: [CreateTemplateComponent, ListTemplatesComponent],
  imports: [
    CommonModule,
    NoticeTemplateRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ]
})
export class NoticeTemplateModule { }
