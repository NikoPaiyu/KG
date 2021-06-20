import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'budget-budget-doc-reply-letter',
  templateUrl: './budget-doc-reply-letter.component.html',
  styleUrls: ['./budget-doc-reply-letter.component.scss']
})
export class BudgetDocReplyLetterComponent implements OnInit {
  @Input() isFileView;
  @Input() budgetMain;
  tabParams = {};
  docUrl: any = null;
  previewVisible = false;
  constructor() { }

  ngOnInit() { }
  view_doc(list) {
    this.previewVisible = true;
    this.docUrl = list.docUrl;
  }
  cancelPreview() {
    this.previewVisible = false;
  }
}
