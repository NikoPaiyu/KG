import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  Injectable,
} from "@angular/core";
import { DocumentsService } from "../shared/services/documents.service";
import { Data, Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../shared/services/common.service";
import { FilesService } from "../shared/services/files.service";
import { NzNotificationService } from "ng-zorro-antd";
import * as jsPdf from "jspdf";
import "jspdf-autotable";
import * as html2canvas from "html2canvas";
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "cpl-document-preparation",
  templateUrl: "./document-preparation.component.html",
  styleUrls: ["./document-preparation.component.scss"],
  providers: [DatePipe]
})
export class DocumentPreparationComponent implements OnInit {
  @ViewChild("htmlData", { static: false }) htmlData: ElementRef;
  tempList: any;
  docListTables: any = [];
  assembly = null;
  session = null;
  assemblyId = null;
  sessionId = null;
  isCreateVisible = false;
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();
  checked = false;
  indeterminate = false;
  documentsList: any = [];
  date: any = null;
  allotmentDateId = 0;
  fileId: any = null;
  status;
  isRefreshVisible: boolean;
  assemblyList = [];
  sessionList = [];
  fileDesc: any;
  filePriority: any = null;
  fileSub: any = "";
  isSubmit: boolean;
  fileRes: any;
  refreshList: any;
  refreshLength: any;
  user: any;
  changeText;
  listId: any = null;
  refresh = false;
  docByListId: any;
  setOfDocIds = new Set<number>();
  printable = false;
  today: any = new Date();
  uploadURL = this.docService.uploadUrl();
  dateList: any = [];
  layingList: any = [];
  type: any = null;
  tempResponse: any = [];
  counter = Array;
  currentVersion: any;
  disabledCosDates: any;
  activeSession: any = [];
  title: any = null;
  isOrdinance = null;
  langSelectId: any = null;
  listNum: any = null;
  listPdfUrl: any = null;
  assemblySession: any = null;
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and todaya
    return differenceInCalendarDays(this.today, current) < 0;
  };

  constructor(
    private docService: DocumentsService,
    private router: Router,
    private commonService: CommonService,
    private fileService: FilesService,
    private notification: NzNotificationService,
    public route: ActivatedRoute,
    public datepipe: DatePipe,
    @Inject("authService") private AuthService,
    public translate: TranslateService,
  ) {
    this.user = AuthService.getCurrentUser();
    this.langSelectId = this.translate.getDefaultLang();
  }

  ngOnInit() {
    // this.getAssemblyList();
    // this.getSessionList();
    // this.currentAssemblyAndSession();
    this.getAllAssemblyAndSession();
    this.route.params.subscribe((params) => {
      this.listId = params.id;
      if (this.listId) {
        this.refresh = true;
        this.getPreparedList(this.listId);
      } else {
        this.listId = null;
        this.date = null;
        this.allotmentDateId = 0;
        this.getLayingList();
        this.getDoCList();
      }
    });
    // this.commonService.sharedAssemblyId.subscribe(
    //   (id) => (this.assemblyId = id)
    // );
    // this.commonService.sharedSessionId.subscribe((id) => (this.sessionId = id));
    //this.user = this.commonService.getCurrentUser();
    this.changeText = false;
  }

  // currentAssemblyAndSession() {
  //   this.commonService.getCurrentAssemblyAndSession().subscribe(Res => {
  //     this.activeSession = Res;
      // this.assemblyId = this.activeSession.assemblyId;
      // this.sessionId = this.activeSession.sessionId;
      // this.getAssemblyList();
      // this.getSessionList();
      // this.getDateList();
  //   });
  // }

  getAllAssemblyAndSession() {
    this.docService.getAllAssemblyAndSession().subscribe((Response: any) => {
      this.assemblySession = Response.assemblySession;
      this.activeSession  = Response.activeAssemblySession;
      this.assemblyList = Response.assembly.filter(x => x.assemblyId >= this.activeSession.assemblyValue);
      this.assemblyId = this.activeSession.assemblyId;
      this.sessionId = this.activeSession.sessionId;
      this.getSessionForAssembly();
    });
  }

  getSessionForAssembly() {
    this.sessionList = [];
    this.sessionId = null;
    if (this.assemblyId && this.assemblySession.find(x => x.id === this.assemblyId)) {
      this.sessionId = null;
      this.sessionList = this.assemblySession.find(x => x.id === this.assemblyId).session;
    }
    if (this.assemblyId === this.activeSession.assemblyId) {
      this.sessionList = this.sessionList.filter(x => x.sessionId >= this.activeSession.sessionValue);
    }
  }



  // getAssemblyList() {
  //   this.docService.getAllAssembly().subscribe((Response) => {
  //     const tempList: any = Response;
  //     this.assemblyList = tempList.filter(
  //       (x) => x.assemblyId >= this.activeSession.assemblyValue
  //     );
  //     this.assemblyId = this.activeSession.assemblyId;
  //     // const result = this.assemblyList.map((x) => x.id);
  //     // const maxValue = Math.max.apply(null, result);
  //     // this.assemblyId = maxValue;
  //     this.docService.getAllSession().subscribe((Res) => {
  //       const tempList: any = Res;
  //       this.sessionList = tempList.filter(
  //         (x) => x.sessionId >= this.activeSession.sessionValue
  //       );
  //       this.sessionId = this.activeSession.sessionId;
  //       // const res = this.sessionList.map((x) => x.id);
  //       // const maxVal = Math.max.apply(null, res);
  //       // this.sessionId = maxVal;
  //       this.getDateList();
  //     });
  //   });
  // }

  // getSessionList() {
  //   this.docService.getAllSession().subscribe((Response) => {
  //     const tempList: any = Response;
  //     this.sessionList = tempList.filter(
  //       (x) => x.id >= this.activeSession.sessionId
  //     );
  //     // this.sessionId = this.activeSession.sessionId;
  //     const result = this.sessionList.map((x) => x.id);
  //     const maxValue = Math.max.apply(null, result);
  //     this.sessionId = maxValue;
  //     this.getDateList();
  //   });
  // }

  getDoCList() {
    if (this.date) {
    if (this.isOrdinance === 'YES') {
      this.type = "ORDINANCE";
    } else {
      this.type = null;
    }
    this.docListTables = [];
    if (this.assemblyId === null || this.sessionId === null) {
      this.docListTables = [];
    } else {
      if (this.assemblyId && this.sessionId) {
        this.commonService.newAssemblyId(this.assemblyId);
        this.commonService.newSessionId(this.sessionId);
        this.docService
          .getAllDocuments(this.assemblyId, this.sessionId, this.type)
          .subscribe((Response) => {
            this.docListTables = Response;
            this.setOfDocIds = new Set<number>();
            if (this.docListTables.length === 0) {
              this.notification.create(
                "warning",
                "Warning",
                "No document available to prepare list!"
              );
            } else if (this.type === 'ORDINANCE' && this.docListTables[0].type !== 'ORDINANCE') {
              this.notification.create(
                "warning",
                "Warning",
                "No ordinance available to prepare list!"
              );
              this.docListTables = [];
            }
            // for (const table of this.docListTables) {
            //   table.isEmpty = false;
            //   for (const doc of table.documentMetaDatas) {
            //     doc.deleted = false;
            //     this.setOfDocIds.add(doc.id);
            //   }
            // }
            for (const table of this.docListTables) {
              table.isEmpty = false;
              for (const doc of table.documentMetaDatas) {
                doc.deleted = false;
                if (!table.type.split("_").includes("AMENDMENT")) {
                  this.setOfDocIds.add(doc.id);
                } else {
                  for (const amendment of doc.cplAmendmets) {
                    amendment.deleted = false;
                    this.setOfDocIds.add(amendment.id);
                  }
                }
              }
            }
            let serialNum = 0;
            this.docListTables.forEach((x, index) => {
            if (index === 0 || (index > 0 && x.minister !== this.docListTables[index - 1].minister)) {
              x.serialNumber = ++serialNum;
            } else {
             x.serialNumber = '';
             }
           });
          });
      }
    }
   }
  }
  // getDoCList() {
  // this.docListTables = this.docService.templist();
  // }

  viewDocument(id) {
    this.router.navigate(["business-dashboard/cpl/cpl-view", "view", id]);
  }

  showCreateModal(): void {
    if (this.date) {
      this.isCreateVisible = true;
    } else {
      this.notification.create("warning", "Warning", "Please select a date!");
    }
  }

  showAttachModal() {
    this.isRefreshVisible = true;
    if (this.docListTables[0].type === "ORDINANCE") {
      this.type = "ORDINANCE";
    } else {
      this.type = null;
    }
    this.getRefreshList();
  }

  handleCancel() {
    this.isCreateVisible = false;
    this.isRefreshVisible = false;
    this.setOfCheckedId = new Set<number>();
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
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
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.document.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.document.id)
      ) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
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

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.document.id, checked)
    );
    this.refreshCheckedStatus();
  }

  saveDocumentList() {
    let body: any = [];
    if (!this.refresh) {
      for (const table of this.docListTables) {
        for (const doc of table.documentMetaDatas) {
          if (!table.type.split("_").includes("AMENDMENT")) {
            if (doc.deleted) {
              this.setOfDocIds.delete(doc.id);
            }
          } else {
            for (const amendment of doc.cplAmendmets) {
              if (amendment.deleted) {
                this.setOfDocIds.delete(amendment.id);
              }
            }
          }
        }
      }
      body = {
        allotmentDateId: 0,
        assemblyId: this.assemblyId,
        docIds: [...this.setOfDocIds],
        fileId: 0,
        layingDate: this.date,
        sessionId: this.sessionId,
        status: "SAVED",
      };
    } else {
      this.isRefreshVisible = false;
      body = {
        allotmentDateId: 0,
        assemblyId: this.assemblyId,
        docIds: [...this.setOfCheckedId],
        fileId: this.docByListId.fileId,
        fileNumber: this.docByListId.fileNumber,
        layingDate: this.date,
        sessionId: this.sessionId,
        docListId: this.listId,
        status: this.docByListId.status,
        createdBy: this.docByListId.createdBy
      };
    }
    if (this.date) {
      this.docService.saveDocumentsList(body).subscribe((Res) => {
        this.isSubmit = false;
        if (!this.refresh) {
          this.notification.create(
            "success",
            "Success",
            "List saved successfully!"
          );
          this.router.navigate(["business-dashboard/cpl/documents-list"]);
        } else {
          this.notification.create(
            "success",
            "Success",
            "New document added to list successfully!"
          );
          this.getPreparedList(this.listId);
          this.getRefreshList();
          this.setOfCheckedId = new Set<number>();
        }
      });
    } else {
      this.notification.create("warning", "Warning", "Please select a date!");
    }
  }

  viewFileOrDoc(fileId, listId) {
    if (fileId === null) {
      this.router.navigate([
        "business-dashboard/cpl/document-preparation",
        listId,
      ]);
    } else {
      this.router.navigate(["business-dashboard/cpl/file-workflow", fileId]);
    }
  }

  createFile() {
    for (const table of this.docListTables) {
        for (const doc of table.documentMetaDatas) {
          if (doc.deleted) {
            this.setOfDocIds.delete(doc.id);
          }
       }
    }
    const tempDocIds = [...this.setOfDocIds];
    const tempFileFormDto = {
      assemblyId: this.assemblyId,
      sessionId: this.sessionId,
      type: "CPL",
      userId: this.user.userId,
      priority: this.filePriority,
      currentNumber: 0,
      description: this.fileDesc,
      sectionId: 7,
      subject: this.fileSub,
      subtype: "LIST",
    };
    const body = {
      docListId: this.listId,
      docIds: tempDocIds,
      layingDate: this.date,
      allotmentDateId: 0,
      fileFormDto: tempFileFormDto,
      status: "SUBMITTED",
    };
    if (this.date) {
      this.fileService.createDocumentList(body).subscribe((Res) => {
        this.fileRes = Res;
        this.notification.create(
          "success",
          "Success",
          "List created and attached to file successfully!"
        );
        // this.router.navigate(["business-dashboard/cpl/documents-list"]);
        this.router.navigate([
          'business-dashboard/cpl/file-workflow', this.fileRes[0].listFileId]);
        this.isSubmit = true;
        this.isCreateVisible = false;
        this.setOfCheckedId = new Set<any>();
        this.fileSub = null;
        this.filePriority = null;
        this.fileDesc = null;
        this.isRefreshVisible = false;
      });
    } else {
      this.notification.create("warning", "Warning", "Please select a date!");
    }
  }

  getRefreshList() {
    if (this.assemblyId && this.sessionId) {
      this.docService
        .getRefreshDocuments(this.assemblyId, this.sessionId, this.type)
        .subscribe((Response) => {
          this.refreshList = Response;
          this.refreshLength = this.refreshList.length;
          this.setOfCheckedId = new Set<number>();
        });
    }
  }

  removeDocument(docId) {
    
    const body = {
      id: docId,
    };
    this.docService.removeDocument(body).subscribe((Res) => {
      this.notification.create(
        "success",
        "Success",
        "Document deleted from list successfully!"
      );
      if (this.refresh) {
        this.getRefreshList();
        this.getPreparedList(this.listId);
      } else {
        this.isEmptyCheck();
      }
    });
  }

  isEmptyCheck() {
    let tableArray = [];
    for (const table of this.docListTables) {
      if (!table.type.split("_").includes("AMENDMENT")) {
        for (const doc of table.documentMetaDatas) {
          tableArray.push(doc.deleted);
        }
        if (tableArray.includes(false)) {
          table.isEmpty = false;
        } else {
          table.isEmpty = true;
        }
        tableArray = [];
      } else {
        let amendmentArray = [];
        for (const doc of table.documentMetaDatas) {
          for (const amendment of doc.cplAmendmets) {
            amendmentArray.push(amendment.deleted);
          }
        }
        if (amendmentArray.includes(false)) {
          table.isEmpty = false;
        } else {
          table.isEmpty = true;
        }
        amendmentArray = [];
      }
    }
  }

  getPreparedList(listId) {
    this.setOfDocIds = new Set<number>();
    // this.getDateList();
    this.docService.getDocumentByListId(listId).subscribe((Res) => {
      const tempList: any = Res;
      this.tempResponse = Res;
      this.title = this.tempResponse.latestList.title;
      this.listNum = this.tempResponse.latestList.title.match(/\d+/)[0];
      this.currentVersion = this.tempResponse.latestList.currentVersion;
      this.getVersion(this.currentVersion);
      // this.docByListId = tempList.latestList;
      // for (const table of this.docByListId.documentsByPortfolioDtos) {
      //   table.isEmpty = false;
      //   for (const doc of table.documentMetaDatas) {
      //     doc.deleted = false;
      //     this.setOfDocIds.add(doc.id);
      //   }
      // }
      // this.docListTables = this.docByListId.documentsByPortfolioDtos;
      // this.date = this.docByListId.layingDate;
      // this.allotmentDateId = 0;
    });
  }

  goBack() {
    window.history.back();
  }
  captureScreen() {
    let doc = new jsPdf("p", "pt");
    doc.autoTable({ html: "#data" });
    doc.autoTable({ html: "#mladata" });

    var blob = doc.output("blob");
    var w = window.open(URL.createObjectURL(blob));
  }
  printableScreen() {
    const mediaType = 'application/pdf';
    this.fileService.getPdfList(this.tempResponse.latestList.fileId).subscribe((res: any) => {
      const temp: any = res;
      const blob = new Blob([temp], { type: mediaType });
      this.listPdfUrl = URL.createObjectURL(blob);
      this.printable = true;
    });
  }
  cancelPrint() {
    this.printable = false;
  }

  cancel() {}
  // public openPDF_old():void {
  //   let DATA = this.htmlData.nativeElement;
  //   let doc = new jsPdf("p", "pt",'a4');
  //   doc.fromHTML(DATA.innerHTML,5,5);
  //   doc.output('dataurlnewwindow');
  //   this.uploadURL = this.docService.uploadUrl();
  //   console.log(this.uploadURL);
  // }

  public openPDF(): void {
    let neVal = this.htmlData.nativeElement.querySelectorAll(".table_blkp");
    let doc = new jsPdf("p", "pt");
    //let pdf;
    let i = 0;
    let totalCount = neVal.length;
    doc.autoTable({ html: "#head1" });
    neVal.forEach(function (value) {
      doc.autoTable({ html: "#head_" + i });
      doc.autoTable({ html: "#table_" + i });
      i++;
      // if (i === totalCount) {
      //   //pdf = doc.output("blob");
      //   doc.output("dataurlnewwindow");
      // }
    });
    doc.autoTable({ html: "#foot1" });
    if (i === totalCount) {
      //pdf = doc.output("blob");
      doc.output("dataurlnewwindow");
    }
  }

  public downloadPDF(): void {
    let DATA = this.htmlData.nativeElement;
    let doc = new jsPdf("p", "pt", "a4");
    let handleElement = {
      "#editor": function (element, renderer) {
        return true;
      },
    };
    doc.fromHTML(DATA.innerHTML, 30, 30, {
      width: 300,
      elementHandlers: handleElement,
    });
    doc.save("angular-demo.pdf");
  }

  getDateList() {
    this.assembly = this.assemblyList.find(x => x.id === this.assemblyId).assemblyId;
    this.session = this.sessionList.find(x => x.id === this.sessionId).sessionId;
    this.docService.getDates(this.assemblyId, this.sessionId).subscribe(Res => {
      this.dateList = Res;
      this.disabledCosDates = (current: Date): boolean => {
          const todayDate = current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) +'-'+ ('0' + current.getDate()).slice(-2);
          return !this.dateList.find(item => item === todayDate);
      };
    });
    // this.dateList = ["2020-07-23", "2020-07-25", "2020-07-27"];
  }

  onDateChange() {
    const dateArray = [];
    for (const list of this.layingList) {
      dateArray.push(list.layingDate);
    }
    // if (dateArray.includes(this.datepipe.transform(this.date, 'yyyy-MM-dd').toString())) {
    //   this.notification.create(
    //     "warning",
    //     "Warning",
    //     "List already exist in this date!"
    //   );
    //   this.docListTables = [];
    // } else

    // if (this.datepipe.transform(this.date, 'yyyy-MM-dd').toString().includes(this.dateList[0])) {
    //   this.type = "ORDINANCE";
    //   this.getDoCList();
    // } else {
    //   this.type = null;
    //   this.getDoCList();
    // }

    this.getDoCList();
  }

  getLayingList() {
    if (this.assemblyId === null || this.sessionId === null) {
      this.layingList = [];
    } else {
      if (this.assemblyId && this.sessionId) {
        this.docService
          .getLayingDateList(this.assemblyId, this.sessionId)
          .subscribe((Response) => {
            this.layingList = Response;
          });
      }
    }
  }

  getVersion(version) {
    this.docByListId = this.tempResponse.versionMap[version];
    for (const table of this.docByListId.documentsByPortfolioDtos) {
      table.isEmpty = false;
      for (const doc of table.documentMetaDatas) {
        doc.deleted = false;
        this.setOfDocIds.add(doc.id);
      }
    }
    this.docListTables = this.docByListId.documentsByPortfolioDtos;
    this.date = this.docByListId.layingDate;
    this.allotmentDateId = 0;
    let serialNum = 0;
    this.docListTables.forEach((x, index) => {
      if (index === 0 || (index > 0 && x.minister !== this.docListTables[index - 1].minister)) {
        x.serialNumber = this.romanize(++serialNum);
      } else {
        x.serialNumber = '';
      }
    });
  }

  returnVersion() {
    return 'cpl.filelistflow.version';
  }

  romanize(num) {
    if (isNaN(num))
        return NaN;
    let digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}
}
