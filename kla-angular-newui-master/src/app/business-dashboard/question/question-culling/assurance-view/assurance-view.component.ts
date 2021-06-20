import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { ActivatedRoute, Router } from "@angular/router";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-assurance-view",
  templateUrl: "./assurance-view.component.html",
  styleUrls: ["./assurance-view.component.scss"],
})
export class AssuranceViewComponent implements OnInit {
  validateForm: FormGroup;
  showEditableBox = false;
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  qDetail;
  assurances = [];
  questionId;
  departmentList = [];
  wrkflowBtnParams = { FrwrBtnlabel: "Forward" };
  workflowFlowList: any;
  showFileInfo = false;
  shownotes = false;
  claimParams = {
    BtnLbl: "Claim",
    IsClaimed: false,
    showClaimBtn: false,
    prompt: "Are you sure you want to claim?",
  };
  notesList = [];
  editedNote = "";
  noteGiven = "";
  editedNoteOn = false;
  constructor(
    private question: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    public rbsService: QuestionRBSService,
    private auth: AuthService,
    private fb: FormBuilder,
    private notify: NotificationCustomService,
    private location: Location
  ) {
    this.route.params.subscribe((params) => {
      this.questionId = params["id"];
    });
  }

  ngOnInit() {
    this.getQuestionById();
    this.setForm();
    this.getMinisterList();
    this.getNoteslist();
  }
  setForm() {
    this.validateForm = this.fb.group({
      id: [""],
      clauseId: ["", [Validators.required]],
      assurance: ["", [Validators.required]],
      clauseTitle: ["", [Validators.required]],
      title: ["", [Validators.required]],
      ministerSubjectId: ["", [Validators.required]],
    });
    this.validateForm.controls["clauseId"].valueChanges.subscribe((res) => {
      if (res) this.onClauseChange(res);
    });
  }
  onClauseChange(clauseId) {
    let clause = this.qDetail.clauses.find((element) => element.id == clauseId);
    if (clause) {
      this.validateForm.controls["clauseTitle"].setValue(clause.clauseTitle);
      this.validateForm.controls["assurance"].setValue(clause.answer.answer);
    } else {
      this.validateForm.controls["clauseTitle"].setValue("");
      this.validateForm.controls["assurance"].setValue("");
    }
  }
  getMinisterList() {
    this.question.listOfMinisterSubjects().subscribe((response: any) => {
      this.departmentList = response;
      this.departmentList.sort((a, b) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
      );
    });
  }
  getQuestionById() {
    this.question
      .getCullingQuestionView(this.questionId)
      .subscribe((response) => {
        this.qDetail = response["question"];
        this.getTaskActors(this.qDetail.assuranceWorkflowId);
        this._handleclaimMsg();
        this.assurances = response["assurances"];
        this.qDetail.clauses.sort((a, b) =>
          a.clauseOrder > b.clauseOrder ? 1 : -1
        );
        this.qDetail.clauses.forEach((element) => {
          element.clauseTitle = `Clause (${
            this.upper[element.clauseOrder - 1]
          })`;
        });
      });
  }
  forwardAssurence() {
    if (!this.wrkflowBtnParams["forwardToQS"]) {
      this.notify.showError("Error", "Please Select A role");
      return;
    }
    let body = {
      forwardTo: this.wrkflowBtnParams["forwardToQS"],
      userId: this.auth.getCurrentUser().userId,
      fromGroup: this._findRole(),
      questionId: this.qDetail.id,
    };
    this.question.forwardAssurence(body).subscribe((element) => {
      this.notify.showSuccess("Successfully forwarded", "");
      this.goBackToList();
    });
  }
  approveAssurence() {
    let body = {
      approvedBy: this.auth.getCurrentUser().userId,
      fromGroup: this._findRole(),
      questionId: this.qDetail.id,
    };
    this.question.approveAssurence(body).subscribe((element) => {
      this.notify.showSuccess("Approved Successfully", "");
      this.goBackToList();
    });
  }
  submitAssurence() {
    this.question.submitAssurence(this.questionId).subscribe((res) => {
      this.notify.showSuccess("Success", "Submitted Assurance");
      this.goBackToList();
    });
  }
  editAssurance(data) {
    data.clauseId = Number(data.clauseId);
    this.validateForm.patchValue(data, { emitEvent: false });
    this.showEditableBox = true;
  }
  deleteAssurance(id) {
    this.question.deleteAssurance(id).subscribe((res) => {
      this.notify.showSuccess("Success", "Assurance Deleted.");
      this.getQuestionById();
    });
  }
  cancelNewAssurance() {
    this.showEditableBox = false;
    this.validateForm.reset();
  }
  saveAnsAssurance() {
    if (this.validateForm.valid) {
      let data = this.validateForm.value;
      data.assemblyId = this.qDetail.assemblyId;
      data.sessionId = this.qDetail.sessionId;
      this.question.saveAssurance(data, this.questionId).subscribe((res) => {
        let msg = this.validateForm.value.id
          ? "Updated Assurance"
          : "Assurance Added";
        this.notify.showSuccess("Success", msg);
        this.getQuestionById();
        this.showEditableBox = false;
      });
    } else {
      for (const key in this.validateForm.controls) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }
  getWorkflowTracking(status) {
    if (this.qDetail.assuranceWorkflowId) {
      this.question
        .getActivityFlow(this.qDetail.assuranceWorkflowId)
        .subscribe((Response) => {
          this.workflowFlowList = Response;
          this.showFileInfo = status;
        });
    }
  }
  claimUnclaim(questionId: number) {
    this.question
      .claimUnclaimQuestion(
        questionId,
        this.auth.getCurrentUser().userId,
        this.claimParams["IsClaimed"],
        this._findRole(),
        "ASSURANCE",
        null
      )
      .subscribe((response) => {
        if (!this.claimParams["IsClaimed"]) {
          this._handleclaimActivity();
          this.notify.showSuccess("You have claimed", "");
        } else {
          this._handleunclaimActivity();
          this.notify.showSuccess("You have unclaimed", "");
        }
      });
  }
  _handleclaimActivity() {
    this.qDetail.claimedBy = this.auth.getCurrentUser().userId;
    this.claimParams["IsClaimed"] = true;
    this.claimParams["BtnLbl"] = "Unclaim";
    this.claimParams["prompt"] = "Are you sure you want to unclaim?";
    this.claimParams["showClaimBtn"] = true;
  }
  _handleunclaimActivity() {
    this.qDetail.claimedBy = null;
    this.claimParams["IsClaimed"] = false;
    this.claimParams["BtnLbl"] = "Claim";
    this.claimParams["prompt"] = "Are you sure you want to claim?";
    this.claimParams["showClaimBtn"] = true;
  }
  _handleclaimMsg() {
    if (this.qDetail.assuranceClaimedBy === this.auth.getCurrentUser().userId) {
      this.claimParams["IsClaimed"] = true;
      this.claimParams["BtnLbl"] = "Unclaim";
      this.claimParams["prompt"] = "Are you sure you want to unclaim?";
      this.claimParams["showClaimBtn"] = true;
    } else if (this.qDetail.assuranceClaimedBy == null) {
      this.claimParams["showClaimBtn"] = true;
    }
  }
  goBackToList() {
    this.location.back();
    //this.router.navigate(["business-dashboard/question/draft-assurance"]);
  }
  edit() {
    this.router.navigate([
      "business-dashboard/question/mark-assurance",
      this.questionId,
    ]);
  }
  forwardAssuranceTo(e) {
    if (e.level === this.wrkflowBtnParams["currentRole"].level) {
      this.wrkflowBtnParams["FrwrBtnlabel"] = "Transfer";
    } else if (e.level < this.wrkflowBtnParams["currentRole"].level) {
      this.wrkflowBtnParams["FrwrBtnlabel"] = "Return";
    } else {
      this.wrkflowBtnParams["FrwrBtnlabel"] = "Forward";
    }
    this.wrkflowBtnParams["forwardToQS"] = e.group;
    if (this.wrkflowBtnParams["forwardToQS"].includes("/")) {
      this.wrkflowBtnParams["forwardToQS"] = "JointSecretary";
    }
  }
  _findRole() {
    return this.auth.getCurrentUser().authorities[0];
  }
  capitalize(string) {
    if (typeof string !== "string") return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  handleNotes(boolean: boolean): void {
    this.shownotes = boolean;
  }
  showFileInfoPopUp() {
    this.showFileInfo = false;
  }
  canShowButton() {
    if (this.qDetail.assuranceWorkflowId && !this.qDetail.assuranceApprovedBy) {
      return true;
    }
    return false;
  }
  getTaskActors(pId) {
    this.question
      .getWorkflowTaskActors(pId, this.auth.getCurrentUser())
      .subscribe((data: any) => {
        this.wrkflowBtnParams["QsRoles"] = data.roles;
        this.wrkflowBtnParams["currentRole"] = data.currentrole;
        if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
          this.wrkflowBtnParams["ForwardButton"] = "Return";
        }
      });
  }

  // notes
  getNoteslist() {
    this.question.getAssuranceNotes(this.questionId, 'ASSURANCE').subscribe((res: any) => {
      this.notesList = res;
      var filterValue = "questionVersion";
      this.notesList.sort(function (a, b) {
        if (a[filterValue] > b[filterValue]) return 1;
        if (a[filterValue] < b[filterValue]) return -1;
        if (a.createDate < b.createDate) return -1;
        if (a.createDate > b.createDate) return 1;
        return 0;
      });
      this.notesList.forEach(async (item) => {
        if (
          this.auth.getCurrentUser().userId == item.ownerId &&
          item.status === "INTERIM"
        ) {
          item.editNote = true;
        } else {
          item.editNote = false;
        }
        item.noteditable = false;
      });
    });
  }
  editNotes(index): void {
    this.notesList[index].editNote = false;
    this.notesList[index].noteditable = true;
    this.notesList[index].noteditable === true
      ? (this.editedNoteOn = true)
      : (this.editedNoteOn = false);
    this.editedNote = this.notesList[index].note;
  }
  updateNotes(index, questionId, note) {
    if (!this.editedNote) {
      this.notify.showError("Error", "Plesae Enter Notes");
      return;
    }
    let body = {
      questionId,
      note: this.editedNote,
      ownerId: this.auth.getCurrentUser().userId,
      id: note.id,
      type: 'ASSURANCE'
    };
    this.question.postAssuranceNotes(body).subscribe((element) => {
      this.notesList[index].note = this.editedNote;
      this.notesList[index].createDate = new Date();
      this.notesList[index].editNote = true;
      this.notesList[index].noteditable = false;
      this.editedNoteOn = false;
      this.notify.showSuccess("Note Updated Successfully", "");
    });
  }
  saveNotes(questionId): void {
    if (this.notesList.length > 0 && this._isAddedNote()) {
      this.noteGiven = "";
      this.notify.showWarning(
        "Warning",
        "Sorry, You can only edit existing Note"
      );
      return;
    }
    if (!this.noteGiven) {
      this.notify.showError("Error", "Please Enter Notes");
      return;
    }
    let body = {
      questionId,
      note: this.noteGiven,
      ownerId: this.auth.getCurrentUser().userId,
      id: null,
      type: 'ASSURANCE'
    };
    this.question.postAssuranceNotes(body).subscribe((element) => {
      this.notify.showSuccess("Add Success", "");
      this.notesList.push(element);
      let i = this.notesList.length;
      this.notesList[i - 1].editNote = true;
      this.notesList[i - 1].noteditable = false;
      this.noteGiven = "";
    });
  }
  _isAddedNote() {
    // tslint:disable-next-line: only-arrow-functions
    const lastNote = this.notesList.reduce(function (prev, current) {
      return prev.id > current.id ? prev : current;
    });
    if (
      this.auth.getCurrentUser().userId === lastNote.ownerId &&
      lastNote.status === "INTERIM"
    ) {
      return true;
    }
    return false;
  }

  // end notes
}
