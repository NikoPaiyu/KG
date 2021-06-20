import { Component, OnInit, ViewChild } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { NzModalService } from "ng-zorro-antd";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { BookletPreviewComponent } from "../../shared/component/booklet-preview/booklet-preview.component";
import { ActivatedRoute, Router } from "@angular/router";
import { QnbookletService } from "../shared/qnbooklet.service";
import { FormControl, Validators } from "@angular/forms";
import { NotesComponent } from "../../shared/component/notes/notes.component";

@Component({
  selector: "app-boolet-flow",
  templateUrl: "./boolet-flow.component.html",
  styleUrls: ["./boolet-flow.component.scss"],
})
export class BooletFlowComponent implements OnInit {
  configurableParms = {
    minTitleChar: 0,
    maxTitleChar: 100,
    minClauseWord: 0,
    maxReasonChar: 255,
  };
  bookletDetails = {
    assemblyId: null,
    sessionId: null,
    questionDate: null,
    currentAssignee: false,
    workflowId: null,
    questionBooklet: []
  };
  @ViewChild(NotesComponent, { static: false }) notes: NotesComponent;
  showNotes = false;
  questionNumber = new FormControl(null);
  showVersion = false;
  questionVersion;
  selectedVersion = null;
  currentVersion = null;
  editable = false;
  clauseNo = ["A", "B", "C", "D", "E", "F", "G", "H"];
  versionsCombo = [];
  questionDates: any = [];
  dateFormat = "dd/MM/yyyy";
  ballotingDetails: any = [];
  ballotingLines: any = [];
  questionBooklet: any = [];
  filteredBallotingLines = [];
  questionDate;
  isBallotApproved = true;
  assemblySession: object = [];
  ClubbedMembers = { show: false, data: [] };
  previewData = {};
  questionSel: object;
  pendingData = [];
  showPendingModal = false;
  assemblyList = [];
  sessionList = [];
  bookletId = null;
  constructor(
    private question: QuestionService,
    private modalService: NzModalService,
    private notify: NotificationCustomService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public service: QnbookletService
  ) {}

