import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { DocumentsService } from "../shared/services/documents.service";
import { UploadChangeParam, NzNotificationService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { CommonService } from "../shared/services/common.service";
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "cpl-docs-upload",
  templateUrl: "./docs-upload.component.html",
  styleUrls: ["./docs-upload.component.scss"],
})
export class DocsUploadComponent implements OnInit {
  documentUploadForm: FormGroup;
  assemblyList: any = [];
  sessionList: any = [];
  klasessionList;
  departmentIdList;
  ministerDeptList;
  uploadURL = this.docService.uploadUrl();
  coveringDocFileList = [];
  additionalDocumentFileList = [];
  additionalDocument: any = [];
  coveringLetterDocument: any = [];
  docType = ["SRO", "ORDINANCE", "REPORT"];
  currentNumber = 0;
  removedDocumentIds: Array<number> = [];
  receviedFrom = ["Chief Secretary", "Add. Chief  Secretary", "Special Secretary", "Principal Secretary", "Secretary",
                  'Secretary-LAW Department'];
  today: any = new Date();
  subjectList: any = [];
  updateRes: any = [];
  assemblySession: any = null;
  activeSession: any = null;

  constructor(
    private fb: FormBuilder,
    private docService: DocumentsService,
    private notification: NzNotificationService,
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) {
    // this.currentAssemblyAndSession();
    this.getAllAssemblyAndSession();
    this.getKlaSessionList();
  }

  ngOnInit() {
    this.createForm();
    if (this.route.snapshot.params.id) {
      this.setValueForUpdate(this.route.snapshot.params.id);
    } else {
      this.getAllDepartment(null);
    }
  }

  createForm() {
    this.documentUploadForm = this.fb.group({
      assemblyId: [0],
      sessionId: [0],
      type: [null, Validators.required],
      title: [null, Validators.required],
      sectionId: [null, Validators.required],
      portfolioId: [null],
      subjectId: [null, Validators.required],
      departmentId: [null, Validators.required],
    fromWhom: [null, Validators.required],
    receivedDate: [null, Validators.required],
    attachments: [null]
    });
  }

  // currentAssemblyAndSession() {
  //   this.commonService.getCurrentAssemblyAndSession().subscribe((Res: any) => {
  //     this.getAllAssemblyAndSession(Res);
  //     // this.getAssemblyList(Res);
  //     // this.getSessionList(Res);
  //   });
  // }

  getAllAssemblyAndSession() {
    this.docService.getAllAssemblyAndSession().subscribe((Response: any) => {
      this.assemblySession = Response.assemblySession;
      this.activeSession = Response.activeAssemblySession;
      this.assemblyList = Response.assembly.filter(x => x.assemblyId >= Response.activeAssemblySession.assemblyValue);
      this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
      this.getSessionForAssembly();
    });
  }

  getSessionForAssembly() {
    this.sessionList = [];
    this.documentUploadForm.controls.sessionId.reset();
    if (this.documentUploadForm.value.assemblyId === 0) {
      this.documentUploadForm.controls.sessionId.reset();
      this.documentUploadForm.patchValue({
        sessionId: 0
      });
      this.sessionList = [{
              id: 0,
              sessionId: 'No Session',
            }];
    } else {
      if (this.assemblySession.find(x => x.id === this.documentUploadForm.value.assemblyId)) {
        this.documentUploadForm.controls.sessionId.reset();
        this.sessionList = this.assemblySession.find(x => x.id === this.documentUploadForm.value.assemblyId).session;
      }
    }
    if (this.documentUploadForm.value.assemblyId === this.activeSession.assemblyId) {
      this.sessionList = this.sessionList.filter(x => x.sessionId >= this.activeSession.sessionValue);
    }
  }

  // getAssemblyList(activeSession) {
  //   this.docService.getAllAssembly().subscribe((Response: any) => {
  //     this.assemblyList = Response.filter(
  //       (x) => x.id >= activeSession.assemblyId
  //     );
  //     this.assemblyList.push({
  //       id: 0,
  //       assemblyId: "No Assembly",
  //     });
  //   });
  // }

  // getSessionList(activeSession) {
  //   this.docService.getAllSession().subscribe((Response: any) => {
  //     this.sessionList = Response.filter(
  //       (x) => x.id >= activeSession.sessionId
  //     );
  //     this.sessionList.push({
  //       id: 0,
  //       sessionId: "No Session",
  //     });
  //   });
  // }

  getKlaSessionList() {
    this.commonService.getKlaSections().subscribe((res: any) => {
      //this filter is temporary solution bcz only we have cpl login
      this.klasessionList = res.filter(
        (element) => element.klaSectionName == "CPL"
      );
    });
  }

  // getAllPortfolios() {
  //   this.docService.getAllPortfolios().subscribe((Res) => {
  //     this.minPortfoliosList = Res;
  //   });
  // }

