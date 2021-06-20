import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NoticeTemplateRoutingModule } from './notice-template-routing.module';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ListTemplatesComponent } from './list-templates/list-templates.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';

import { QuillModule } from 'ngx-quill';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import * as Quill from 'quill';
@NgModule({
  declarations: [CreateTemplateComponent, ListTemplatesComponent],
  imports: [
    CommonModule,
    NoticeTemplateRoutingModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    FormsModule,
    NzTabsModule,
    NzIconModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar:
          [['bold', 'italic', 'underline', 'strike'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }],
          [{ 'direction': 'rtl' }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [ { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ]
      }
    }),
    TranslateModule
  ]
})
export class NoticeTemplateModule {
  constructor() {
    //changing quill classes to inline styles
    let alignStyle = Quill.import('attributors/style/align');
    let directionStyle = Quill.import('attributors/style/direction');
    let fontStyle = Quill.import('attributors/style/font');
    Quill.register(alignStyle, true);
    Quill.register(directionStyle, true);
    Quill.register(fontStyle, true);
  }
}
