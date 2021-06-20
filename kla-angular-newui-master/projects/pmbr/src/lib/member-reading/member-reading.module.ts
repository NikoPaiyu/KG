import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberReadingRoutingModule } from './member-reading-routing.module';
import { MemberReadingComponent } from './member-reading/member-reading.component';
import { MemberReadingListComponent } from './member-reading-list/member-reading-list.component';
import { MemberReadingViewComponent } from './member-reading-view/member-reading-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule, NzInputModule, NzIconModule, NzSwitchModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from "ngx-quill";


@NgModule({
  declarations: [MemberReadingComponent, MemberReadingListComponent, MemberReadingViewComponent],
  imports: [
    CommonModule,
    MemberReadingRoutingModule,
    TranslateModule,NgZorroAntdModule,NzInputModule,NzIconModule,NzSwitchModule,
    FormsModule,ReactiveFormsModule,
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
  ]
})
export class MemberReadingModule { }