  getAllDepartment(id) {
    this.docService.getAllSubjects().subscribe((Res) => {
      this.departmentIdList = Res;
      if (id) {
        const temp = this.departmentIdList.find(element => element.id === id);
        if (temp) {
          this.documentUploadForm.patchValue({
            departmentId: temp
          });
          this.getAllSubjects(this.updateRes.departmentId, this.updateRes.subjectId);
        }
      }
    });
  }
  getMinisterDepartments(ministerPortfolioId) {
    this.docService
      .getMinisterDepartments(ministerPortfolioId)
      .subscribe((Res) => {
        this.ministerDeptList = Res;
      });
  }

  setValueForUpdate(id) {
    this.docService.getDocumentDetailsById(id).subscribe((res: any) => {
      if (res) {
        this.updateRes = res;
        this.getAllDepartment(res.departmentId);
        this.documentUploadForm.patchValue({
            assemblyId: res.assemblyId,
            sessionId: res.sessionId,
            type: res.type,
            title: res.title,
            sectionId: res.sectionId,
            portfolioId: res.portfolioId,
            receivedDate: res.receivedDate,
            fromWhom: res.fromWhom,
          });
        this.currentNumber = res.currentNumber;
        this.additionalDocument = res.attachments.filter(
          (element) => element.type == "OTHERS"
        );
        this.coveringLetterDocument = res.attachments.filter(
          (element) => element.type == "COVERING_LETTER"
        );
        //set documents for upload controls
        const additionalDocuments: any = [];
        const coveringLetterDocuments: any = [];
        res.attachments.forEach((element, index) => {
          if (element.type == "COVERING_LETTER") {
            coveringLetterDocuments.push({
              uid: index + 1,
              url: element.documentUrl,
              id: element.id,
              name: element.title,
              status: "done",
              response: { body: element.documentUrl },
            });
          } else if (element.type == "OTHERS") {
            additionalDocuments.push({
              uid: index + 1,
              url: element.documentUrl,
              id: element.id,
              name: element.title,
              status: "done",
              response: { body: element.documentUrl },
            });
          }
        });
        this.coveringDocFileList = coveringLetterDocuments;
        this.additionalDocumentFileList = additionalDocuments;
      }
    });
  }

