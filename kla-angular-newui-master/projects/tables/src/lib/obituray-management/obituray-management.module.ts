import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { NgZorroAntdModule, NzPopoverModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ObiturayManagementRoutingModule } from './obituray-management-routing.module';
import { ObiturayManagementComponent } from './obituray-management.component';
import { ObituaryListingComponent } from './obituary-listing/obituary-listing.component';
import { CreateObituaryAddressComponent } from './create-obituary-address/create-obituary-address.component';
import { ObituaryNoteComponent } from './obituary-note/obituary-note.component';
import { SupportingDocComponent } from './supporting-doc/supporting-doc.component';
import { ObituaryGistComponent } from './obituary-gist/obituary-gist.component';
import { QuillModule } from "ngx-quill";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { AddGistComponent } from './add-gist/add-gist.component';
import { AttachToFileModule } from '../shared/component/attach-to-file/attach-to-file.module';
// import * as Quill from 'quill';


@NgModule({
  declarations: [ObiturayManagementComponent, ObituaryListingComponent, CreateObituaryAddressComponent, ObituaryNoteComponent, SupportingDocComponent, ObituaryGistComponent, AddGistComponent],
  imports: [
    CommonModule,
    ObiturayManagementRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NzPopoverModule,
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
    NgxDocViewerModule,
    AttachToFileModule
  ],
  exports: [ObituaryNoteComponent, SupportingDocComponent, ObituaryGistComponent],
  providers: [DatePipe]
})
export class ObiturayManagementModule {
  // constructor() {
  //   let alignStyle = Quill.import('attributors/style/align');
  //   let directionStyle = Quill.import('attributors/style/direction');
  //   let fontStyle = Quill.import('attributors/style/font');
  //   Quill.register(alignStyle, true);
  //   Quill.register(directionStyle, true);
  //   Quill.register(fontStyle, true);
  // }
}
