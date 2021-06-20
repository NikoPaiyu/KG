import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ElectionService } from '../../shared/services/election.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-pending-office-documents',
  templateUrl: './pending-office-documents.component.html',
  styleUrls: ['./pending-office-documents.component.scss']
})
export class PendingOfficeDocumentsComponent implements OnInit {
  assemblyList: any = null;
  sessionList: any = null;
  assemblyId: any = null;
  sessionId: any = null;
  user: any = null;
  isFilterVisible = false;
  filterCheckboxes: any = null;
  search: any = null;
  pendingDocuments: any = null;
  tempPendingDocuments: any = null;
  colCheckboxes: any = [ 
  { id: 0, label: 'Document Subject', check: true, disable: false },
  { id: 1, label: 'Recieved From', check: true, disable: false },
  { id: 2, label: 'Received Date', check: true, disable: false },
  { id: 3, label: 'status', check: true, disable: false }
];
  assemblySession: any;

  constructor(private common: TablescommonService,
              private electionService: ElectionService,
              @Inject('authService') private AuthService,
              private router: Router) {
                this.user = AuthService.getCurrentUser();
              }

  ngOnInit() {
    this.getAssemblySession();
  }

  
  // getAssemblySession() {
  //   // tslint:disable-next-line: deprecation
  //   forkJoin(
  //     this.common.getAllAssembly(),
  //     this.common.getAllSession()
  //   ).subscribe(([assembly, session]) => {
  //     this.assemblyList = assembly as Array<any>;
  //     this.assemblyList.unshift({
  //       id: 0,
  //       assemblyId: 'No Assembly',
  //     });
  //     const res = this.assemblyList.map((x) => x.id);
  //     // this.assemblyId = Math.max.apply(null, res);
  //     this.sessionList = session as Array<any>;
  //     this.sessionList.unshift({
  //       id: 0,
  //       sessionId: 'No Session',
  //     });
  //     const response = this.sessionList.map((x) => x.id);
  //     // this.sessionId = Math.max.apply(null, response);
  //     this.getPendingDocs();
  //   });
  // }

  // get assembly and session list
  getAssemblySession() {
    this.common.getAllAssemblyandSession().subscribe((Response:any)=> {
      if(Response){
        this.assemblySession = Response.assemblySession;
        this.assemblyList = Response.assembly;
        this.assemblyList.push({
          id: 0,
          assemblyId: 'No Assembly',
        });
        this.getSessionList();
        this.getPendingDocs();
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

  // get registered documents
  getPendingDocs() {
    // const body = {
    //   assemblyId: this.assemblyId,
    //   sessionId: this.sessionId,
    //   sectionId: this.user.correspondenceCode.id,
    //   status: ['SAVED'],
    //   assignedTo: this.user.userId
    // };
    // this.electionService.getPendingDocuments(body).subscribe((res: any) => {
    //   this.pendingDocuments = this.tempPendingDocuments = res;
    // });
    const body = {
      assemblyId :  this.assemblyId,
      sessionId :  this.assemblyId,
      sectionId : this.user.correspondenceCode.id,
      status : ['ASSIGNED'],
      assignedTo : this.user.userId
    };
    this.electionService.getPendingDocuments(body).subscribe((res: any) => {
      this.pendingDocuments = this.tempPendingDocuments = res.filter(x => x.businessTags && x.businessTags.length === 0);
    });
  }

  clearFilter() {}

  clearSearch() {}

  showFilterModal() {}

  showFilter() {}

  chooseFilter(box) {}

  hideFilter() {}

  doNothing() {}

  filtering() {
    if (this.search) {
      this.pendingDocuments = this.tempPendingDocuments.filter(
        (element) =>
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.receivedFrom &&
            element.receivedFrom
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.receivedDate &&
            element.receivedDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.pendingDocuments = this.tempPendingDocuments;
    }
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempPendingDocuments.filter((item) => item);
    if (sort.key && sort.value) {
      this.pendingDocuments = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.pendingDocuments = data;
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


  showLinks(id) {
    this.pendingDocuments.forEach((element) => {
        if (element.id === id) {
          element.viewLinks = true;
        } else {
          element.viewLinks = false;
        }
      });
  }

  viewDoc(id) {
    this.router.navigate(['business-dashboard/tables/election/view-reg-docs', id]);
  }

  filterByAssemblyandSession() {
    if(this.pendingDocuments && this.pendingDocuments.length >0) {
      this.pendingDocuments = this.tempPendingDocuments.filter(
        (el) =>
          el.assemblyId === this.assemblyId &&
          el.sessionId === this.sessionId
      );
    } else {
      this.getPendingDocs();
    }
  }

}
