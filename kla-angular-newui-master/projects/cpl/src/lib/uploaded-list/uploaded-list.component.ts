import { Component, OnInit, Inject } from '@angular/core';
import { Data, Router } from '@angular/router';
import { DocumentsService } from '../shared/services/documents.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: 'cpl-uploaded-list',
  templateUrl: './uploaded-list.component.html',
  styleUrls: ['./uploaded-list.component.scss'],
})
export class UploadedListComponent implements OnInit {
 
  klaDepartments: any = [];
  listOfDoc: any = [];
  setOfCheckedId = new Set<any>();
  listOfCurrentPageData: Data[] = [];
  checked = false;
  indeterminate = false;
  user: any;
  check = false;
  viewCheck = false;
  assemblyList: any = [];
  sessionList: any = [];
  maxNumber: any;
  assemblyId: any;
  sessionId: any;
  maxValue: any;
  status: any = 'SAVED';
  isAssignVisible = false;
  assistantList: any = [];
  radioValue: any = null;
  isPdfVisible: boolean;
  docUrl: string;
  listOfAssistants: any = [];
  searchPerson: any = null;
  docTitle: any = null;
  docList: any = [];
  statusArray: any = [];
  isEditVisible: any = false;
  document: any = '';
  documents: any = '';
  otherdocuments: any = '';
  cplSectionId;
  sectionId;
  returnModal = false;
  reason: any;
  returnId: any;
  officeRegister = false;
  deleteTitle: any;
  deleteId: any;
  deleteModal = false;
  colCheckboxes = [
    { id: 1, label: 'Curr No', check: true, disable: false },
    { id: 2, label: 'Document Type', check: true, disable: false },
    { id: 3, label: 'Document Subject', check: true, disable: false },
    { id: 4, label: 'Submission Date', check: true, disable: false },
    { id: 5, label: 'From Whom', check: true, disable: false },
    { id: 6, label: 'Minister Subject', check: false, disable: true },
    { id: 7, label: ' Received Date', check: false, disable: true },
    { id: 8, label: 'Status', check: true, disable: false },
    { id: 9, label: 'Cover Letter', check: true, disable: false },
    { id: 10, label: 'Other Documents', check: true, disable: false }
  ];
  activeSession: any;
  assemblySession: any = null;

  constructor(
    @Inject('authService') private AuthService,
    private docService: DocumentsService,
    private notification: NzNotificationService,
    private commonService: CommonService,
    private router: Router,
    private modal: NzModalService
  ) {
    this.user = AuthService.getCurrentUser();
    this.cplSectionId = this.commonService.getSectionId();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.getKlaDepartments();
    // tslint:disable-next-line: deprecation
    this.docService.getAllAssemblyAndSession().subscribe((Res: any) => {
      // this.assemblyList = assembly;
      // this.assemblyList.push({
      //   id: 0,
      //   assemblyId: "No Assembly",
      // });
      // const res = this.assemblyList.map((x) => x.id);
      // this.maxNumber = Math.max.apply(null, res);
      // this.assemblyId = this.maxNumber;
      // this.sessionList = session;
      // this.sessionList.push({
      //   id: 0,
      //   sessionId: "No Session",
      // });
      // const result = this.sessionList.map((x) => x.id);
      // this.maxValue = Math.max.apply(null, result);
      // this.sessionId = this.maxValue;
      this.assemblyList = Res.assembly;
      this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
      this.assemblySession = Res.assemblySession;
      this.assemblyId = Res.activeAssemblySession.assemblyId;
      // const res = this.assemblyList.map((x) => x.id);
      // this.maxNumber = Math.max.apply(null, res);
      // this.assemblyId = this.maxNumber;
      // this.assemblyId = null;
      // const result = this.sessionList.map((x) => x.id);
      // this.maxValue = Math.max.apply(null, result);
      // this.sessionId = this.maxValue;
      // this.currentAssemblyAndSession();
      this.getSessionForAssembly();
      this.sessionId = Res.activeAssemblySession.sessionId;
      setTimeout(() => {
        if (this.user.authorities.includes('sectionOfficer')) {
          this.check = true;
          this.viewCheck = true;
          this.status = 'SUBMITTED';
          this.statusArray = ['SUBMITTED', 'ASSIGNED'];
          this.getAssistants();
          this.getPendingDocList();
          this.colCheckboxes.push({ id: 11, label: 'Remarks', check: false, disable: true });
        } else if (this.commonService.doIHaveAnAccess('OFFICE_SECTION_REGISTER', 'CREATE')) {
          this.check = false;
          this.status = 'ASSIGNED';
          this.officeRegister = true;
          this.getPendingDocList();
        } else {
          this.statusArray = ['SAVED', 'SUBMITTED', 'RETURN'];
          this.check = false;
          this.status = null;
          this.viewCheck = false;
          this.getDocList();
          this.colCheckboxes.push({ id: 11, label: 'Remarks', check: false, disable: true },
          { id: 12, label: 'KLA Section', check: false, disable: true },
          { id: 13, label: 'Received From', check: false, disable: true });
        }
        }, 500);
      // if (this.user.authorities.includes("sectionOfficer")) {
      //   this.getPendingDocList();
      // } else {
      //   this.getDocList();
      // }
    });
  }

