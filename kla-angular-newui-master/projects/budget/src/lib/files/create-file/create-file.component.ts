import { Component, OnInit, Input, Inject,Output,EventEmitter} from "@angular/core";
import { Router } from "@angular/router";
import { NzModalService, NzNotificationService } from "ng-zorro-antd";
import { forkJoin } from "rxjs";
import { FileServiceService } from "../../shared/services/file-service.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
@Component({
  selector: "budget-create-file",
  templateUrl: "./create-file.component.html",
  styleUrls: ["./create-file.component.scss"],
})
export class CreateFileComponent implements OnInit {
  @Input() assemblySession;
  @Input() DataObj;
  @Input() activeSubType; 
 
  

  validateFile: FormGroup;
  constructor(
    private file: FileServiceService,
    private router: Router,
    @Inject("authService") private authService,
    @Inject("notify") public notify,
    private modalservice:NzModalService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.formValidation();
  }

  formValidation() {
    this.validateFile = this.fb.group({
      filesubject: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }
  createFile() {
    if (!this.validateFile.valid) {
      // tslint:disable-next-line: forin
      for (const i in this.validateFile.controls) {
        this.validateFile.controls[i].markAsDirty();
        this.validateFile.controls[i].updateValueAndValidity();
      }
      return;
    }
    let formData = this.validateFile.value;
    const body = {
      assemblyId: this.assemblySession.currentAssembly,
      categoryId: formData.category,
      fileForm: {
        assemblyId: this.DataObj.assemblyId,
        currentNumber: null,
        description: formData.description,
        sessionId: this.DataObj.sessionId,
        status: "SAVED",
        subject: formData.filesubject,
        activeSubTypes: [this.activeSubType],
        subtype: this.activeSubType,
        type: 'BUDGET',
        userId: this.authService.getCurrentUser().userId,
        priority: formData.priority,
      },
      name: formData.name,
    };
    this.getIdForFile(body);
    this.file.createFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with fileNumber " + Res.fileResponse.fileNumber
      );
      this.router.navigate(["business-dashboard/budgets/file-view/", Res.fileResponse.fileId]);
      this.CancelFilePopUp();
      this.modalservice.closeAll();
    });
  }
  getIdForFile(body) {
     switch (this.activeSubType) {
      case 'BUDGET_SPEECH': {
        body.budgetSpeechId = this.DataObj.id;
        break;
      }
      case 'BUDGET_DOCUMENT_SECRETARY_CONSENT': {
        body.budgetDocumentId = this.DataObj.id;
        break;
      }
      case 'BUDGET_DOCUMENT_GRL': {
        body.budgetDocumentGRLId = this.DataObj.id;
        break;
      }
      case 'BUDGET_MASTER': {
        body.budgetMasterId = this.DataObj.id;
        break;
      }
      case 'BUDGET_SDG_EG_MASTER': {
        body.budgetSdgEgId = this.DataObj.id;
        break;
      }
      case 'BUDGET_SDG_AND_EG': {
        body.sdgAndEgId = this.DataObj.id;
        break;
      }
    }
  }
  CancelFilePopUp() {
    this.validateFile.reset();
  }
 
}
