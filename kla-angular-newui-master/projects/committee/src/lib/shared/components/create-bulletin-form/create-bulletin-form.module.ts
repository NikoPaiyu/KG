import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBulletinFormComponent } from './create-bulletin-form.component';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [CreateBulletinFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule

  ],
  exports: [CreateBulletinFormComponent],
  entryComponents: [CreateBulletinFormComponent]
})
export class CreateBulletinFormModule { }
