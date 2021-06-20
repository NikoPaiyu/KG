import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../shared/services/common.service';
import { DocsManagementService } from '../../shared/services/docs-management.service';

@Component({
  selector: 'office-section-wise-docs',
  templateUrl: './section-wise-docs.component.html',
  styleUrls: ['./section-wise-docs.component.css']
})
export class SectionWiseDocsComponent implements OnInit {
  docsList: any = [];
  allDocsList: any = [];
  allDocs= [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "Document Subject", check: true, disable: false },
    { id: 2, label: "To KLA Section", check: true, disable: false },
    { id: 3, label: "Received From", check: true, disable: false },
    { id: 4, label: "Received Date", check: true, disable: false },
    { id: 5, label: "Status", check: true, disable: false },
    { id: 6, label: 'Curr No', check: true, disable: false },
  ];
  billId;
  isPdfVisible: boolean;
  docUrl: string;
  user: any;
  assemblyList: any = [];
  sessionList: any = [];
  maxNumber: any;
  assemblyId: any;
  sessionId: any;
  maxValue: any;
  activeSession: any;
 currentStatus = null;
 statusArray = ['SAVED', 'SUBMITTED', 'RETURN'];
 isOfficeSection = true;
 sectionCode;
 returnModal = false;
 reason: any;
 returnId: any;
 deleteTitle: any;
  deleteId: any;
  deleteModal = false;
  isAssignVisible = false;
  assistantList = [];
  radioValue: any = null;
  listOfAssistants: any = [];
  searchPerson: any = null;
  assemblySession: any;
  constructor(
    private docService: DocsManagementService,
    private notification: NzNotificationService,
    private commonService: CommonService, private router: Router,
    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    console.log(this.user);
    this.commonService.getPermissions(this.user.rbsPermissions);
    this._setFilter();
    if (this.router.url.includes('office/sectionwise-docs')) {
     this.isOfficeSection = false
     this.sectionCode = this.user.correspondenceCode.id;
    }
  }
  ngOnInit() {
    this.getAssistants();
    this.getAssemblySession();
  }

    // forkJoin(
    //   this.docService.getAllAssembly(),
    //   this.docService.getAllSession()
    // ).subscribe(([assembly, session]) => {
     
    //   this.assemblyList = assembly;
    //   this.assemblyList.push({
    //     id: 0,
    //     assemblyId: 'No Assembly',
    //   });
    //   this.assemblyId = null;
    //   this.sessionList = session;
    //   this.sessionList.push({
    //     id: 0,
    //     sessionId: 'No Session',
    //   });
    
    //   this.sessionId = null;
    //   this.currentAssemblyAndSession();
    //   this.getDocList();
    // });

  // currentAssemblyAndSession() {
  //   this.commonService.getCurrentAssemblyAndSession().subscribe((Res: any) => {
  //     this.activeSession = Res;
  //     this.assemblyId = this.activeSession.assemblyId;
  //     this.sessionId = 0;
  //   });
  // }

