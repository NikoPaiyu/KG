import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoticeProcessRoutingModule } from "./notice-process-routing.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DynamicFormComponent } from "../shared/components/dynamic-form/dynamic-form.component";
import { ComponentsModule } from "../shared/components/components.module";
import { QuillModule } from "ngx-quill";
import { NoticeProcessComponent } from "./notice-process.component";
import { VersionsComponent } from './versions/versions.component';
import * as Quill from 'quill';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  declarations: [NoticeProcessComponent, VersionsComponent],
  imports: [
    CommonModule,
    NoticeProcessRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    NzAlertModule,
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
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
         ]
      }
    })
  ],
  entryComponents: [DynamicFormComponent]
})
export class NoticeProcessModule {
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
