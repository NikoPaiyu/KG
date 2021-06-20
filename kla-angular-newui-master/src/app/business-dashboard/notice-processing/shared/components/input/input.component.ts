import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-input',
  template: `
<div class='demo-full-width' [formGroup]='group'>
<input  nz-input [formControlName]='field.name' [placeholder]='label' [type]='field.inputType'>
</div>`
,
  styles: []
})
export class InputComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  Formdata;
  label;
  constructor() {}
  ngOnInit() {
    this.label = this.field.label;
    if (this.label) {
      this.label = this.label.replace('[', '');
      this.label = this.label.replace(']', '');
    }
  }
}
