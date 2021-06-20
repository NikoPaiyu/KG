import { Component, OnInit, ViewChild } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { QuestionMenus } from "../../question.menus";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { CalenderofsittingService } from "../../../calender-of-sitting/shared/services/calenderofsitting.service";
import { AodService } from "../../../aod/shared/service/aod.service";
import { SoaService } from "../../../soa/shared/services/soa.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-question-report",
  templateUrl: "./question-report.component.html",
  styleUrls: ["./question-report.component.scss"],
})
export class QuestionReportComponent implements OnInit {
  @ViewChild("pdfViewerOnDemand", { static: true }) pdfViewerOnDemand;
  dashBoardUrl;
  assemblySession: object = [];
  questionDates = [];
  questionDate;
  finalUrl;
  loading = false;
  AODData: any;
  reportParams = {
    heading: "",
    showQdate: false,
    reportType: "",
    buttonLabel: "",
    showButton: false,
    showPdf: false,
    canshowtoMLAPPO: true,
  };
  constructor(
    private questionMenus: QuestionMenus,
    private questionSerivce: QuestionService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public auth: AuthService,
    private notify: NotificationCustomService,
    public cobservice: CalenderofsittingService,
    public aodService: AodService,
    public soaService: SoaService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.dashBoardUrl = this.questionMenus.getDashBoardUrl();
    this.getAssemblySession();
  }
  getAssemblySession() {
    this.questionSerivce.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.findSessionListByAssembly(this.assemblySession['assembly'].currentassembly);
        this.assemblySession['session'].currentsession = this.assemblySession['session'].find(
          (element) => element.id === this.assemblySession['activeAssemblySession'].sessionId).id;
        this.setDataBasedonUrl();
        }
    });
  }
  findSessionListByAssembly(selAssembly) {
    if (this.assemblySession) {
      if (this.assemblySession['sessionByAssembly'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['sessionByAssembly'].find(
          (element) => element.id === selAssembly).session;
        this.assemblySession['session'] = session;
      }
    }
    if(this.assemblySession['session'].currentsession) {
      this.checkPermission();
    }
  }
  
  setDataBasedonUrl() {
    if (this.router.url.includes("question/qstn-cos-rpt")) {
      this.reportParams.heading = "Calendar of Sittings";
      this.reportParams.showQdate = false;
      this.reportParams.reportType = "cos";
      this.reportParams.buttonLabel = "Calendar Report";
      this.reportParams.showButton = true;
      if (this.isMLAPPO() || this._IsDepartment()) {
        this.checkCOSPermission();
      }
    }
    if (this.router.url.includes("question/qstn-aod-rpt")) {
      this.reportParams.heading = "Allotment of Days";
      this.reportParams.showQdate = false;
      this.reportParams.reportType = "aod";
      this.reportParams.buttonLabel = "Allotment of Days Report";
      this.reportParams.showButton = true;
      // if (this.isMLAPPO() || this._IsDepartment()) {
      //   this.checkAODPermission();
      // }
    }
    if (this.router.url.includes("question/qstn-soa-rpt")) {
      this.reportParams.heading = "Schedule of Answer Report";
      this.reportParams.showQdate = false;
      this.reportParams.reportType = "soa";
      this.reportParams.buttonLabel = "Schedule of Answer Report";
      this.reportParams.showButton = true;
      if (this._IsDepartment()) {
        this.checkSOAPermission();
      }
    }
    if (
      this.router.url.includes("question/qstn-soactivity-rpt")
    ) {
      this.reportParams.heading = "Schedule of Activity Report";
      this.reportParams.showQdate = false;
      this.reportParams.reportType = "soactivity";
      this.reportParams.buttonLabel = "Schedule of Activity Report";
      this.reportParams.showButton = true;
    }
    if (
      this.router.url.includes("question/qstn-starredqstn-rpt")
    ) {
      this.reportParams.heading = "Starred Question Booklet";
      this.reportParams.showQdate = true;
      this.reportParams.reportType = "starredqstn";
      this.reportParams.buttonLabel = "Starred Question Booklet";
      this.reportParams.showButton = true;
      this.getQuestionDate();
    }
    if (
      this.router.url.includes("question/qstn-unstarredqstn-rpt")
    ) {
      this.reportParams.heading = "Unstarred Question Booklet";
      this.reportParams.showQdate = true;
      this.reportParams.reportType = "unstarredqstn";
      this.reportParams.buttonLabel = "Unstarred Question Booklet";
      this.reportParams.showButton = true;
      this.getApprovedQuestionDates();
    }
    if (
      this.router.url.includes("question/qstn-ballotchart-rpt")
    ) {
      this.reportParams.heading = "Ballot Chart Report";
      this.reportParams.showQdate = false;
      this.reportParams.reportType = "ballotchart";
      this.reportParams.buttonLabel = "Ballot Chart Report";
      this.reportParams.showButton = true;
      if (this.isMLAPPO()) {
        this.checkSOAPermission();
      }
    }
    if (
      this.router.url.includes("question/qstn-ans-statistics-rpt")
    ) {
      this.reportParams.heading = "Answer Received Statistics";
      this.reportParams.showQdate = true;
      this.reportParams.reportType = "ansstatistics";
      this.reportParams.buttonLabel = "Answer Received Statistics";
      this.reportParams.showButton = true;
      this.getQuestionDate();
    }
  }
  getQuestionDate() {
    this.questionSerivce
      .getBallotedDates(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        this.questionDates = [];
        if (res && res.length > 0) {
          this.questionDates = res;
        }
      });
  }
  getApprovedQuestionDates() {
    this.questionSerivce.getApprovedUnstarredQuestionDates(
      this.assemblySession["assembly"].currentassembly,
      this.assemblySession["session"].currentsession
    ).subscribe(res => {
      this.questionDates = [];
      if (res && res.length > 0) {
        this.questionDates = res.map(x => ({ date: x }));
      }
    });
  }
  setReportType(reportType) {
    this.reportParams.reportType = reportType;
    this.onAssemblySessionChange();
  }
  onAssemblySessionChange() {
    if (
      this.assemblySession["assembly"].currentassembly == null ||
      this.assemblySession["session"].currentsession == null
    ) {
      this.notify.showWarning("", "Assembly or Session is empty");
      return;
    }
    switch (this.reportParams.reportType) {
      case "cos":
        this.getCOSReport();
        break;
      case "aod":
        this._showAODReport();
        break;
      case "soa":
        this.getSOAReport("ScheduleOfAnswer");
        break;
      case "soactivity":
        this.getSOAReport("SOAReport");
        break;
      case "ballotchart":
        this.getSOAReport("BallotChartReport");
        break;
      case "starredqstn":
        if (this.questionDate == null) {
          this.notify.showWarning("Please Select Question Date", "");
          return;
        }
        this.getStarredQuestionReport();
        break;
      case "unstarredqstn":
        if (this.questionDate == null) {
          this.notify.showWarning("Please Select Question Date", "");
          return;
        }
        this.getUnStarredQuestionReport();
        break;
      case "ansstatistics":
        if (this.questionDate == null) {
          this.notify.showWarning("Please Select Question Date", "");
          return;
        }
        this.getAnswerReceivedStaticstics();
        break;
      default:
        break;
    }
  }
  _showAODReport() {
    if (this.isMLAPPO() || this._IsDepartment()) {
      this.checkAODPermission();
      return;
    }
    this.getAODReport();
  }
  getCOSReport() {
    if (!this.reportParams.canshowtoMLAPPO) {
      this.reportParams.showPdf = false;
      this.notify.showWarning("Sorry Report is not Available", "");
      return;
    }
    this.questionSerivce
      .getApprovedCos(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res) {
          res.assemblyId = this.convertAssembly(res.assemblyId);
          res.sessionId = this.convertSession(res.sessionId);
          res.reportType = "COSReport";
          res.location = "report.pdf";
          if (res.calendarOfDaysList) {
            this.getPDF(res);
          } else {
            this.reportParams.showPdf = false;
            this.notify.showWarning("Sorry Report is not Available", "");
          }
        }
      });
  }
  getAODReport() {
    if (!this.reportParams.canshowtoMLAPPO) {
      this.reportParams.showPdf = false;
      this.notify.showWarning("Sorry Report is not Available", "");
      return;
    }
    this.questionSerivce
      .getAODReport(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res) {
          if (this.AODData) {
            res.aodMasterDataDto = this.AODData;
          }
          res.aodMasterDataDto.assemblyId = this.convertAssembly(
            res.aodMasterDataDto.assemblyId
          );
          res.aodMasterDataDto.sessionId = this.convertSession(
            res.aodMasterDataDto.sessionId
          );
          res.reportType = "AODReport";
          res.location = "report.pdf";
          if (res.aodMasterDataDto.fileStatus == "APPROVED") {
            res.IsBulletin = false;
            if (this.isMLAPPO()) {
              res.IsBulletin = true;
            }
            this.getPDF(res);
          } else {
            this.reportParams.showPdf = false;
            this.notify.showWarning("Sorry Report is not Available", "");
          }
        }
      });
  }
  getSOAReport(reportType) {
    if (
      !this.reportParams.canshowtoMLAPPO &&
      reportType === "BallotChartReport"
    ) {
      this.reportParams.showPdf = false;
      this.notify.showWarning("Sorry Report is not Available", "");
      return;
    }
    this.questionSerivce
      .getApprovedSOA(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.auth.getCurrentUser().userId
      )
      .subscribe((res: any) => {
        if (res) {
          res.assemblyId = this.convertAssembly(res.assemblyId);
          res.sessionId = this.convertSession(res.sessionId);
          res.reportType = reportType;
          res.location = "report.pdf";
          if (res.wfStatus == "APPROVED") {
            res.IsBulletin = false;
            if (this.isMLAPPO() && reportType === "BallotChartReport") {
              res.IsBulletin = true;
            }
            this.getPDF(res);
          } else {
            this.reportParams.showPdf = false;
            this.notify.showWarning("Sorry Report is not Available", "");
          }
        }
      });
  }
  getStarredQuestionReport() {
    let result = {};
    this.questionSerivce
      .getStarredPreviewData(this.questionDate)
      .subscribe((res: any) => {
        result = res ? res : {};
        if (res) {
          res.assemblyId = this.convertAssembly(res.assemblyId);
          res.sessionId = this.convertSession(res.sessionId);
          res.reportType = "StarredQuestionReport";
          res.location = "report.pdf";
          if (res.questions) {
            this.getPDF(res);
          } else {
            this.reportParams.showPdf = false;
            this.notify.showWarning("Sorry Report is not Available", "");
          }
        }
      });
    if (Object.keys(result).length === 0) {
      this.reportParams.showPdf = false;
    }
  }
  getAnswerReceivedStaticstics() {
    let result = {};
    this.questionSerivce
      .getAnswerReceivedStaticstics(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession,
        this.questionDate
      )
      .subscribe((res: any) => {
        let result = {};
        result["reportType"] = "AnswerReceivedStatistics";
        result["location"] = "report.pdf";
        if (!res) {
          this.reportParams.showPdf = false;
          this.notify.showWarning("Sorry Report is not Available", "");
          return;
        }
        result["data"] = res ? res : {};
        result["assemblyId"] = this.convertAssembly(res.assemblyId);
        result["sessionId"] = this.convertSession(res.sessionId);
        result["questionDate"] = res[0].questionDate;
        this.getPDF(result);
      });
    if (Object.keys(result).length === 0) {
      this.reportParams.showPdf = false;
    }
  }
  getUnStarredQuestionReport() {
    let result = {};
    this.questionSerivce
      .getUnstarredPreviewData(
        this.questionDate,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        result = res ? res : {};
        if (res) {
          res.assemblyId = this.convertAssembly(res.assemblyId);
          res.sessionId = this.convertSession(res.sessionId);
          res.reportType = "UnStarredQuestionReport";
          res.location = "report.pdf";
          if (res.questions) {
            this.getPDF(res);
          } else {
            this.reportParams.showPdf = false;
            this.notify.showWarning("Sorry Report is not Available", "");
          }
        }
      });
    if (Object.keys(result).length === 0) {
      this.reportParams.showPdf = false;
    }
  }

  convertSession(sessionId) {
    let sessionid;
    sessionid = this.assemblySession["session"].find(
      (item) => item.id === this.assemblySession["session"].currentsession
    );
    return sessionid.sessionId;
  }
  convertAssembly(assembly) {
    let assemblyId;
    assemblyId = this.assemblySession["assembly"].find(
      (item) => item.id === this.assemblySession["assembly"].currentassembly
    );
    return assemblyId.assemblyId;
  }
  getPDF(body) {
    var mediaType = "application/pdf";
    this.loading = true;
    this.finalUrl = null;
    this.questionSerivce.getReport(body).subscribe((response) => {
      if (response) {
        var blob = new Blob([response], { type: mediaType });
        this.finalUrl = URL.createObjectURL(blob);
        // this.reportParams.showPdf = (this.finalUrl) ? true : false;
        // this.finalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        // this.loading = (this.reportParams.showPdf && this.finalUrl) ? false : true;
      } else {
        this.reportParams.showPdf = false;
        this.notify.showWarning("Sorry Report is not Available", "");
      }
    });
  }
  checkCOSPermission() {
    this.cobservice
      .getCosReportPermission(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        this.reportParams.canshowtoMLAPPO = true;
        if (!res.calendarofSittingId) {
          this.reportParams.canshowtoMLAPPO = false;
        }
      });
  }
  checkAODPermission() {
    this.aodService
      .getAODReportPermission(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        this.reportParams.canshowtoMLAPPO = true;
        this.AODData = res;
        if (!res.assemblyId && !res.fileStatus) {
          this.reportParams.canshowtoMLAPPO = false;
        }
        this.getAODReport();
      });
  }
  checkSOAPermission() {
    this.soaService
      .getSOAReportPermission(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        this.reportParams.canshowtoMLAPPO = true;
        if (res.scheduleDates.length === 0 && !res.status) {
          this.reportParams.canshowtoMLAPPO = false;
        }
      });
  }
  checkPermission() {
    this.finalUrl = null;
    if (this.isMLAPPO() || this._IsDepartment()) {
      if (this.reportParams.reportType === "cos") {
        this.checkCOSPermission();
      }
      // if (this.reportParams.reportType === "aod") {
      //   this.checkAODPermission();
      // }
      if (
        this.reportParams.reportType === "ballotchart" ||
        this.reportParams.reportType === "soa"
      ) {
        this.checkSOAPermission();
      }
    }
    if (
      this.router.url.includes("question/qstn-unstarredqstn-rpt")
    ) {
      this.getApprovedQuestionDates();
      return;
    }
    this.getQuestionDate();
  }
  _IsDepartment() {
    return this.auth.getCurrentUser().authorities.includes("Department");
  }
  isMLA() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return false;
    }
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  isMLAPPO() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return false;
    }
    return (
      this.auth.getCurrentUser().authorities.includes("MLA") ||
      this.auth
        .getCurrentUser()
        .authorities.includes("parliamentaryPartySecretary")
    );
  }
  afterLoaded(e) {
    this.reportParams.showPdf = this.finalUrl ? true : false;
    this.loading = this.reportParams.showPdf && this.finalUrl ? false : true;
  }
}
