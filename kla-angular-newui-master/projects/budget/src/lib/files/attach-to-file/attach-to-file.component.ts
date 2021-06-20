import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { BudgetDocumentService } from '../../shared/services/budget-document.service';
import { BudgetCommonService } from '../../shared/services/budgetcommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';

@Component({
  selector: 'budget-attach-to-file',
  templateUrl: './attach-to-file.component.html',
  styleUrls: ['./attach-to-file.component.css']
})
export class AttachToFileComponent implements OnInit {
  @Input() assemblySessionObj;
  @Input() activeSubType;
  @Input() DataObj;
  @Output() showCreateModal = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Input() purpose = '';
  advancedFiltersFlag = true;
  user: any;
  type = "BUDGET";
  constructor(private fb: FormBuilder,
    @Inject("authService") private AuthService,
    private router: Router,
    public common: BudgetCommonService,
    private service: FileServiceService,
    private notification: NzNotificationService,
    private budgetDoc: BudgetDocumentService,
    private modalService: NzModalService,
  ) {
    this.user = AuthService.getCurrentUser();
  }
  attachFileForm: FormGroup = this.fb.group({
    fileId: ["", Validators.required],
    fileNo: [""],
    subject: [""],
    searchParamForFiles: [""]
  });
  listOfData: any = [];
  listOfAllData: any = [];
  fileList = [];

  ngOnInit() {
    if (this.user.userId) {
      // this.getAllFiles();
      this.getAllApprovedBudgetDoc();
    }
  }
  getAllApprovedBudgetDoc() {
    this.budgetDoc.getAllApprovedBudgetDoc().subscribe((res: any) => {
      this.DataObj.budgetDocumentId = (res.length > 0) ? res[0].id : null;
      this.listOfData = this.listOfAllData = res;
      this.onSearchFilesForAttach();
    });
  }
  onSearchFilesForAttach() {
    let searchParam = this.attachFileForm.value.searchParamForFiles;
    if (searchParam) {
      this.listOfData = this.listOfAllData.filter(element =>
        (element.fileNumber &&
          element.fileNumber
            .toLowerCase()
            .includes(searchParam.toLowerCase())) ||
        (element.subject &&
          element.subject
            .toLowerCase()
            .includes(searchParam.toLowerCase()))
      );
      this.listOfData = this.advancedFilter(this.listOfData);
    } else {
      this.listOfData = this.advancedFilter(this.listOfAllData);

    }

  }
  advancedFilter(list) {
    if (this.attachFileForm.value.fileNo) {
      list = list.filter(
        (element) =>
          element.fileNumber &&
          element.fileNumber
            .toLowerCase()
            .includes(this.attachFileForm.value.fileNo.toLowerCase())
      );
    }
    if (this.attachFileForm.value.subject) {
      list = list.filter(
        (element) =>
          element.subject &&
          element.subject
            .toLowerCase()
            .includes(this.attachFileForm.value.subject.toLowerCase())
      );
    }
    return list;
  }

  onAdvancedFilterclick() {
    this.advancedFiltersFlag = false;
  }
  handlePreviewCancel() {
    this.closePopup.emit();
  }
  getAllFiles() {
    const body = {
      assemblyId: this.assemblySessionObj.currentAssembly,
      sessionId: this.assemblySessionObj.currentSession,
      status: "APPROVED",
      subtype: "BUDGET_DOCUMENT_SECRETARY_CONSENT",
      type: this.type,
      userId: this.user.userId
    };
    this.service.getAllFiles(body).subscribe((Res: any) => {
      this.listOfData = this.listOfAllData = Res;
      this.onSearchFilesForAttach();
    });
  }
  attachToFile() {
    const body = {
      budgetDocumentId: this.DataObj.budgetDocumentId ? this.DataObj.budgetDocumentId : null,
      fileForm: {
        fileId: this.attachFileForm.value.fileId,
        userId: this.user.userId,
        activeSubTypes: [this.activeSubType],
        subtype: this.activeSubType,
        subTypes: [this.activeSubType],
        type: "BUDGET",
        activesubtype: this.activeSubType,
      }
    };
    this.getIdForFile(body);
    this.service.attachToFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "Attached To File Successfully"
      );
      this.showCreateModal.emit(false);
      this.attachFileForm.reset();
      this.modalService.closeAll();
      setTimeout(() => {
        this.router.navigate(["business-dashboard/budgets/file-view", Res.fileResponse.fileId]);
      }, 1500);
    });
  }
  getIdForFile(body) {
    switch (this.activeSubType) {
      case 'BUDGET_SPEECH': {
        body.budgetSpeechId = this.DataObj.id;
        break;
      }
      case 'BUDGET_DEMAND_VERSION': {
        body.demandDraftMasterId = this.DataObj.demandDraftMasterId;
        break;
      }
      case 'BUDGET_CUT_MOTION_LIST': {
        body.budgetSdfgId = this.DataObj.sdfgMsterId;
        break;
      }
    }
  }
}
