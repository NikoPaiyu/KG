import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletinContentViewComponent } from './bulletin-content-view.component';
import { SafehtmlModule } from '../../shared/pipes/safehtml/safehtml.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [BulletinContentViewComponent],
  imports: [
    CommonModule,
    SafehtmlModule,
    NgZorroAntdModule
  ],
  exports: [BulletinContentViewComponent],
  entryComponents: [BulletinContentViewComponent]
})
export class BulletinContentViewModule { }
