import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms.component';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsListComponent } from './forms-list/forms-list.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDocViewerModule } from 'ngx-doc-viewer';



@NgModule({
  declarations: [FormsComponent, FormsListComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDocViewerModule
  ]
})
export class FormModule { }
