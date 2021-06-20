import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpeakerRoutingModule } from './speaker-routing.module';
import { SpeakerListComponent } from './speaker-list/speaker-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdModule, NzInputModule, NzIconModule, NzSwitchModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpeakerNoteViewComponent } from './speaker-note-view/speaker-note-view.component';
import { QuillModule } from "ngx-quill";
import { SpeakerComponent } from './speaker/speaker.component';
@NgModule({
  declarations: [SpeakerListComponent, SpeakerNoteViewComponent, SpeakerComponent],
  imports: [
    CommonModule,
    SpeakerRoutingModule,
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
export class SpeakerModule { }