  getSessionForAssembly() {
    this.sessionList = [];
    this.sessionId = null;
    if (this.assemblyId === 0) {
      this.sessionId = 0;
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    } else {
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
    }
}

  getDocList() {
    const body = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      sectionId: this.cplSectionId,
      status: this.status,
    };
    this.docService.listUploadedDocs(body).subscribe((Res) => {
      this.listOfDoc = Res;
      this.docList = this.listOfDoc;
    });
  }

  onItemChecked(id, checked): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  _checkAllRows(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    // this.listOfCurrentPageData.forEach(
    //   (item) => (this.setOfCheckedId[item.id] = value)
    // );
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    // const listOfEnabledData = this.listOfCurrentPageData.filter(
    //   ({ disabled }) => !disabled
    // );
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
    this.listOfCurrentPageData.some((item) =>
      this.setOfCheckedId.has(item.id)
    ) && !this.checked;
    // this.indeterminate =
    //   listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) &&
    //   !this.checked;
  }

  onCurrentPageDataChange($event: any): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  // assignTOAssistant() {
  //   const body = [...this.setOfCheckedId];
  //   this.docService.assignOfficeTask(body).subscribe((Res) => {
  //     this.setOfCheckedId = new Set<any>();
  //     this. getDocList();
  //     this.notification.create(
  //       'success',
  //       'Success',
  //       'Task Assigned Succesfully'
  //     );
  //   });
  // }

  submitDoc(docId) {
    const body = {
      id: docId,
    };
    this.docService.officeSectionSubmit(body).subscribe((Res) => {
      this.docTitle = '';
      this.notification.create(
        'success',
        'Success',
        'Document Submitted Successfully!'
      );
      this.getDocList();
    });
  }

  assignModal() {
    this.isAssignVisible = true;
  }

  handleCancel() {
    this.isAssignVisible = false;
    this.radioValue = null;
    this.returnModal = false;
    this.reason = '';
    this.searchPerson = null;
  }

  getAssistants() {
    // this.commonService.getNonMembers().subscribe((Res) => {
    //   const temp: any = Res;
    //   const data = temp.data;
    //   this.assistantList = data.filter(
    //     (element) =>
    //       element.roles[0].roleName === "assistant" &&
    //       element.details.klaSectionId === this.cplSectionId
    //   );
    //   this.listOfAssistants = this.assistantList;
    // });
    this.commonService.getAssisstantList(['CPL_ASSISTANT']).subscribe((Res) => {
      this.assistantList = Res;
      this.listOfAssistants = this.assistantList;
    });
  }

  assignTOAssistant() {
    this.isAssignVisible = false;
    const body = {
      officeSectionDocumentIds: [...this.setOfCheckedId],
      assignee: this.radioValue,
      fromGroup: 'section officer',
    };
    this.docService.assignOfficeTask(body).subscribe((Res) => {
      this.radioValue = null;
      this.setOfCheckedId = new Set<any>();
      this.getPendingDocList();
      this.notification.create(
        'success',
        'Success',
        'Task Assigned Succesfully!'
      );
    });
  }

  getPendingDocList() {
    const body = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      sectionId: this.cplSectionId,
      status: this.status,
      userId: this.user.userId,
    };
    this.docService
          .getOfficeSectionPendingDocuments(body)
          .subscribe((Res) => {
            this.listOfDoc = Res;
            this.docList = this.listOfDoc;
    });
  }

  showPdfModal(documentUrl) {
    this.docUrl = documentUrl;
    if (this.docUrl) {
      this.isPdfVisible = true;
    }
  }

  hideModal() {
    this.isPdfVisible = false;
    this.docUrl = '';
    this.isEditVisible = false;
  }

  personSearch() {
    if (this.searchPerson) {
      this.assistantList = this.listOfAssistants.filter(
        (element) =>
          element.fullName &&
          element.fullName
            .toLowerCase()
            .includes(this.searchPerson.toLowerCase())
      );
    } else {
      this.assistantList = this.listOfAssistants;
    }
  }

  searchDoc() {
    if (this.docTitle && this.status && !this.officeRegister && !this.check) {
      this.listOfDoc = this.filterList().filter(
        (element) =>
          element.title &&
          element.title.toLowerCase().includes(this.docTitle.toLowerCase()) ||
          (element.currentNumber.toString() &&
              element.currentNumber.toString().includes(this.docTitle))
      );
    } else if (this.docTitle) {
      this.listOfDoc = this.docList.filter(
        (element) =>
          element.title &&
          element.title.toLowerCase().includes(this.docTitle.toLowerCase()) ||
          (element.currentNumber.toString() &&
              element.currentNumber.toString().includes(this.docTitle))
      );
    } else {
      if (this.status && !this.officeRegister && !this.check) {
        this.filterList();
      } else {
        this.listOfDoc = this.docList;
      }
    }
  }

  cancel() {
    this.deleteModal = false;
  }

  editDocument(document) {
    this.isEditVisible = false;
    this.docService.updateOfficeSectionDocument(document).subscribe((Res) => {
      this.notification.create(
        'success',
        'Success',
        'Document Updated Succesfully'
      );
      this.getDocList();
    });
  }

  showDeleteConfirm(title, id): void {
    this.deleteModal = true;
    this.deleteTitle = title;
    this.deleteId = id;
  }

  deleteDocument() {
    this.docService.deleteOfficeSectionDocument(this.deleteId).subscribe((Res) => {
      this.deleteModal = false;
      this.notification.create(
        'success',
        'Success',
        'Document Deleted Succesfully'
      );
      this.getDocList();
    });
  }

  showEditModal(doc) {
    this.router.navigate(['business-dashboard/cpl/doc-upload', 'edit', doc.id]);
    // this.document = {
    //   id: doc.id,
    //   title: doc.title,
    //   documentUrl: doc.documentUrl,
    //   sectionId: doc.sectionId,
    //   status: doc.status,
    //   assemblyId: doc.assemblyId,
    //   sessionId: doc.sessionId,
    //   currentNumber: doc.currentNumber
    // };
    // this.isEditVisible = true;
  }
  showViewModel(doc) {
    // this.router.navigate(["business-dashboard/cpl/doc-upload", "view", doc.id]);
    this.documents = doc.attachments.filter(
      (element) => element.type == 'COVERING_LETTER'
    );
    this.otherdocuments = doc.attachments.filter(
      (element) => element.type == 'OTHERS'

    );
    this.document = {
      id: doc.id,
      title: doc.title,
      documentUrl: doc.documentUrl,
      sectionId: doc.sectionId,
      status: doc.status,
      assemblyId: doc.assemblyId,
      sessionId: doc.sessionId,
      currentNumber: doc.currentNumber,
      type: doc.type,
      receivedDate: doc.receivedDate,
      fromWhom: doc.fromWhom,
      portfolio: doc.portfolio,
      coveringletter: this.documents[0].title,
      coveringletterURL: this.documents[0].documentUrl,
      otherDocumets: this.otherdocuments[0].title,
      otherDocumetsURL: this.otherdocuments[0].documentUrl
    };
    this.isEditVisible = true;
  }
  getKlaDepartments() {
    this.commonService.getKlaSections().subscribe((res) => {
      this.klaDepartments = res;
    });
  }

  showReturnModal(id) {
    this.returnModal = true;
    this.returnId = id;
  }

  returnDoc() {
    const body = {
      id: this.returnId,
      remark: this.reason
    };
    this.docService.returnDocument(body).subscribe(Res => {
      this.returnModal = false;
      this.notification.create(
              'success',
              'Success',
              'Document Returned Succesfully'
            );
      this.reason = '';
      this.getPendingDocList();
    });
  }

  registerDocument(id) {
    this.router.navigate([
      'business-dashboard/cpl/registration/OSdocs',
      id
    ]);
  }

  getStatus(status) {
    if (!this.officeRegister && !this.check) {
      if (status === 'SAVED' || status === 'RETURN') {
        return status;
      } else {
        return 'SUBMITTED';
      }
    } else {
      return status;
    }
  }

  filterList() {
    if (this.status) {
        this.listOfDoc = this.docList.filter(
          (element) =>
            element.status &&
            element.status
              .toLowerCase()
              .includes(this.status.toLowerCase())
        );
    } else {
      this.listOfDoc = this.docList;
    }
    return  this.listOfDoc;
  }

  disableCheckBoxes() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 8) {
      for (const box of this.colCheckboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colCheckboxes) {
        box.disable = false;
      }
    }
  }

  // currentAssemblyAndSession() {
  //   this.commonService.getCurrentAssemblyAndSession().subscribe((Res: any) => {
  //     this.activeSession = Res;
  //     this.assemblyId = this.activeSession.assemblyId;
  //     this.sessionId = 0;
  //   });
  // }
}
