import { Component, OnInit } from "@angular/core";
import { DocumentsService } from "../shared/services/documents.service";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: "cpl-laid-list",
  templateUrl: "./laid-list.component.html",
  styleUrls: ["./laid-list.component.scss"],
})
export class LaidListComponent implements OnInit {
  dateList:any = [];
  docType = ["SRO", "ORDINANCE", "ACT", "REPORT"];
  assemblyId = null;
  sessionId = null;
  laidDate :any;
  documentType :any;
  searchText :any;
  docList: any = [];
  assemblyList: any = [];
  sessionList: any = [];
  sortName: string;
  sortValue: string;
  listOfDoc: any =[];
  assemblySession: any = null;
  activeSession: any = null;
  constructor(private docService: DocumentsService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // this.getAssemblyList();
    // this.getSessionList();
    this.getAllAssemblyAndSession();
    this.getLayedDoCList();
  }

  // getAssemblyList() {
  //   this.docService.getAllAssembly().subscribe((Response) => {
  //     this.assemblyList = Response;
  //   });
  // }

  // getSessionList() {
  //   this.docService.getAllSession().subscribe((Response) => {
  //     this.sessionList = Response;
  //   });
  // }

  getAllAssemblyAndSession() {
    this.docService.getAllAssemblyAndSession().subscribe((Response: any) => {
      this.assemblySession = Response.assemblySession;
      this.activeSession  = Response.activeAssemblySession;
      this.assemblyList = Response.assembly;
      this.getSessionForAssembly();
    });
  }

  getSessionForAssembly() {
    this.sessionId = null;
    this.sessionList = [];
      if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
        this.sessionId = null;
        this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
      }
  }

  getLayedDoCList() {
    const body = {
      assemblyId: this.assemblyId,
      ministerDepartmentId: null,
      portfolioId: null,
      sessionId: this.sessionId,
      status: "LAID",
      subtype: null,
      type: this.documentType,
    };
    this.docService
    .getDeptDocs(body)
      .subscribe((Res) => {
        this.docList = Res;
        this.listOfDoc = this.docList;
        console.log(this.docList);
        this.dateList=this.docList.map((item) =>item.laidStartDate);
        console.log(this.dateList);
      });
  }

  viewDocument(id) {
    this.router.navigate(["cpl-view", "view", id],
    {relativeTo: this.route.parent});
  }

  sortDoc(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    const data = this.listOfDoc.filter((item) => item);
    if (this.sortName && this.sortValue) {
      this.docList = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName].toLowerCase() > b[this.sortName].toLowerCase()
            ? 1
            : -1
          : b[this.sortName].toLowerCase() > a[this.sortName].toLowerCase()
          ? 1
          : -1
      );
    } else {
      this.docList = data;
    }
  }

  goBack() {
    window.history.back();
  }
  search(){
    if (this.searchText) {
      this.docList  = this.listOfDoc.filter(
        (element) =>
        // (element.currentNumber &&
        //   element.currentNumber
        //     .toLowerCase()
        //     .includes(this.searchText.toLowerCase())) ||
          (element.typeName&&
            element.typeName
            .toLowerCase()
            .includes(this.searchText.toLowerCase())) ||
            (element.type&&
          element.type
            .toLowerCase()
            .includes(this.searchText.toLowerCase())) ||
            (element.regFileNumber&&
          element.regFileNumber
            .toLowerCase()
            .includes(this.searchText.toLowerCase())) ||
            (element.createdDate&&
            element.createdDate
            .toLowerCase()
            .includes(this.searchText.toLowerCase())) ||
            (element.laidStartDate &&
            element.laidStartDate 
            .toLowerCase()
            .includes(this.searchText.toLowerCase())) ||
            (element.delayStatus&&
            element.delayStatus
            .toLowerCase()
            .includes(this.searchText.toLowerCase())) ||
            (element.status&&
          element.status.toLowerCase().includes(this.searchText.toLowerCase()))
      );
    } else {
      this.docList = this.listOfDoc;
    }
  }

  filterDocType() {
    if(this.documentType) {
  this.docList  = this.listOfDoc.filter(
    (element) =>
  (element.type&&
      element.type
        .toLowerCase()
        .includes(this.documentType.toLowerCase()))
  );
}else {
  this.docList = this.listOfDoc;
}
  }
  disabledDate = (current: Date): boolean => {
    if (this.dateList) {
      const todayDate = current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) + '-' + ('0' + current.getDate()).slice(-2);
      return !this.dateList.find(item => item === todayDate);
    }
  }
  filterLaidDate() {
    if(this.laidDate) {
      const laiddate = this.laidDate.getFullYear() + '-' + ('0' + (this.laidDate.getMonth() + 1)).slice(-2) + '-' + ('0' + this.laidDate.getDate()).slice(-2);
      this.docList  = this.listOfDoc.filter(
        (element) =>
          element.laidStartDate == laiddate
      );
    }else {
      this.docList = this.listOfDoc;
  }
}
resetFilter() {
  this.laidDate= null;
 this.documentType =null;
  this.searchText = null;
  this.docList=this.listOfDoc;
}
}
