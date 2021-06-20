import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFieldDirective } from './dynamic-field/dynamic-field.directive';
import { InputComponent } from './input/input.component';
import { SelectComponent } from './select/select.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { RichtextComponent } from './richtext/richtext.component';
import { QuillModule } from 'ngx-quill';
import { AddCommitteeResponseComponent } from './add-committee-response/add-committee-response.component';
import { ViewCommitteeResponseComponent } from './view-committee-response/view-committee-response.component';
import { AddTimeallocationResponseComponent } from './add-timeallocation-response/add-timeallocation-response.component';
import { AddBudgetDocResponseComponent } from './add-budget-doc-response/add-budget-doc-response.component';
import { SdfgPreViewComponent } from './sdfg-preview/sdfg-preview.component';
import { ApBillOnBudgetResponseComponent } from './ap-bill-on-budget-response/ap-bill-on-budget-response.component';
import { AddBudgetGRLReplyComponent } from './add-budget-grl-reply/add-budget-grl-reply.component';
import { SdgEgReplyComponent } from './sdg-eg-reply/sdg-eg-reply.component';
import { TableTimeallocationResponseComponent } from './table-timeallocation-response/table-timeallocation-response.component';

// import * as Quill from 'quill';
@NgModule({
  declarations: [
    DynamicFormComponent, DynamicFieldDirective, InputComponent, SelectComponent, DatepickerComponent, RichtextComponent, AddCommitteeResponseComponent, ViewCommitteeResponseComponent, AddTimeallocationResponseComponent
    ,AddBudgetDocResponseComponent, SdfgPreViewComponent, ApBillOnBudgetResponseComponent,AddBudgetGRLReplyComponent, SdgEgReplyComponent, TableTimeallocationResponseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
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
          ['image']]
      }
    })
  ],
  exports: [
    DynamicFormComponent,AddCommitteeResponseComponent,ViewCommitteeResponseComponent,
    AddTimeallocationResponseComponent,AddBudgetDocResponseComponent, SdfgPreViewComponent,
    ApBillOnBudgetResponseComponent,AddBudgetGRLReplyComponent,SdgEgReplyComponent,TableTimeallocationResponseComponent
  ],
  entryComponents: [
    DynamicFormComponent,
    InputComponent,
    SelectComponent,
    DatepickerComponent,
    RichtextComponent,
    AddCommitteeResponseComponent,
    ViewCommitteeResponseComponent,
    AddTimeallocationResponseComponent,
    AddBudgetDocResponseComponent,
    SdfgPreViewComponent,
    AddBudgetGRLReplyComponent
  ]
})
export class ComponentsModule {
  constructor() {
    //changing quill classes to inline styles
    // let alignStyle = Quill.import('attributors/style/align');
    // let directionStyle = Quill.import('attributors/style/direction');
    // let fontStyle = Quill.import('attributors/style/font');
    // Quill.register(alignStyle, true);
    // Quill.register(directionStyle, true);
    // Quill.register(fontStyle, true);
  }
}
