import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBillNoticeComponent } from './create-notice/create-notice.component';
import { NzTabsModule, NzSelectModule, NzFormModule, NzInputModule } from 'ng-zorro-antd';
import { QuillModule } from 'ngx-quill';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

export { CreateBillNoticeComponent } from './create-notice/create-notice.component';

const Components = [CreateBillNoticeComponent];

@NgModule({
  declarations: [...Components],
  imports: [
    CommonModule,
    NzTabsModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzFormModule,
    NzInputModule,
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
  exports: [...Components]
})
export class BillNoticeModule { }
