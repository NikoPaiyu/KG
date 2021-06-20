import { NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NoticeRoutingModule } from "./notice-routing.module";
import { SelectNoticeTypeComponent } from "./select-notice-type/select-notice-type.component";
import { CreateNoticeComponent } from "./create-notice/create-notice.component";
import { ListNoticeComponent } from "./list-notice/list-notice.component";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCardModule } from "ng-zorro-antd/card";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { DynamicFormComponent } from "../shared/components/dynamic-form/dynamic-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputComponent } from "../shared/components/input/input.component";
import { SelectComponent } from "../shared/components/select/select.component";
import { ComponentsModule } from "../shared/components/components.module";
import { TranslateModule } from "@ngx-translate/core";
import { QuillModule } from "ngx-quill";
import { DatepickerComponent } from "../shared/components/datepicker/datepicker.component";
import { ConsentsNotieComponent } from "./consents-notice/consents-notice.component";
import * as Quill from "quill";
import { SearchTemplatePipe } from "./select-notice-type/searchTemplate.pipe";
import { NoticeListComponent } from './notice-list/notice-list.component';
import { FileListComponent } from './file-list/file-list.component';
import { SroNumberComponent } from '../shared/components/sro-number/sro-number.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ReferenceNoticesComponent } from './reference-notices/reference-notices.component';
@NgModule({
  declarations: [
    SelectNoticeTypeComponent,
    CreateNoticeComponent,
    ListNoticeComponent,
    ConsentsNotieComponent,
    SearchTemplatePipe,
    NoticeListComponent,
    FileListComponent,
    ReferenceNoticesComponent,
  ],
  imports: [
    CommonModule,
    NoticeRoutingModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzButtonModule,
    NzCardModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    TranslateModule,
    NgxDocViewerModule,
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
        ],
      },
    }),
  ],
  entryComponents: [DynamicFormComponent, SelectComponent, InputComponent,SroNumberComponent]
})
export class NoticeModule {
  constructor() {
    //changing quill classes to inline styles
    let alignStyle = Quill.import("attributors/style/align");
    let directionStyle = Quill.import("attributors/style/direction");
    let fontStyle = Quill.import("attributors/style/font");
    Quill.register(alignStyle, true);
    Quill.register(directionStyle, true);
    Quill.register(fontStyle, true);
  }
}
