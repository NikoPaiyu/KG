import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-aod',
  template: `
<div class="demo-full-width" [formGroup]="group">
  <nz-date-picker nzFormat="dd-MM-yyyy" [nzAllowClear]="false" [formControlName]="field.name"
  [nzDisabledDate]="getOptions" [nzShowToday]="false" [nzPlaceHolder]="label">
  </nz-date-picker>
</div>
`,
  styles: []

})
export class AllottedDatesComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  FormData;
  label
  constructor() { }
  ngOnInit() {
    this.label = this.field.label;
    if (this.label) {
      this.label = this.label.replace('[', '');
      this.label = this.label.replace(']', '');
    }
  }
  getOptions = (dateStr) => {
      // if (this.field && this.field.ministerId) {
      //   if (this.field.options && this.field.options.length > 0) {
      //       dates = this.field.options.filter(x => x.id == this.field.ministerId);
      //   }
      // }
      const formattedDate = dateStr.getFullYear() + '-' + ('0' + (dateStr.getMonth() + 1)).slice(-2) + 
      '-' + ('0' + dateStr.getDate()).slice(-2);
      return !this.field.options.find(x => x.label == formattedDate);
  }
}