// get assembly and session list
  getAssemblySession() {
    this.commonService.getAllAssemblyandSession().subscribe((Response:any)=> {
      if(Response){
        this.assemblySession = Response.assemblySession;
        this.assemblySession.forEach(element => {
          element.session.push({
            id: 0,
            sessionId: 'No Session',
          });
        });
        this.assemblyId = Response.activeAssemblySession.assemblyId;
        this.assemblyList = Response.assembly;
        this.assemblyList.push({
          id: 0,
          assemblyId: 'No Assembly',
        });
        this.getSessionList();
        this.sessionId = Response.activeAssemblySession.sessionId;
        this.getDocList();
      }
    });
  }


   // get session for assembly
   getSessionList() {
    this.sessionId = null;
    if (this.assemblyId === 0 || !(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId))) {
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    } else {
      if(this.assemblyId && this.assemblySession.find(x=> x.id === this.assemblyId)){
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
    }
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Title Of Bill", key: "title" },
      { label: "Type Of Bill", key: "sectionName" },
      { label: "receivedFrom of Erratum", key: "receivedFrom" },
      { label: "No of Erratums", key: "errataCount" },
      { label: "Status", key: "status" },
    ];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < tableDataMdl.length; i++) {
      const row = {
        key: tableDataMdl[i].key,
        label: tableDataMdl[i].label,
        checked: false,
        filtersel: false,
        data: [],
        selValue: null,
        disableCol: false,
      };
      this.filtrParams.tableDto.push(row);
    }
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  showFilter(type) {
    this.filtrParams.rowFilter = type === "row" ? true : false;
  }
  _confrmFilter(): void {
    if (this.filtrParams.rowFilter) {
      this._filterRows();
    }
  }
  _filterRows() {
    this.filtrParams.rowFilter = false;
    this.filtrParams.tableDto.forEach((element) => {
      element.filtersel = element.checked;
    });
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    let count = 0;
    this.filtrParams.tableDto.forEach((element) => {
      count++;
      if (element.filtersel) {
        switch (element.key) {
          case "title":
            this.allDocsList.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case "sectionName":
            this.allDocsList.forEach((value) => {
              element.data.push(value.sectionName);
            });
            break;
          case "receivedFrom":
            this.allDocsList.forEach((value) => {
              element.data.push(value.receivedFrom);
            });
            break;
          case "receivedDate":
            this.allDocsList.forEach((value) => {
              element.data.push(value.receivedDate);
            });
            break;
          case "status":
            this.allDocsList.forEach((value) => {
              element.data.push(value.status);
            });
            break;
          default:
            break;
        }
      }
    });
    if (count === this.filtrParams.tableDto.length) {
      this.filtrParams.tableDto.forEach((element) => {
        element.data = element.data.filter((v, i, a) => a.indexOf(v) === i);
      });
    }
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  searchonErrata() {
    this.docsList = this.allDocsList;
    if (this.searchParam) {
      this.docsList = this.allDocsList.filter(
        (element) =>
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.sectionName &&
            element.sectionName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.receivedFrom &&
            element.receivedFrom
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.receivedDate &&
            element.receivedDate ==
              this.searchParam) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.docsList = this.allDocsList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.docsList = this.allDocsList;
    } else {
      this.docsList = this.allDocsList.filter((item: any) =>
        this.applyFilter(item, this.filtrParams.tableDto)
      );
    }
  }
  applyFilter(element: any, filter: any) {
    for (const field in filter) {
      if (filter[field].selValue) {
        if (typeof filter[field].selValue === "string") {
          if (
            !element[filter[field].key] ||
            element[filter[field].key].toLowerCase() !==
              filter[field].selValue.toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field].selValue === "number") {
          if (
            !element[filter[field].key] ||
            element[filter[field].key] !== filter[field].selValue
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
  _checkAllRows(value: boolean): void {
    this.allDocsList.forEach((item) => {
        if(item.status == 'SUBMITTED'){
          this.mapOfCheckedId[item.id] = value
        }
      });
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allDocsList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.allDocsList.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.docsList.forEach((element) => {
        element.viewLinks = false;
      });
    }
    console.log( this.tableParams.colSpan);
  }
  disableFilter(filter) {
    filter.filtersel = false;
    filter.checked = false;
    filter.data = [];
    filter.selValue = null;
    this.searchCol();
    this._loadSelectedfilterData();
  }
  clearFilter() {
    this._setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }
  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.allDocsList.filter((item) => item);
    if (sort.key && sort.value) {
      this.docsList = data.sort((a, b) =>
        sort.value === "ascend"
          ? (a[sort.key!] && a[sort.key!].toLowerCase()) >
            (b[sort.key!] && b[sort.key!].toLowerCase())
            ? 1
            : -1
          : (b[sort.key!] && b[sort.key!].toLowerCase()) >
            (a[sort.key!] && a[sort.key!].toLowerCase())
          ? 1
          : -1
      );
    } else {
      this.docsList = data;
    }
  }

  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 6) {
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

  getDocList() {
    this.clearFilter();
    this.searchParam = null;
    this.tableParams.colSpan = null;
    this.mapOfCheckedId = {};
    if(!this.isOfficeSection){
      this.statusArray = [];
      let assignedTo = this.user.userId
      this.statusArray = ['ASSIGNED','RETURNED'];
      if(this.isSectionOfficer()){
      this.statusArray.push('SUBMITTED');
        assignedTo = null
      }
      let body={
        assemblyId : this.assemblyId,
        sessionId :this.sessionId,
        sectionId : this.sectionCode,
        status : this.statusArray,
        assignedTo : assignedTo
      }
      this.docService.getAllPendingDocsListBysection(body).subscribe((arg: any) => {
        this.docsList = this.allDocsList = this.allDocs = arg;
        assignedTo = null;
        this.filterByAssemblyandSession();
      });
    }else{
    let status ='';
    this.docService.getAllDocsListExceptCpl(status).subscribe((arg: any) => {
      this.docsList = this.allDocsList = this.allDocs = arg;
      this.filterByAssemblyandSession();
    });
  }
   
  }
  filterByAssemblyandSession(){
    this.docsList = this.allDocsList = this.allDocs.filter(
      (el) =>
        el.assemblyId == this.assemblyId &&
        el.sessionId === this.sessionId
    );
    if(this.currentStatus){
      this.docsList = this.allDocsList = this.docsList.filter(
        (el) =>
          el.status == this.currentStatus
      );
    }
  }
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.docsList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else{
        element.viewLinks = false;
      }
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
    // this.isEditVisible = false;
  }
  submitDoc(docId) {
    this.docService.submitDocumentExceptCpl(docId).subscribe((Res) => {
      this.notification.create( 
        "success",
        "Success",
        "Document Submitted Successfully!"
      );
      this.getDocList();
    });
  }
  cancel(){

  }
  showEditModal(doc) {
    this.router.navigate(['business-dashboard/office/doc-upload', 'edit', doc.id],
    {
      state: {
        isCplSection : false,
      }  
    }
    );
  }  
  showView(list){
    this.router.navigate(['business-dashboard/office/docsview', list.id],
    {
      state: {
        isCplSection : false,
      }  
    } 
    )
  }
  showDeleteConfirm(title, id): void {
      this.deleteModal = true;
      this.deleteTitle = title;
      this.deleteId = id;
  }

  deleteConfirm(){
    this.deleteModal = false;
    this.docService.deleteDoc(this.deleteId).subscribe((arg: any) => {
    this.deleteTitle = "";
    this.deleteId = null;
    this.notification.create(
      'success',
      'Success',
      'Document Deleted Succesfully'
    );
      this.getDocList();
    });
  }
  showReturnModal(id) {
    this.returnModal = true;
    this.returnId = id;
  }
  handleCancel() {
    this.deleteModal = false;
    this.deleteTitle = "";
    this.deleteId = null;
    this.isAssignVisible = false;
    this.radioValue = null;
    this.returnModal = false;
    this.reason = '';
    this.searchPerson = null;
  }
  returnDoc() {
    const body = {
      id: this.returnId,
      remark: this.reason
    };
    this.docService.returnDocToOfficeSection(body).subscribe(Res => {
      this.returnModal = false;
      this.notification.create(
              'success',
              'Success',
              'Document Returned Succesfully'
            );
      this.reason = '';
      this.getDocList();
    });
  }
  isSectionOfficer() {
    return (this.user.authorities.includes("sectionOfficer"));
  }
  isAssistant() {
    return (this.user.authorities.includes("assistant"));
  }
  getAssistants() {
    const body = {
      klaDesignatoinId: 10,
      klaSectionId: this.user.correspondenceCode.id
    };
    this.commonService.getAssistants(body).subscribe((Res: any) => {
    // this.commonService.getAssisstantList(['CPL_ASSISTANT']).subscribe((Res) => {
      this.assistantList = Res;
      console.log(this.assistantList);
      this.listOfAssistants = this.assistantList;
    });
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
  showAssistant() {
    this.isAssignVisible = true;
  }
  assignTOAssistant() {
    let officeSectionDocumentIds =[]
    this.isAssignVisible = false;
    let checkedArray = [];
    checkedArray = this.docsList.filter(
      (item) => this.mapOfCheckedId[item.id]
    );
    checkedArray.forEach(element => {
      if (element.id) {
        officeSectionDocumentIds.push(element.id)
      }
    });
    const body = {
      officeSectionDocumentIds: officeSectionDocumentIds,
      assignee: this.radioValue
    };
    this.docService.assignDocsToAssistant(body).subscribe((Res) => {
      this.radioValue = null;
      officeSectionDocumentIds = [];
      this.getDocList();
      this.notification.create(
        'success',
        'Success',
        'Task Assigned Succesfully!'
      );
    });
  }
}
