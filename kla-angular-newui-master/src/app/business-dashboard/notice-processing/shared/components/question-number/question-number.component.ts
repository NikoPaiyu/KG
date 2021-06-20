import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
@Component({
  selector: 'app-question-number',
  template: `
<div class='demo-full-width margin-top' [formGroup]='group'>
<nz-select nzAllowClear nzShowSearch [nzPlaceHolder]="label" [nzMode]="field.mode?field.mode:'default'" [formControlName]='field.name'>
<nz-option *ngFor='let item of getOptions()' [nzValue]='field.mode?item.id:item' [nzLabel]='item.label'></nz-option>
</nz-select>
</div>
`,
  styles: []

})
export class QuestionNumberComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  Formdata;
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
    let options = [];
    if (this.Formdata && this.Formdata.length > 0) {
        const questiontypeData = this.Formdata.find(x => x.type === 'questiontype');
        if (questiontypeData) {
            const qtLabel = questiontypeData.label;
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
                }
            }
        }
    }
    return options;
  }
}
