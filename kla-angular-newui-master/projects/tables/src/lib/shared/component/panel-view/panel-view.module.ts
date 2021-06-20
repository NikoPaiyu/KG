import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelViewComponent } from './panel-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule, NzTabsModule } from 'ng-zorro-antd';





@NgModule({
  declarations: [PanelViewComponent],
  imports: [
    CommonModule,
    TranslateModule,
    NzTableModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  exports: [PanelViewComponent]
})
export class PanelViewModule { }
