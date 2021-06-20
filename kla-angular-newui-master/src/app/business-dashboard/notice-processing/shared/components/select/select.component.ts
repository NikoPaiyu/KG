import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-select',
  template: `
<div class='demo-full-width margin-top' [formGroup]='group'>
<nz-select nzAllowClear nzShowSearch [nzMode]="field.mode?field.mode:'default'" [formControlName]='field.name' [nzPlaceHolder]="label">
<nz-option *ngFor='let item of field.options' [nzValue]='field.mode?item.id:item' [nzLabel]='item.label'></nz-option>
</nz-select>
</div>
`,
  styles: []

})
export class SelectComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  label;
  constructor() { }
  ngOnInit() {
    this.field.options = this.field.options.map(x => {
      if (Number(x.id)) {
        x.id = Number(x.id);
      }
      return x;
    });
    this.label = this.field.label;
    if (this.label) {
      this.label = this.label.replace('[', '');
      this.label = this.label.replace(']', '');
    }
  }
}
