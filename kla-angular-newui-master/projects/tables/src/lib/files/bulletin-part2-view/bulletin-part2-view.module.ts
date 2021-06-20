import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulletinPart2ViewComponent } from './bulletin-part2-view.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SafehtmlModule } from '../../shared/pipes/safehtml/safehtml.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BulletinPart2ViewComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SafehtmlModule,
    TranslateModule
  ],
  exports: [BulletinPart2ViewComponent]
})
export class BulletinPart2ViewModule { }
