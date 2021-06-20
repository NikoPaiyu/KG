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
// import * as Quill from 'quill';
@NgModule({
  declarations: [
    DynamicFormComponent, DynamicFieldDirective, InputComponent, SelectComponent, DatepickerComponent, RichtextComponent
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
    DynamicFormComponent
  ],
  entryComponents: [
    DynamicFormComponent,
    InputComponent,
    SelectComponent,
    DatepickerComponent,
    RichtextComponent
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
