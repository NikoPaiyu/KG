import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { differenceInCalendarDays } from 'date-fns';
@Component({
  selector: 'app-debate-date',
  template: `
<div class="demo-full-width" [formGroup]="group">
  <nz-date-picker nzFormat="dd-MM-yyyy" [nzShowToday]="false" [nzAllowClear]="false" [nzPlaceHolder]="label"
  [formControlName]="field.name"  [nzDisabledDate]="disabledDate">
  </nz-date-picker>
</div>
`
,
  styles: []
})
export class DebateDateComponent implements OnInit {
    today = new Date();
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
    disabledDate = (current: Date): boolean => {
      return differenceInCalendarDays(current, this.today) < 2;
    }
}
