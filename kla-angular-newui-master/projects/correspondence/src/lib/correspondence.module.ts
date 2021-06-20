import { NgModule } from '@angular/core';
import { CorrespondenceComponent } from './correspondence.component';
import { SelectTemplateComponent } from './select-template/select-template.component';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { DraftCorrespondenceComponent } from './draft-correspondence/draft-correspondence.component';
import { CorrespondenceViewComponent } from './correspondence-view/correspondence-view.component';
import { CorrespondenceWorkflowComponent } from './correspondence-workflow/correspondence-workflow.component';
import { CorrespondenceDetailViewComponent } from './correspondence-detail-view/correspondence-detail-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { CplRoutingModule } from './correspondence-routing.module';
import { SelectTemplatePipe } from './shared/pipes/select-template.pipe';
import { ComponentsModule } from './shared/components/components.module';
import { CorrespondenceListComponent } from './correspondence-list/correspondence-list.component';



@NgModule({
  declarations: [
    CorrespondenceComponent,
    SelectTemplateComponent,
    TemplateCreateComponent,
    TemplateListComponent,
    DraftCorrespondenceComponent,
    CorrespondenceViewComponent,
    CorrespondenceWorkflowComponent,
    CorrespondenceDetailViewComponent,
    SelectTemplatePipe,
    CorrespondenceListComponent
  ],
  imports: [
    CommonModule,
    CplRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    TranslateModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }],
          [{ direction: "rtl" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["image"],
        ],
      },
    }),
    ComponentsModule
  ],
  exports: [CorrespondenceComponent]
})
export class CorrespondenceModule { }
