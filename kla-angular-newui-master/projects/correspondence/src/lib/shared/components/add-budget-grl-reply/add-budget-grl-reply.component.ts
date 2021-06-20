import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FieldConfig } from '../../field.interface';
import { FormGroup,FormBuilder } from '@angular/forms';
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';

@Component({
  selector: 'Correspondence-add-budget-grl-reply',
  templateUrl: './add-budget-grl-reply.component.html',
  styleUrls: ['./add-budget-grl-reply.component.scss']
})
export class AddBudgetGRLReplyComponent implements OnInit {
  @Input() businessData: FormGroup;
  @Input() isSubmit = false;
  constructor(private fb: FormBuilder, private notify: NzNotificationService) { }

  ngOnInit() {
  }
}