  submitForm(isSave) {
    if ((this.documentUploadForm.value.assemblyId === null && this.documentUploadForm.value.sessionId === null) ||
    (this.documentUploadForm.value.assemblyId === null && this.documentUploadForm.value.sessionId === 0) ||
    (this.documentUploadForm.value.assemblyId === 0 && this.documentUploadForm.value.sessionId === null)) {
      this.documentUploadForm.controls.assemblyId.setValue(0);
      this.documentUploadForm.controls.sessionId.setValue(0);
    } else if ((this.documentUploadForm.value.assemblyId === 0 || this.documentUploadForm.value.assemblyId === null) &&
        this.documentUploadForm.value.sessionId !== null
        && this.documentUploadForm.value.sessionId !== 0) {
      this.documentUploadForm.controls.assemblyId.reset();
      this.documentUploadForm.get('assemblyId').setValidators([Validators.required]);
      // tslint:disable-next-line:forin
      for (const i in this.documentUploadForm.controls) {
        this.documentUploadForm.controls[i].markAsDirty();
        this.documentUploadForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.documentUploadForm.controls.assemblyId !== null && this.documentUploadForm.value.sessionId === null) {
      this.documentUploadForm.controls.sessionId.setValue(0);
    }
    // else if ((this.documentUploadForm.value.assemblyId === 0 || this.documentUploadForm.value.assemblyId === null) &&
    //     this.documentUploadForm.value.sessionId !== null
    //     && this.documentUploadForm.value.sessionId !== 0) {
    //   this.documentUploadForm.controls.assemblyId.reset();
    //   this.documentUploadForm.get('assemblyId').setValidators([Validators.required]);
    //   // tslint:disable-next-line:forin
    //   for (const i in this.documentUploadForm.controls) {
    //     this.documentUploadForm.controls[i].markAsDirty();
    //     this.documentUploadForm.controls[i].updateValueAndValidity();
    //   }
    // } else if ((this.documentUploadForm.value.sessionId === 0 ||  this.documentUploadForm.value.sessionId === null)
    //     && this.documentUploadForm.value.assemblyId !== null
    //     && this.documentUploadForm.value.assemblyId !== 0) {
    //   this.documentUploadForm.controls.sessionId.reset();
    //   this.documentUploadForm.get('sessionId').setValidators([Validators.required]);
    //   // tslint:disable-next-line:forin
    //   for (const i in this.documentUploadForm.controls) {
    //     this.documentUploadForm.controls[i].markAsDirty();
    //     this.documentUploadForm.controls[i].updateValueAndValidity();
    //   }
    // }
    if (
      this.documentUploadForm.valid &&
      this.coveringDocFileList.length > 0 &&
      this.additionalDocumentFileList.length > 0
    ) {
      const temp = this.documentUploadForm.value.departmentId;
      const tempSub = this.documentUploadForm.value.subjectId;
      this.documentUploadForm.patchValue({
      departmentId: temp.id,
      portfolioId: tempSub.portfolioId,
      subjectId: tempSub.id
      });
      this.documentUploadForm.value.documentUrl = null;
      this.documentUploadForm.value.attachments = [
        ...this.additionalDocument,
        ...this.coveringLetterDocument,
      ];
      this.docService
        .docUpload(this.documentUploadForm.value)
        .subscribe((Res: any) => {
          if (isSave) {
            this.notification.success(
              "success",
              "Document Saved Successfully!"
            );
            this.onBackClick();
          } else {
            this.submitDocument(Res.id);
          }
        });
    } else {
      for (const i in this.documentUploadForm.controls) {
        this.documentUploadForm.controls[i].markAsDirty();
        this.documentUploadForm.controls[i].updateValueAndValidity();
      }
      if (
        this.coveringDocFileList.length == 0 ||
        this.additionalDocumentFileList.length == 0
      ) {
        this.notification.warning("Info", "Please Upload Required Document..");
      }
    }
  }

  submitDocument(docId) {
    const body = {
      id: docId,
    };
    this.docService.officeSectionSubmit(body).subscribe((Res) => {
      this.notification.create(
        "success",
        "Success",
        "Document Submitted Successfully!"
      );
      this.router.navigate(["business-dashboard/cpl/uploaded-list"]);
    });
  }
  updateForm() {
    if (
      this.documentUploadForm.valid &&
      this.coveringDocFileList.length > 0 &&
      this.additionalDocumentFileList.length > 0
    ) {
      if (this.removedDocumentIds.length > 0) {
        this.docService
          .deleteAllAttachmentById(
            this.route.snapshot.params.id,
            this.removedDocumentIds
          )
          .subscribe((res) => {
            this.updateDocument();
          });
      } else {
        this.updateDocument();
      }
    } else {
      for (const i in this.documentUploadForm.controls) {
        this.documentUploadForm.controls[i].markAsDirty();
        this.documentUploadForm.controls[i].updateValueAndValidity();
      }
      if (
        this.coveringDocFileList.length == 0 ||
        this.additionalDocumentFileList.length == 0
      ) {
        this.notification.warning("Info", "Please Upload Required Document..");
      }
    }
  }
  updateDocument() {
    const temp = this.documentUploadForm.value.departmentId;
    const tempSub = this.documentUploadForm.value.subjectId;
    this.documentUploadForm.patchValue({
    departmentId: temp.id,
    portfolioId: tempSub.portfolioId,
    subjectId: tempSub.id
    });
    this.documentUploadForm.value.createdDate = "";
    this.documentUploadForm.value.updatedDate = "";
    this.documentUploadForm.value.createdBy = null;
    this.documentUploadForm.value.id = this.route.snapshot.params.id;
    (this.documentUploadForm.value.documentUrl = null),
      (this.documentUploadForm.value.status = "SAVED");
    this.documentUploadForm.value.currentNumber = this.currentNumber;
    this.documentUploadForm.value.workflowId = null;
    this.documentUploadForm.value.attachments = [
      ...this.additionalDocument,
      ...this.coveringLetterDocument,
    ];

    this.docService
      .updateOfficeSectionDocument(this.documentUploadForm.value)
      .subscribe((res) => {
        this.notification.success("Success", "Updated Successfully..");
        this.onBackClick();
      });
  }

  uploadCoverLetter(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.coveringLetterDocument = [];
    if (info.file.response) {
      for (const file of fileLists) {
        file.url = file.response.body;
        this.coveringLetterDocument.push({
          id: file.id ? file.id : null,
          title: file.name,
          documentUrl: file.response.body,
          type: "COVERING_LETTER",
        });
      }
      if (info.file.status == "removed" && info.file.id > 0) {
        this.removedDocumentIds.push(info.file.id);
      }
    }
  }

  uploadAdditionalDocument(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.additionalDocument = [];
    if (info.file.response) {
      for (const file of fileLists) {
        file.url = file.response.body;
        this.additionalDocument.push({
          id: file.id ? file.id : null,
          title: file.name,
          documentUrl: file.response.body,
          type: "OTHERS",
        });
      }
      if (info.file.status == "removed" && info.file.id > 0) {
        this.removedDocumentIds.push(info.file.id);
      }
    }
  }
  onBackClick() {
    this.router.navigate(["business-dashboard/cpl/uploaded-list"]);
  }
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and todaya
    return differenceInCalendarDays(current, this.today) < 0;
  }

  getAllSubjects(dept, subjectId) {
    if (dept) {
      let temp;
      if (typeof dept == 'object') {
        temp = dept.id;
      } else {
        temp = dept;
      }
      this.documentUploadForm.patchValue({
        subjectId: null
      });
      this.docService.getAllSubjectsByDepartmentId(temp).subscribe((Res: any) => {
        this.subjectList = Res;
        if (subjectId) {
          const tempSub = this.subjectList.find(element => element.id == subjectId);
          if (tempSub) {
             this.documentUploadForm.patchValue({
             subjectId: tempSub
          });
        }
        }
      });
    }
  }

  onDocTypeChange(event) {
    if (event === 'ORDINANCE') {
      this.documentUploadForm.patchValue({
        fromWhom: 'Secretary-LAW Department'
      });
    } else {
      this.documentUploadForm.patchValue({
        fromWhom: null
      });
    }
  }
}
