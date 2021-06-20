import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BillAmendmentsService } from '../shared/services/bill-amendments.service';

@Component({
  selector: 'lib-bill-clause-list-view',
  templateUrl: './bill-clause-list-view.component.html',
  styleUrls: ['./bill-clause-list-view.component.css']
})
export class BillClauseListViewComponent implements OnInit {
  @Input() billTitle;
  @Input() billId;
  @Input() bilClauseAmendmentResponse;
  @Input() totalClauseResponse;
  @Output() onClosePopUp = new EventEmitter<any>();
  validateForm: FormGroup;
  @Input() isFileView = false;
  @Input() conformButton;
  @Input() assemblyValue;
  @Input() sessionValue;
  @Input() list;
  @Input() isList2;
  @Input() isList3;
  constructor(private fb: FormBuilder,
              private billAmendmentsService: BillAmendmentsService) { }

  ngOnInit() {
    this.formValidation();
  }

  formValidation(): void {
    this.validateForm = this.fb.group ({
      billId : [this.billId],
      listType : [null],
      orderDto : [[]]
    });
  }

  createClauseList(listId) {
    let listType;
    if (listId === 2) {
      listType = 'LIST';
    } else {
      listType = 'LIST_3';
    }
    const orderList = this.bilClauseAmendmentResponse.map((x, index) => ({
      amendmentId : x.id,
      order : (index + 1)
    }));
    this.validateForm.get('listType').setValue(listType);
    this.validateForm.get('orderDto').setValue(orderList);
    this.billAmendmentsService.createClauseList(this.validateForm.value).subscribe(res => {
      if (res) {
        this.onClosePopUp.emit();
      }
    });
  }

  closeList() {
    this.onClosePopUp.emit();
  }

}
