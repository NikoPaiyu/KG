import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-clauses',
  template: `
<div class='demo-full-width'>
    <ng-container *ngFor="let control of clauses.controls; index as i;first as f;last as l;">
        <textarea [formControl]="clauses.controls[i]"  nz-input ></textarea>
        <button
        style="margin-bottom:5px;"
          nz-button
          type="button"
          nzType="default"
          nz-popconfirm
          nzPopconfirmTitle="are you sure to remove this clause?"
          (nzOnConfirm)="removeClause(i)">
          Remove
        </button>
    </ng-container>
    <textarea nz-input [(ngModel)]="clauseText" [hidden]="clauses.length > 6"></textarea>
    <button nz-button type="button" nzType="default" (click)="addClause()" [hidden]="clauses.length > 6">Add Clause</button>
    <nz-form-item class="width-100 pading-all" *ngIf="message">
        <nz-alert
          nzType="warning"
          [nzMessage]="message"
        >
      </nz-alert>
    </nz-form-item>
</div>`
,
  styles: []
})
export class ClauseComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  Formdata;
  message = null;
  clauseText = null;
  clauses: FormArray = this.fb.array([]);
  addClause() {
    if (this.clauseText) {
      this.clauses.push(new FormControl(this.clauseText));
      this.clauseText = null;
      this.GetWarningText();
      this.setValue();
    }
  }
  setValue() {
      let data = this.clauses.value;
      data = data.filter(x => x);
      this.field.value = data;
      this.group.get(this.field.label).setValue(data);
  }
  loadValue() {
      if (this.field.value && this.field.value.length > 0) {
        const data: [] = this.field.value;
        this.clauses = this.fb.array([]);
        data.forEach((el, i) => {
            this.clauses.push(new FormControl(el));
        });
      }
  }
  removeClause(i) {
      if (this.clauses.length > 0) {
        this.clauses.removeAt(i);
      }
      this.GetWarningText();
      this.setValue();
  }
  GetWarningText() {
        const data = this.clauses.value;
        const dataValues = data.filter(x => x.length > 0).length;
        if (data && data.length > 0) {
          let count = 0;
          if (dataValues === data.length) {
            count = data.length;
          } else {
            count = data.length - 1;
          }
          if (count && count > 4) {
            const diff = 7 - count;
            if (diff > 0) {
                this.message =  `${ 7 - count} clauses left`;
            } else {
                this.message = null;
            }
            const clauses = data.filter(x => x.length > 0).length;
            if (clauses > 6) {
              this.notify.showSuccess('Message', '7 clauses reached');
              this.message = null;
            }
          } else {
            this.message = null;
          }
        }
  }
  constructor(private fb: FormBuilder, private notify: NotificationCustomService) {}
  ngOnInit() {
      this.loadValue();
      this.clauses.valueChanges.subscribe(res => {
        this.setValue();
      });
  }
}
