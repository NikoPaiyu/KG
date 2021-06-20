import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-portfoliosubjects',
  template: `
<div class='demo-full-width margin-top' [formGroup]='group'>
<nz-select nzAllowClear nzShowSearch [nzPlaceHolder]="label" [nzMode]="field.mode?field.mode:'default'" [formControlName]='field.name'>
<nz-option *ngFor='let item of getOptions()' [nzValue]='field.mode?item.id:item' [nzLabel]='item.label'></nz-option>
</nz-select>
</div>
`,
  styles: []

})
export class MinisterSubjectComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  label;
  constructor() { }
  ngOnInit() {
    this.label = this.field.label;
    if (this.label) {
      this.label = this.label.replace('[', '');
      this.label = this.label.replace(']', '');
    }
  }
  getOptions() {
    let data = this.field.options.map(x => {
        x.id = Number(x.id);
        return x;
      });
    const check = this.field.options.some(x => x.parentId);
    if (check && this.field.ministerId) {
          data = this.field.options.filter(x => x.parentId == this.field.ministerId);
    } else {
      data = [];
    }
    return data;
  }
}
