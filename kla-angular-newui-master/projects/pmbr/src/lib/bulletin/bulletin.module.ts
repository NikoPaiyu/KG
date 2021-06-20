import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulletinRoutingModule } from './bulletin-routing.module';
import { BulletinListComponent } from './bulletin-list/bulletin-list.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { BulletinContentViewModule } from './bulletin-content-view/bulletin-content-view.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [BulletinListComponent],
  imports: [
    CommonModule,
    BulletinRoutingModule,
    NgZorroAntdModule,
    BulletinContentViewModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class BulletinModule { }
