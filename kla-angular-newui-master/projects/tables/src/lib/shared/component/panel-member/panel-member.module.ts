import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelMemberComponent } from './panel-member.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';






@NgModule({
  declarations: [PanelMemberComponent],
  imports: [
    CommonModule,
    NzTableModule,
    NzSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NgZorroAntdModule,
    TranslateModule
  ],
  exports: [PanelMemberComponent]
})
export class PanelMemberModule { }
