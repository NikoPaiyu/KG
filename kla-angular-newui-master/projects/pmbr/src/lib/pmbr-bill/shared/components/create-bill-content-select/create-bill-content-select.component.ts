import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd";
import { PmbrBillService } from "../../services/pmbr-bill.service";


@Component({
  selector: "lib-create-bill-content-select",
  templateUrl: "./create-bill-content-select.component.html",
  styleUrls: ["./create-bill-content-select.component.css"],
})
export class CreateBillContentSelectComponent implements OnInit {
  @Input() billDetails: any = [];
  //out put will emit after block selected
  @Output() isImported = new EventEmitter<boolean>();
  //function to find out the pupose of component
  @Input() purpose: string = '';
  constructor(
    private notification: NzNotificationService,
    private pmbrBillService: PmbrBillService,
  ) { }

  ngOnInit() { }

  onCancel() {
    this.isImported.emit(false);
  }
  import() {
    if (this.purpose == "CREATE_BILL") {
      this.saveSelectedBlock();
    }
    else {
      this.saveAmendment();
    }

  }
  //uncheck other checked blocks
  uncheckOtherCheckbox(id) {
    this.billDetails.map((element) => {
      if (element.id != id) {
        element.checked = false;
      }
    });
  }
  //function to save imported block into bill
  saveSelectedBlock() {
    const selectedBlock = this.billDetails.find(
      (element) => element.checked == true
    );
    if (selectedBlock) {
      const body = {
        billId: selectedBlock.defaultBillId,
        content: selectedBlock.content,
        id: null,
        index: selectedBlock.upcommingIndex,
        parentId: selectedBlock.defaultParentId,
        typeId: selectedBlock.upcommingTypeId,
        referenceBlockId: selectedBlock.id,
        referenceBillId: selectedBlock.billId
      };
      this.pmbrBillService.createBillBlocks(body).subscribe((res) => {
        this.notification.success("Success", "Successfully imported");
        this.isImported.emit(true);
      });
    } else {
      this.notification.info("Info", "Please select atleast one..");
    }
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

      // this.pmbrBillService
      //   .submitClauseByClauseAmendments(body).subscribe(res => {
      this.notification.success("Success", "Successfully imported");
      this.isImported.emit(true);
      //   })
    }
    else {
      this.notification.info("Info", "Please select atleast one..");
    }
  }

  //check permission for show checkbox
  checkCheckBoxPermission(type): boolean {
    if (type == "CLAUSE" || type == "SUB_CLAUSE") {
      return true;
    } else {
      return false;
    }
  }
}
