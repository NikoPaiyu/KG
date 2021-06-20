import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';

@Component({
  selector: 'budget-budget-grl-reply-content',
  templateUrl: './budget-grl-reply-content.component.html',
  styleUrls: ['./budget-grl-reply-content.component.css']
})
export class BudgetGrlReplyContentComponent implements OnInit {
  @Input() sectionMode;
  @Input() grlReply;
  content;
  editMode = false;
  constructor(private fb: FormBuilder, private notify: NzNotificationService,
    private budgetDocservice: BudgetDocumentService,
    ) { }
  replyForm: FormGroup;
  
  ngOnInit() {
   this.content = this.grlReply.grlSectionCopy;
  }
  onSave(){
    if(!this.content){
      this.notify.create('warning', 'Content Required!!!', '');
      return;
    }
   let body =  {
      content: this.content,
      letterId: this.grlReply.id
    }
    this.budgetDocservice.editGRLBulletin(body).subscribe((res: any) => {
      this.notify.create('success', 'Success', 'Success');
      this.editMode=false;
    });
  }
  onCancel(){
    this.editMode=false;
    this.content = this.grlReply.grlSectionCopy;
  }
}
