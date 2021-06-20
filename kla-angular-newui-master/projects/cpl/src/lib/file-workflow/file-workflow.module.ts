import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FileWorkflowRoutingModule } from "./file-workflow-routing.module";
import { FileWorkflowComponent } from "./file-workflow.component";
import { DocsComponent } from "./docs/docs.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule, NzDatePickerModule } from "ng-zorro-antd";
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { QuillModule } from 'ngx-quill';
import { DynamicFormComponent } from '../shared/components/dynamic-form/dynamic-form.component';
import { SelectComponent } from '../shared/components/select/select.component';
import { InputComponent } from '../shared/components/input/input.component';
import { ComponentsModule } from '../shared/components/components.module';
import { StatusFilterPipe } from '../shared/pipes/status-filter.pipe';
import {TranslateModule} from '@ngx-translate/core';
// import * as Quill from 'quill';


@NgModule({
  declarations: [FileWorkflowComponent, DocsComponent, StatusFilterPipe],
  imports: [
    CommonModule,
    TranslateModule,
    FileWorkflowRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzDatePickerModule,
    NgxDocViewerModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar:
          [['bold', 'italic', 'underline', 'strike'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }],
          [{ direction: 'rtl' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [ { color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['image']]
      }
    }),
    ComponentsModule
  ],
  entryComponents: [DynamicFormComponent, SelectComponent, InputComponent]
})
export class FileWorkflowModule {
  // constructor() {
  //   // changing quill classes to inline styles
  //   const alignStyle = Quill.import('attributors/style/align');
  //   const directionStyle = Quill.import('attributors/style/direction');
  //   const fontStyle = Quill.import('attributors/style/font');
  //   Quill.register(alignStyle, true);
  //   Quill.register(directionStyle, true);
  //   Quill.register(fontStyle, true);
  // }
}
