import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-answer-date',
  template: `
<div class='demo-full-width margin-top' [formGroup]='group'>
<label>{{getOptions()[0]?.label | date : 'dd-MM-yyyy'}}</label>
<nz-select [hidden]="true" nzAllowClear nzShowSearch [nzPlaceHolder]="label" [nzMode]="field.mode?field.mode:'default'" [formControlName]='field.name'>
<nz-option *ngFor='let item of getOptions()' [nzValue]='field.mode?item.id:item' [nzLabel]="item.label | date: 'dd-MM-yyyy'"></nz-option>
</nz-select>
</div>`
,
  styles: []
})
export class AnswerDateComponent implements OnInit {
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
  getOptions(): any[] {
    let options = [];
    if (this.Formdata && this.Formdata.length > 0) {
        const questionListData = this.Formdata.find(x => x.type === 'questionlist');
        if (questionListData) {
            const qtLabel = questionListData.label;
            const data = this.group.value;
            if (data) {
                const qtValue = data[qtLabel];
                if (qtValue && qtValue.id) {
                    this.field.options = this.field.options.map(x => {
                        x.id = Number(x.id);
                        return x;
                    });
                    // tslint:disable-next-line: triple-equals
                    options = this.field.options.filter(x => x.parentId == qtValue.id);
                    if (options && options.length > 0) {
                        this.field.value = options[0];
                        this.group.get(this.field.label).setValue(options[0]);
                    }
                }
            }
        }
    }
    return options;
  }
}
