import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import { CreateTemplateComponent } from './create-template/create-template.component';
import { ListTemplateComponent } from './list-template/list-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { QuillModule } from 'ngx-quill';

import { ListDocumentsComponent } from './list-documents/list-documents.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { SelectTemplatePipe } from './shared/pipes/select-template.pipe';

@NgModule({
  declarations: [DocumentsComponent, CreateTemplateComponent, ListTemplateComponent, ListDocumentsComponent, SelectTemplateComponent, SelectTemplatePipe],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
  ]
})
export class DocumentsModule { }
