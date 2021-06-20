import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd";
import { BillAmendmentsService } from '../../../bill-amendments/shared/bill-amendments.service';
import { BillManagementService } from "../../services/bill-management.service";

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
  oldActEntry: boolean;
  oldActContent = '';
  oldActIndex = 0;
  ActForm: FormGroup;
  constructor(
    private notification: NzNotificationService,
    private billService: BillManagementService,
    private amendmentService: BillAmendmentsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() { 
    this.initForm();
  }

  onCancel() {
    this.isImported.emit(false);
  }
  initForm() {
    this.ActForm = this.fb.group({
      index: ['', [Validators.required]],
      actContent: ['', Validators.required],
      billId: [],
      typeId: [],
      parentId: [],
      referenceBillNumber: [''],
      indexValue: ['']
    });
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
    let body = {};
    if (this.oldActEntry) {
      body = {
        billId: this.ActForm.get('billId').value,
        content: this.ActForm.get('actContent').value,
        id: null,
        index: this.ActForm.get('index').value,
        indexValue: this.ActForm.get('indexValue').value,
        indexSerial: this.ActForm.get('indexValue').value,
        parentId: this.ActForm.get('parentId').value,
        typeId: this.ActForm.get('typeId').value,
        referenceBlockId: null,
        referenceBillId: null,
        referenceBillNumber: this.ActForm.get('referenceBillNumber').value,
        oldAct: true
      };
      this.billService.createBillBlocks(body).subscribe((res) => {
        this.notification.success("Success", "Successfully imported");
        this.ActForm.reset();
        this.oldActEntry = false;
        this.isImported.emit(true);
      });
    } else {
      const selectedBlock = this.billDetails.find(
        (element) => element.checked == true
      );
      if (selectedBlock) {
        body = {
          billId: selectedBlock.defaultBillId,
          content: selectedBlock.content,
          id: null,
          index: selectedBlock.upcommingIndex,
          parentId: selectedBlock.defaultParentId,
          typeId: selectedBlock.upcommingTypeId,
          referenceBlockId: selectedBlock.id,
          referenceBillId: selectedBlock.billId,
          indexValue: selectedBlock.indexValue,
          indexSerial: selectedBlock.indexSerial,
          oldAct: false
        };
        this.billService.createBillBlocks(body).subscribe((res) => {
          this.notification.success("Success", "Successfully imported");
          this.ActForm.reset();
          this.isImported.emit(true);
        });
      } else {
        this.notification.info("Info", "Please select atleast one..");
      }
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
      this.amendmentService
        .submitClauseByClauseAmendments(body).subscribe(res => {
          this.notification.success("Success", "Successfully imported");
          this.isImported.emit(true);
        })
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
