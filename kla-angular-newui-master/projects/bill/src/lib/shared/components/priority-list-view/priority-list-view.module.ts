import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityListViewComponent } from './priority-list-view.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';



@NgModule({
  declarations: [PriorityListViewComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ],
  exports: [PriorityListViewComponent],
  entryComponents: [PriorityListViewComponent]
})
export class PriorityListViewModule { }
