import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-textarea',
  template: `
<div class='demo-full-width' [formGroup]='group'>
    <textarea  nz-input [formControlName]='field.name' [placeholder]='label'></textarea>
</div>`
,
  styles: []
})
export class TextAreaComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
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
