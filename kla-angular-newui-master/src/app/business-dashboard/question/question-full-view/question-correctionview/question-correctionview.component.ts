import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { Question } from "../../shared/model/question";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { Location } from "@angular/common";
import { NzModalService, NzModalRef } from "ng-zorro-antd";
import { QuestionansPreviewComponent } from "../../shared/component/questionans-preview/questionans-preview.component";
import * as jspdf from "jspdf";
@Component({
  selector: "app-question-correctionview",
  templateUrl: "./question-correctionview.component.html",
  styleUrls: ["./question-correctionview.component.scss"],
})
export class QuestionCorrectionViewComponent implements OnInit {
  showButtons = true;
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  qDetail;
  portfolio;
  ministerSubjects;
  ministerSubSubject;
  ruleList: any;
  activityFlowList: any;
  withdrawFlowList: any;
  correctionReqFlowList: any;
  revokeFlowList: any;
  showClauseAns;
  isChange: boolean = false;
  noticeNoArray = [];
  assemblySession: object = [];
  changeCategoryReason = false;
  changeCategoryRule = "";
  statusParam = "";
  primaryFlag: boolean;
  currentRole;
  returnRoles = [];
  clubbRemovalWorkflow = [];
  clubbRemovedWorkflow: any;
  clubbingRemovalRequest = [];
  qdateForCorrection = null;
  questionDate = [];
  showDate = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private auth: AuthService,
    private location: Location,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.qDetail = new Question();
    this.route.params.subscribe((params) => {
      const questionId = params.id;
      this.statusParam = params.status;
      if (questionId && this.auth.getCurrentUser().userId) {
        this.question
          .getView(questionId, this.auth.getCurrentUser().userId)
          .subscribe((response) => {
            this.getAssemblySession(response);
          });
      }
    });
  }
  getAssemblySession(response) {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
          this.qDetail = response["question"];
          this.assemblySession["assemblyId"] = this.assemblySession['assembly'].find(
            (item) => item.id === this.qDetail.assemblyId
          ).assemblyId;
          this.assemblySession["sessionId"] = this.assemblySession['session'].find(
            (item) => item.id === this.qDetail.sessionId
          ).sessionId;
          this.handleResponse(response);
        }
    });
  }
  handleResponse(response) {
    this._handleResponseData();
    this._drawWorkflowTracking();
    this._bindData(response);
    this._setMinisterData(response);
  }
  getActivityFlow() {
    this.question
      .getActivityFlow(this.qDetail.workFlowId)
      .subscribe((Response) => {
        if (this.qDetail.revokedWorkFlowId) {
          this.revokeFlowList = Response;
          if (this.revokeFlowList[0].owner == "assistant") {
            this.revokeFlowList.shift();
          }
          if (
            this.qDetail.status === "DISALLOWED" &&
            this.qDetail.disallowedBy
          ) {
            let lastIndex = this.revokeFlowList.slice(-1).pop();
            lastIndex.owner = "Disallowed By " + lastIndex.owner;
            lastIndex.endWrkflow = true;
          }
        } else {
          this.activityFlowList = Response;
        }
        if (
          this.qDetail.withdrawelStatus === "WITHDRAWEL_REQUESTED" &&
          this.qDetail.withdrawelWorkFlowId
        ) {
          this.activityFlowList.push({
            processInstanceId: null,
            startTime: null,
            endTime: null,
            reason: "in progress",
            owner: "MLA",
            endWrkflow: true,
          });
        }
        if (
          this.qDetail.status === "DISALLOWED" &&
          this.qDetail.disallowedBy &&
          !this.qDetail.revokedWorkFlowId
        ) {
          let lastIndex = this.activityFlowList.slice(-1).pop();
          lastIndex.owner = "Disallowed By " + lastIndex.owner;
          lastIndex.endWrkflow = true;
        }
      });
  }
  getWithdrawTracking() {
    if (this.qDetail.withdrawelWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.withdrawelWorkFlowId)
        .subscribe((Response) => {
          this.withdrawFlowList = Response;
        });
    }
  }
  getClubbRemoveTracking() {
    let clubb;
    this.qDetail.clubbingDetails.forEach((element) => {
      if (element.withdrawalWorkflowId != null) {
        this.question
          .getActivityFlow(element.withdrawalWorkflowId)
          .subscribe((Response) => {
            clubb = Response;
            clubb.memberDetails = element;
            this.clubbRemovalWorkflow.push(clubb);
          });
      }
    });
  }
  getCorrectionReqTracking() {
    if (this.qDetail.correctionRequestWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.correctionRequestWorkFlowId)
        .subscribe((Response) => {
          this.correctionReqFlowList = Response;
        });
    }
    if (this.qDetail.correctionRequestAfterSabhaWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.correctionRequestAfterSabhaWorkFlowId)
        .subscribe((Response) => {
          this.correctionReqFlowList = Response;
        });
    }
  }
  getRevokedNoticeTracking() {
    if (this.qDetail.revokedWorkFlowId) {
      this.question
        .getActivityFlow(this.qDetail.revokedWorkFlowId)
        .subscribe((Response) => {
          this.activityFlowList = Response;
          this.qDetail.revokedByName = this.activityFlowList
            .slice(-1)
            .pop().owner;
          if (this.qDetail.revokedWorkFlowId) {
            this.activityFlowList.push({
              processInstanceId: null,
              startTime: null,
              endTime: null,
              reason: "in progress",
              owner: "Revoked By " + this.qDetail.revokedByName,
              endWrkflow: true,
            });
          }
        });
    }
  }
  onBack(status) {
    this.router.navigate([
      "business-dashboard/question/list-dept",
      this.statusParam,
    ]);
  }
  showAnswerVersion() {
    this.router.navigate([
      "business-dashboard/question/question-answer-versions",
      this.qDetail.id,
    ]);
  }
  _bindData(response) {
    this.qDetail.clauses.sort((a, b) =>
      a.clauseOrder > b.clauseOrder ? 1 : -1
    );
    if (this.qDetail.clauses) {
      const clauses = this.qDetail.clauses;
      this.showClauseAns = clauses.every(
        (val, i, arr) => val.answer && val.answer.type
      );
    }
  }
  IsQsOfficials() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return true;
    }
    if (
      this.auth.getCurrentUser().authorities.includes("MLA") ||
      this.auth
        .getCurrentUser()
        .authorities.includes("parliamentaryPartySecretary")
    ) {
      return false;
    }
    return true;
  }
  _setMinisterData(ministerDet) {
    this.ministerSubjects = ministerDet["ministerSubjects"]
      ? ministerDet["ministerSubjects"]
      : [];
    this.portfolio = ministerDet["portfolio"] ? ministerDet["portfolio"] : [];
    this.portfolio = this.portfolio.find(
      (o) => o.id === this.qDetail.respondentMemberId
    );
    this.ministerSubjects = this.ministerSubjects.find(
      (o) => o.id === this.qDetail.ministerSubjectId
    );
  }
  _getMinisterSubSubjectData(id) {
    if (
      this.ministerSubjects &&
      this.ministerSubjects.ministerSubSubjects.length > 0 &&
      id
    ) {
      return this.ministerSubjects.ministerSubSubjects.find(
        (element) => element.id == id
      );
    } else {
      return { title: "" };
    }
  }
  _handleResponseData() {
    if (
      this.qDetail.requestChangeReply === true &&
      this.statusParam !== "PENDING_FOR_WITHDRAWAL"
    ) {
      this.isChange = true;
    }
    if (this.qDetail.tags) {
      this.qDetail.tags.sort((a, b) => (a.tagOrder > b.tagOrder ? 1 : -1));
    }
    if (this.qDetail.clubbingDetails) {
      this.qDetail.clubbingDetails.forEach((element) => {
        this.noticeNoArray.push(element.noticeNumber);
      });
      this.noticeNoArray.sort();
    }
    if (
      this.qDetail.type === "NORMAL" &&
      this.qDetail.category == "UNSTARRED" &&
      this.qDetail.directions.length > 0
    ) {
      let rulearray = [];
      rulearray = this.qDetail.directions.filter(
        (element) => element.type === "DIRECTION"
      );
      if (rulearray.length > 0) {
        const item = rulearray.reduce((prev, current) =>
          +prev.id > +current.id ? prev : current
        );
        this.changeCategoryReason = true;
        this.changeCategoryRule = item.direction;
      }
    }
  }
  _drawWorkflowTracking() {
    this.getActivityFlow();
    this.getWithdrawTracking();
    this.getRevokedNoticeTracking();
    this.getCorrectionReqTracking();
    this.getClubbRemoveTracking();
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
  _IsQuestion(status) {
    if (
      status === "WAITING_FOR_ANSWER" ||
      status === "TAKEN" ||
      status === "CORRECTION_APPROVED" ||
      status === "ANSWERED" ||
      status === "CORRECTION_REQUEST_AFTER_SABHA"
    ) {
      return true;
    }
    return false;
  }
  createPreviewModal() {
    this.modalService.create({
      nzContent: QuestionansPreviewComponent,
      nzWidth: "800",
      nzFooter: null,
      nzComponentParams: {
        qDetail: this.qDetail,
        assembly: this.assemblySession["assemblyId"],
        session: this.assemblySession["sessionId"],
        ministersubject: this.ministerSubjects,
        portFolio: this.portfolio,
      },
    });
  }
  capitalize(string) {
    if (typeof string !== "string") return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  DownloadFile(data) {
    if (this.checkURL(data)) {
      var img = new Image();
      img.src = data;
      this.generatePDF(img);
      return;
    }
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", data);
    link.setAttribute("download", data);
    document.body.appendChild(link);
    link.click();
  }
  checkURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }
  generatePDF(img) {
    var doc = new jspdf("p", "mm", "a4");
    doc.addImage(img, "JPEG", 10, 10, 180, 200);
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
    // doc.open();
  }
  basicPopup() {
    let popupWindow = window.open(
      this.qDetail.correctionAttachmentUrl,
      "popUpWindow",
      "height=800,width=800,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
    );
  }
}
