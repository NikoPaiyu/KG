import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { CommitteecommonService } from 'committee/lib/shared/services/committeecommon.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';

@Component({
  selector: 'committee-create-bill-content-select',
  templateUrl: './create-bill-content-select.component.html',
  styleUrls: ['./create-bill-content-select.component.css'],
})
export class CreateCommitteeContentSelectComponent implements OnInit {
  @Input() billDetails: any = [];
  // out put will emit after block selected
  @Output() isImported = new EventEmitter<boolean>();
  constructor(
    private notification: NzNotificationService, public common: CommitteecommonService,
  ) { }

  ngOnInit() { }

  onCancel() {
    this.isImported.emit(false);
  }
  import() {
    this.saveAmendment();
  }
  // uncheck other checked blocks
  uncheckOtherCheckbox(id) {
    this.billDetails.map((element) => {
      if (element.id !== id) {
        element.checked = false;
      }
    });
  }
  saveAmendment() {
    const selectedBlock = this.billDetails.find(
      (element) => element.checked == true
    );
    if (selectedBlock) {
      const body = {
        billId: selectedBlock.defaultBillId,
        blockId: null,
        operation: "WHOLE_INSERT",
        startingIndex: 0,
        endingIndex: 0,
        userId: selectedBlock.userId,
        insertedWord: selectedBlock.content,
        officialAmendment: true,
        typeId: selectedBlock.upcommingTypeId,
        parentId: selectedBlock.defaultParentId,
        blockIndex: selectedBlock.upcommingIndex,
        isSuggestion: false,
        blockReferenceBlockId: selectedBlock.id,
        blockReferenceBillId: selectedBlock.billId
      }
      this.common
        .submitClauseByClauseAmendments(body).subscribe(res => {
          this.notification.success("Success", "Successfully imported");
          this.isImported.emit(true);
        })
    }
    else {
      this.notification.info("Info", "Please select atleast one..");
    }
  }

  // check permission for show checkbox
  checkCheckBoxPermission(type): boolean {
    if (type === 'CLAUSE' || type === 'SUB_CLAUSE') {
      return true;
    } else {
      return false;
    }
  }
}
