import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DocumentsService } from '../shared/services/documents.service';
import { UploadChangeParam, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { CommonService } from '../shared/services/common.service';
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
@Component({
  selector: 'cpl-act-registration',
  templateUrl: './act-registration.component.html',
  styleUrls: ['./act-registration.component.scss']
})
export class ActRegistrationComponent implements OnInit {
  today: any = new Date();
  actForm: FormGroup;
  assemblyList: any = [];
  cplSectionId: any;
  sessionList: any = [];
  uploadURL = this.docService.uploadUrl();
  fileList: any = [];
  fileList1: any = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  showUploadList2 = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };

  mainDoc: any = [];
  coverDoc: any = [];
  uploadURL1 = this.docService.uploadUrl();
  fileLists: any = [];
  showUploadList1 = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  addDocs: any = [];
  docList: any[];
  user: any;
  activeSession: any = [];
  yearList: any = [];
  docUrl: any = null;
  previewVisible = false;
  assemblySession: any = null;

  constructor(private docService: DocumentsService,
              private fb: FormBuilder,
              private notification: NzNotificationService,
              private router: Router,
              private commonService: CommonService,
              @Inject('authService') private AuthService) {
                this.user = AuthService.getCurrentUser();
                this.cplSectionId = this.commonService.getSectionId();
               }

  ngOnInit() {
    this.validateForm();
    this.actForm.patchValue({
      assembly: 0,
      session: 0,
    });
    // this.currentAssemblyAndSession();
    this.getAllAssemblyAndSession();
    this.getYearList();
  }

  getAllAssemblyAndSession() {
    this.docService.getAllAssemblyAndSession().subscribe((Response: any) => {
      this.assemblySession = Response.assemblySession;
      this.activeSession  = Response.activeAssemblySession;
      this.assemblyList = Response.assembly.filter(x => x.assemblyId >= this.activeSession.assemblyValue);
      this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
      this.getSessionForAssembly();
    });
  }

  getSessionForAssembly() {
    this.sessionList = [];
    this.actForm.controls.session.reset();
    if (this.actForm.value.assembly === 0) {
      this.actForm.controls.session.reset();
      this.actForm.patchValue({
        session: 0
      });
      this.sessionList = [{
              id: 0,
              sessionId: 'No Session',
            }];
    } else {
      if (this.assemblySession.find(x => x.id === this.actForm.value.assembly)) {
        this.actForm.controls.session.reset();
        this.sessionList = this.assemblySession.find(x => x.id === this.actForm.value.assembly).session;
      }
    }
    if (this.actForm.value.assembly === this.activeSession.assemblyId) {
      this.sessionList = this.sessionList.filter(x => x.sessionId >= this.activeSession.sessionValue);
    }
  }

  // getAssemblyList() {
  //   this.docService.getAllAssembly().subscribe((Response) => {
  //     const tempList: any = Response;
  //     this.assemblyList = tempList.filter(x => x.id >= this.activeSession.assemblyId);
  //     this.assemblyList.push({
  //       id: 0,
  //       assemblyId: "No Assembly",
  //     });
  //   });
  // }

  getYearList() {
    const currentYear = new Date().getFullYear();
    let startYear = currentYear - 3;
    while (startYear <= currentYear) {
      this.yearList.push(startYear++);
    }
  }

  // getSessionList() {
  //   this.docService.getAllSession().subscribe((Response) => {
  //     const tempList: any = Response;
  //     this.sessionList = tempList.filter(x => x.id >= this.activeSession.sessionId);
  //     this.sessionList.push({
  //       id: 0,
  //       sessionId: "No Session",
  //     });
  //   });
  // }

  cancel() {}

  handleChange(info: UploadChangeParam): void {
    const fileList = info.fileList;
    this.mainDoc = [];
    if (info.file.response) {
      for (const file of fileList) {
        this.mainDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: false,
          isMainDocument: true,
          isStatementAsPerRule: false,
          currentNumber: null,
          isConfindential: false
        });
      }
    }
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }
  handleChange2(info: UploadChangeParam): void {
    const fileList1 = [...info.fileList];
    this.coverDoc = [];
    if (info.file.response) {
      for (const file of fileList1) {
        this.coverDoc.push({
          name: info.file.name,
          attachmentUrl: info.file.response.body,
          isDelayStatement: false,
          isMainDocument: false,
          isStatementAsPerRule: false,
          currentNumber: null,
          isConfindential: false,
          isLetter: true,
        });
      }
    }
    this.fileList1 = fileList1.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }

  handleChange1(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.addDocs = [];
    if (info.file.response) {
      for (const file of fileLists) {
        this.addDocs.push({
          name: file.name,
          attachmentUrl: file.response.body,
          isDelayStatement: false,
          isMainDocument: false,
          isStatementAsPerRule: false,
          currentNumber: null,
          isConfindential: false
        });
      }
    }
    this.fileLists = fileLists.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }

  validateForm() {
    this.actForm = this.fb.group({
      doctype: ['ACT', [Validators.required]],
      assembly: [0],
      session: [0],
      documentname: [null, [Validators.required]],
      documentfileno: [null, [Validators.required]],
      docNumber: [null, [Validators.required]],
      // sectionName: [null, [Validators.required]],
      docYear: [null, [Validators.required]],
      date: [null, [Validators.required]]
    });
  }

  submitForm(isSave) {
    // tslint:disable-next-line:forin
    for (const i in this.actForm.controls) {
      this.actForm.controls[i].markAsDirty();
      this.actForm.controls[i].updateValueAndValidity();
    }
    if ((this.actForm.value.assembly === null && this.actForm.value.session === null) ||
    (this.actForm.value.assembly === null && this.actForm.value.session === 0) ||
    (this.actForm.value.assembly === 0 && this.actForm.value.session === null)) {
      this.actForm.controls.assembly.setValue(0);
      this.actForm.controls.session.setValue(0);
    } else if ((this.actForm.value.assembly === 0 || this.actForm.value.assembly === null) &&
        this.actForm.value.session !== null
        && this.actForm.value.session !== 0) {
      this.actForm.controls.assembly.reset();
      this.actForm.get('assembly').setValidators([Validators.required]);
      // tslint:disable-next-line:forin
      for (const i in this.actForm.controls) {
        this.actForm.controls[i].markAsDirty();
        this.actForm.controls[i].updateValueAndValidity();
      }
    } else if ((this.actForm.value.session === 0 ||  this.actForm.value.session === null)
        && this.actForm.value.assembly !== null
        && this.actForm.value.assembly !== 0) {
      this.actForm.controls.session.reset();
      this.actForm.get('session').setValidators([Validators.required]);
      // tslint:disable-next-line:forin
      for (const i in this.actForm.controls) {
        this.actForm.controls[i].markAsDirty();
        this.actForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.actForm.valid && this.mainDoc.length !== 0) {
      this.docList = [
        ...this.mainDoc,
        ...this.addDocs,
        ...this.coverDoc
      ];
      const body = {
        assemblyId: this.actForm.value.assembly,
        sessionId: this.actForm.value.session,
        attachments: this.docList,
        typeName: this.actForm.value.documentname,
        typeNumber: this.actForm.value.docNumber,
        departmentFileNumber: this.actForm.value.documentfileno,
        sectionName: this.cplSectionId,
        currentNumber: 0,
        gazettePublishDate: null,
        goDate: null,
        goNumber: null,
        isDelayed: false,
        isStatementAsPerRule: null,
        date: this.actForm.value.date,
        ministerDepartmentId: null,
        portfolioId: null,
        typeDate: null,
        subType: 'NO_SUBTYPE',
        type: 'ACT',
        status: 'SAVED',
        numberOfDaysInSabha: null,
        layingProvisionInAct: null,
        actType: null,
        actName: null,
        typeYear: this.actForm.value.docYear,
        nameOfInstitution: null,
        createdBy: this.user.userId,
        confindential: false,
        typeReference: null
      };
      this.docService.registerDocument(body).subscribe((Res) => {
        const tempRes: any = Res;
        this.actForm.reset();
        this.fileList = [];
        this.fileLists = [];
        this.showUploadList = {
          showPreviewIcon: false,
          showRemoveIcon: false,
          hidePreviewIconInNonImage: false,
        };
        this.showUploadList2 = {
          showPreviewIcon: false,
          showRemoveIcon: false,
          hidePreviewIconInNonImage: false,
        };
        
        this.showUploadList1 = {
          showPreviewIcon: false,
          showRemoveIcon: false,
          hidePreviewIconInNonImage: false,
        };
        if (isSave) {
          this.notification.create(
            'success',
            'Success',
            'Document Saved Successfully!'
          );
          this.router.navigate([
            'business-dashboard/cpl/cpl-view',
            'view',
            tempRes.cplDocumentResponseDto.id,
          ]);
        } else {
          const submitBody = {
            id: tempRes.cplDocumentResponseDto.id,
          };
          this.docService.submitDeptDoc(submitBody).subscribe((Response: any) => {
          this.notification.create(
            'success',
            'Success',
            'Document Submitted Successfully!'
          );
          this.router.navigate([
            'business-dashboard/cpl/cpl-view',
            'view',
            tempRes.cplDocumentResponseDto.id,
          ]);
          });
        }
      });
    } else if (this.mainDoc.length === 0) {
      this.notification.create(
        'warning',
        'Warning',
        'Please Upload Main Document!'
      );
    } 
     else {
      this.notification.create(
        'error',
        'Error',
        'Fill in the required fields!'
      );
    }
  }

  // currentAssemblyAndSession() {
  //   this.commonService.getCurrentAssemblyAndSession().subscribe(Res => {
  //     this.activeSession = Res;
  //     this.getAllAssemblyAndSession();
  //     // this.getAssemblyList();
  //     // this.getSessionList();
  //   });
  // }
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and todaya
    return differenceInCalendarDays(current, this.today) < 0;
  };

  handlePreview = async (file: UploadFile) => {
    this.previewVisible = true;
    this.docUrl = file.response.body;
  }

  cancelPreview() {
    this.previewVisible = false;
  }
}
