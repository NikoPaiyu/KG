import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletinContentViewComponent } from './bulletin-content-view.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { QuillModule } from 'ngx-quill';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [BulletinContentViewComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TranslateModule,
    QuillModule.forRoot()
  ],
  exports: [BulletinContentViewComponent],
  entryComponents: [BulletinContentViewComponent]
})
export class BulletinContentViewModule { }