  ngOnInit() {
    const bookletId = this.getBookletId();
    if (bookletId) {
      this.bookletId = bookletId;
      this.getBookletById();
      this.getAssemblySession();
      this.service.getUserPermissions(this.auth.getCurrentUser().userId);
      this.questionNumber.valueChanges.subscribe((data) => {
        this.filterBooklet(data);
      });
    }
  }
  filterBooklet(questionNo) {
    this.filteredBallotingLines = this.ballotingLines.filter(
      (x) => x.questionNumber == questionNo
    );
    if (!questionNo) {
      this.filteredBallotingLines = this.ballotingLines;
    }
  }
  getBookletId() {
    return this.route.snapshot.params.id;
  }
  getBookletById() {
    const userId = this.auth.getCurrentUser().userId;
    this.service.getBookletById(this.bookletId, userId).subscribe((data) => {
      this.questionBooklet = data.questionBooklet;
      this.ballotingLines = data.questionBooklet.questions;
      this.filteredBallotingLines = this.ballotingLines;
      this.bookletDetails = data;
    });
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.assemblyList = this.assemblySession['assembly'] as any;
        this.sessionList = this.assemblySession['session'] as any;
      }
    });
  }
  getQuestionDate() {
    this.question
      .getDate(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        if (res) {
          let today = new Date().toISOString().split("T")[0];
          this.questionDates = res.filter((date) => date > today);
          this.questionDates.sort();
        }
      });
  }
  getBallotDetailedView() {
    this.ballotingLines = [];
    this.isBallotApproved = true;
    this.getBookletById();
  }

  getPreviewData() {
    this.previewData = {};
    // this.question
    //   .getUnstarredPreviewData(
    //     this.bookletDetails.questionDate,
    //     this.assemblySession["session"].currentsession
    //   )
    //   .subscribe((res: any) => {
    //     this.previewData = res ? res : {};
    //     this.createPreviewModal();
    //   });
    this.previewData = this.bookletDetails.questionBooklet;
    this.createPreviewModal();
  }

  sendData() {
    this.question.sendUnstarredData(this.questionDate).subscribe((res: any) => {
      this.notify.showSuccess("Success", "Sent to Department");
    });
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.ballotingLines.filter((item) => item);
    if (sort.key && sort.value) {
      this.ballotingLines = data.sort((a, b) =>
        sort.value === "ascend"
          ? this._sortQuestionAsc(a, b, sort)
            ? 1
            : -1
          : this._sortQuestionDesc(a, b, sort)
          ? 1
          : -1
      );
    } else {
      this.ballotingLines = data;
    }
  }

  _sortQuestionAsc(a, b, sort) {
    if (a[sort.key] && b[sort.key]) {
      return a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase();
    }
  }
  _sortQuestionDesc(a, b, sort) {
    if (a[sort.key] && b[sort.key]) {
      return b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase();
    }
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }

  _showClubbedMembers(question) {
    this.ClubbedMembers.show = true;
    this.ClubbedMembers.data = question;
  }

  createPreviewModal() {
    this.modalService.create({
      nzContent: BookletPreviewComponent,
      nzWidth: "800",
      nzFooter: null,
      nzComponentParams: {
        previewData: this.previewData,
        assembly: this.assemblySession["assembly"]
          ? this.assemblySession["assembly"].currentassemblyLabel
          : "",
        session: this.assemblySession["session"]
          ? this.assemblySession["session"].currentsessionLabel
          : "",
      },
    });
  }

  openPendingModal() {
    this.showPendingModal = true;
  }
  sumofPendingData(pendingData) {
    let sum = 0;
    sum = pendingData
      .map((item: any) => item.pendingCount)
      .reduce((sum, current) => sum + current, 0);
    return sum;
  }
  cancelPendingModal() {
    this.showPendingModal = false;
  }

  showVersionModal(id) {
    this.getCurrentVersionDetails(id);
    this.editable = false;
    this.showVersion = true;
  }
  getCurrentVersionDetails(id) {
    if (id) {
      this.question.getVersionsList(id).subscribe((res: any) => {
        this.versionsCombo = res.versionDtails;
        this.versionsCombo.forEach((element) => {
          if (element.owner.roles.length > 1) {
            element.owner.roles.forEach((ele) => {
              if (ele.roleName == "speaker") {
                element.ROLE = "Speaker";
              }
            });
          } else {
            element.ROLE = element.owner.roles[0].roleName;
          }
        });
        this.questionVersion = res.current.question;
        this.selectedVersion = res.current.id;
        this.currentVersion = res.current.id;
        if (this.questionVersion.category === "UNSTARRED") {
          this.questionVersion.priority = null;
        }
        if (
          this.questionVersion.assemblyId &&
          this.questionVersion.sessionId &&
          this.assemblySession
        ) {
          this.questionVersion.assemblyId = this.assemblySession[
            "assembly"
          ].find(
            (item) => item.id === this.questionVersion.assemblyId
          ).assemblyId;
          this.questionVersion.sessionId = this.assemblySession["session"].find(
            (item) => item.id === this.questionVersion.sessionId
          ).sessionId;
        }
      });
    }
  }
  getVersionDetailsById(versionId) {
    if (this.currentVersion != versionId) {
      this.editable = false;
    }
    this.question.getVersionById(versionId).subscribe((res) => {
      this.questionVersion = {};
      this.questionVersion = res.question;
      if (
        this.questionVersion.assemblyId &&
        this.questionVersion.sessionId &&
        this.assemblySession
      ) {
        this.questionVersion.assemblyId = this.assemblySession["assembly"].find(
          (item) => item.id === this.questionVersion.assemblyId
        ).assemblyId;
        this.questionVersion.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.questionVersion.sessionId
        ).sessionId;
      }
    });
  }
  cancelVersion() {
    this.showVersion = false;
    this.editable = false;
    this.questionVersion = {};
  }

  onEditNotice(questionVersion) {
    this.editable = true;
  }

  onSaveEditedNotice(questionVersion) {
    if (this._isFormValid(questionVersion)) {
      let data = {
        questionId: questionVersion.id,
        clauses: this._keepClauseOrder(questionVersion.clauses),
        heading: questionVersion.heading,
        editedBy: this.auth.getCurrentUser().userId,
      };
      this.question.saveFromSettingUp(data).subscribe((res) => {
        this.notify.showSuccess("Success", "Updated.");
        this.editable = false;
        this.getBallotDetailedView();
        this.cancelVersion();
      });
    }
  }

  onCancelEditNotice() {
    this.getVersionDetailsById(this.selectedVersion);
    this.editable = false;
  }

  _isFormValid(questionVersion) {
    if (this._isAllClauseValid(questionVersion)) {
      return true;
    }
    return false;
  }

  _isAllClauseValid(questionVersion) {
    let counter = 0;
    if (!this._validateCharLimitForHeading(questionVersion)) {
      return false;
    }
    if (questionVersion.clauses) {
      let clauselegth = questionVersion.clauses.length;
      for (const i in questionVersion.clauses) {
        counter++;
        if (
          !this._hasMinClauseWordCount(questionVersion.clauses[i].clause, i)
        ) {
          return false;
        }
      }
      return true;
    }
  }
  _hasMinClauseWordCount(clause, index) {
    clause = clause.replace(/(\r\n|\n|\r)/gm, " ");
    clause = clause.replace(/(^\s*)|(\s*$)/gi, "");
    clause = clause.replace(/[ ]{2,}/gi, " ");
    const count = clause.split(" ").length;
    if (count < this.configurableParms.minClauseWord) {
      this.notify.showWarning(
        "Minimum word count for clause is " +
          this.configurableParms.minClauseWord,
        "" + `(Clause ${this.clauseNo[index]})`
      );
      return false;
    }
    return true;
  }

  _validateCharLimitForHeading(questionVersion) {
    let title = questionVersion.heading.trim();
    if (title.length < this.configurableParms.minTitleChar) {
      this.notify.showWarning(
        "Warning",
        "Minimum character limit for heading is " +
          this.configurableParms.minTitleChar
      );
      return false;
    } else if (title.length > this.configurableParms.maxTitleChar) {
      this.notify.showWarning(
        "Warning",
        "Maximum character limit " +
          this.configurableParms.maxTitleChar +
          " will exceed"
      );
      return false;
    }
    return true;
  }

  _trimData(text) {
    if (text) {
      return text.trim();
    }
  }
  _keepClauseOrder(clauses) {
    let clauseOrder = 0;
    if (clauses) {
      clauses.forEach(async (value) => {
        clauseOrder++;
        value.clauseOrder = clauseOrder;
        const lastclause = this._trimData(value.clause);
        const lastChar = lastclause.charAt(lastclause.length - 1);
        if (clauses.length === clauseOrder) {
          if (lastChar !== "?") {
            if (lastChar === ";") {
              value.clause = value.clause.substring(0, value.clause.length - 1);
            }
            value.clause = value.clause + "?";
          }
        } else if (lastChar !== ";") {
          if (lastChar === "?") {
            value.clause = value.clause.substring(0, value.clause.length - 1);
          }
          value.clause = value.clause + ";";
        }
      });
      return clauses;
    }
  }
  // submit booklet
  forwardBooklet() {
    if (this.checkNoteAdded()) {
      const body = {
        action: "FORWARD",
        groupId: this.auth.getCurrentUser().userId,
        fromGroup: this.auth.getCurrentUser().fullName,
      };
      this.service
        .forwardBooklet(this.getBookletId(), body)
        .subscribe((data) => {
          this.notify.showSuccess("Success", "Booklet forwarded successfully");
          this.backtoList();
        });
    } else {
      this.notify.showWarning("Warning", "You need to add a note!");
    }
  }
  approveBooklet() {
    const bookletId = this.getBookletId();
    this.addApproveNote();
    this.service.approveBooklet(bookletId,this.questionBooklet).subscribe((data) => {
      this.notify.showSuccess("Success", "Booklet approved successfully");
      this.backtoList();
    });
  }
  backtoList() {
    this.router.navigate(["/business-dashboard/question/booklet-flow"]);
  }
  convertSessionId() {
    const data = this.sessionList.find(
      (x) => x.id == this.bookletDetails.sessionId
    );
    if (data) {
      return data.sessionId;
    }
  }
  convertAssemblyId() {
    const data = this.assemblyList.find(
      (x) => x.id == this.bookletDetails.assemblyId
    );
    if (data) {
      return data.assemblyId;
    }
  }
  handleNotes(value) {
    this.showNotes = value;
  }
  checkNoteAdded() {
    if (this.notes.notesList && this.notes.notesList.length > 0) {
      const lastNote = this.notes.notesList[this.notes.notesList.length - 1];
      if (lastNote && lastNote.ownerId === this.auth.getCurrentUser().userId) {
        return true;
      }
    }
    return false;
  }
  isSpeaker() {
    return this.auth.getCurrentUser().authorities.includes("speaker");
  }
  isSecretary() {
    return this.auth.getCurrentUser().authorities.includes("secretary");
  }
  addApproveNote() {
    this.notes.noteGiven = 'Can be Approved';
    this.notes.saveNotes(false);
  }
}
