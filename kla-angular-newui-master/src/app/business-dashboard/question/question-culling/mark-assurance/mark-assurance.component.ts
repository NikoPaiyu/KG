import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from "@angular/forms";
import { Location } from "@angular/common";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { NzModalService, NzModalRef } from "ng-zorro-antd";
import { QuestionRBSService } from "../../shared/question-rbs.service";

@Component({
  selector: "app-mark-assurance",
  templateUrl: "./mark-assurance.component.html",
  styleUrls: ["./mark-assurance.component.scss"],
})
export class MarkAssuranceComponent implements OnInit {
  showCreateForm = false;
  isVisibleModel = false;
  upper = ["A", "B", "C", "D", "E", "F", "G", "H"];
  qDetail;
  assurances = [];
  questionId;
  validateForm: FormGroup;
  departmentList = [];
  wrkflowBtnParams = { FrwrBtnlabel: "Forward" };
  addedArray = [];
  searchArray = [];
  newKeyWord;
  assuranceObj = {
    markasassurance: false,
    submitcnfrmmsg: "Are you sure you want to submit?",
    isVisibleSubmitMsg: true,
  };
  shownotes = false;
  showFileInfo: boolean;
  workflowFlowList;
  matches = { keywordmatch: 0, lengthkeywrd: 0, total: 0 };
  routerParams = { keywords: [] };
  notesList = [];
  editedNote = "";
  noteGiven = "";
  editedNoteOn = false;
  noAssurance = false;
  constructor(
    private route: ActivatedRoute,
    private question: QuestionService,
    private fb: FormBuilder,
    private location: Location,
    private notify: NotificationCustomService,
    private auth: AuthService,
    private modalService: NzModalService,
    public rbsService: QuestionRBSService,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.questionId = params["id"];
    });
    this.getKeyWordsFromRoutes();
  }

  ngOnInit() {
    this.getQuestionById();
    this.setForm();
    this.getMinisterList();
    this.getNoteslist();
  }

  getQuestionById() {
    this.question
      .getCullingQuestionView(this.questionId)
      .subscribe((response) => {
        this.qDetail = response["question"];
        this.getWorkflowTracking();
        this.getTaskActors(this.qDetail.assuranceWorkflowId);
        if (
          this.qDetail.hasAssurance !== null &&
          this.qDetail.hasAssurance === false
        ) {
          this.noAssurance = true;
        }
        this.assurances = response["assurances"];
        this.qDetail.clauses.sort((a, b) =>
          a.clauseOrder > b.clauseOrder ? 1 : -1
        );
        this.qDetail.clauses.forEach((element) => {
          element.clauseTitle = `Clause (${
            this.upper[element.clauseOrder - 1]
          })`;
        });
        this.searchArray ? this.searchArray : [];
      });
  }
  getKeyWordsFromRoutes() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    ) {
      this.router.getCurrentNavigation().extras.state.data.map((item) => {
        this.routerParams["keywords"].push(item);
      });
      this.addedArray = this.router.getCurrentNavigation().extras.state.data;
    }
    this.addedArray ? this.addedArray : [];
    this.addedArray.forEach((element) => {
      this.searchArray.push(element);
    });
  }
  setForm() {
    this.validateForm = this.fb.group({
      id: [""],
      clauseId: ["", [Validators.required]],
      assurance: ["", [Validators.required]],
      clauseTitle: ["", [Validators.required]],
    });
    this.validateForm.controls["clauseId"].valueChanges.subscribe((res) => {
      if (res) this.onClauseChange(res);
    });
  }
  autofillForm(data, hasAssurance) {
    if (this._checkIfAlreadyMarkedNoAssurance(hasAssurance, data.id)) {
      this.notify.showWarning("Already marked as no assurance", "");
      return;
    }
    this.assuranceObj.markasassurance = hasAssurance;
    this.setForm();
    if (hasAssurance) {
      this.addFormVariables();
    }
    if (data) {
      let formObj = {
        id: "",
        clauseId: data.id,
        assurance: "Mark as no assurance",
        clauseTitle: data.clauseTitle,
      };
      if (hasAssurance) {
        formObj["title"] = data.title;
        formObj["ministerSubjectId"] = data.ministerSubjectId;
        formObj["assurance"] = this.getSelectionHtml(
          data.id,
          data.answer.answer
        );
      }
      this.validateForm.patchValue(formObj, { emitEvent: false });
    } else {
      this.validateForm.reset();
    }
    this.showCreateForm = true;
  }
  deleteAssurance(id) {
    this.question.deleteAssurance(id).subscribe((res) => {
      this.notify.showSuccess("Success", "Assurance Deleted.");
      this.getQuestionById();
    });
  }
  editAssurance(data) {
    this.addFormVariables();
    data.clauseId = Number(data.clauseId);
    this.validateForm.patchValue(data, { emitEvent: false });
    this.isVisibleModel = true;
  }
  saveAnsAssurance() {
    if (this.validateForm.valid) {
      let data = this.validateForm.value;
      if (this.assuranceObj["markasassurance"]) {
        this.createAnsAssurance(data);
      } else {
        this.markAsNoAnsAssurance();
      }
    } else {
      for (const key in this.validateForm.controls) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }
  cancelNewAssurance() {
    this.showCreateForm = false;
    this.isVisibleModel = false;
    // this.validateForm.reset();
  }
  createAnsAssurance(data) {
    data.assemblyId = this.qDetail.assemblyId;
    data.sessionId = this.qDetail.sessionId;
    this.question.saveAssurance(data, this.questionId).subscribe((res) => {
      let msg = this.validateForm.value.id
        ? "Updated Assurance"
        : "Assurance Added";
      this.notify.showSuccess("Success", msg);
      this.getQuestionById();
      this.showCreateForm = false;
      this.isVisibleModel = false;
    });
  }
  markAsNoAnsAssurance() {
    if (this.qDetail) {
      let reqData = {
        assemblyId: this.qDetail.assemblyId,
        sessionId: this.qDetail.sessionId,
        assurance: this.validateForm.value.assurance,
        clauseId: this.validateForm.value.clauseId,
        clauseTitle: this.validateForm.value.clauseTitle,
        assured: false,
      };
      this.validateForm.value.id
        ? (reqData["id"] = this.validateForm.value.id)
        : "";
      this.question.markAsNoAnsAssurance(reqData).subscribe((res) => {
        this.notify.showSuccess("Success", "Marked As No Assurances.");
        this.getQuestionById();
        this.showCreateForm = false;
        this.isVisibleModel = false;
      });
    }
  }
  markAsNoAssurance() {
    this.question.markAsNoAssurance(this.questionId).subscribe((res) => {
      this.notify.showSuccess("Success", "Marked As No Assurances.");
      this.getQuestionById();
    });
  }
  markAsAssurance() {
    this.question.markAsAssurance(this.questionId).subscribe((res) => {
      this.notify.showSuccess("Success", "Marked As Assurances.");
      this.getQuestionById();
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
      this.router.navigate(["business-dashboard/question/draft-assurance"]);
    });
  }
  submitAssurence() {
    if (this.qDetail.hasAssurance && this.assurances.length === 0) {
      this.notify.showWarning("Add Assurance", "");
      return;
    }
    this.question.submitAssurence(this.questionId).subscribe((res) => {
      this.notify.showSuccess("Success", "Submitted Assurance");
      this.router.navigate(["business-dashboard/question/draft-assurance"]);
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
      this.router.navigate(["business-dashboard/question/draft-assurance"]);
    });
  }
  getWorkflowTracking() {
    if (this.qDetail.assuranceWorkflowId) {
      this.question
        .getActivityFlow(this.qDetail.assuranceWorkflowId)
        .subscribe((Response) => {
          this.workflowFlowList = Response;
        });
    }
  }
  showInfo(status) {
    this.showFileInfo = status;
  }
  _confrmNoAssurance(satus) {
    if (satus) {
      this.modalService.confirm({
        nzClassName: "pdng",
        nzContent: "Are you sure you want to mark as no assurances?",
        nzOkText: "OK",
        nzCancelText: "Cancel",
        nzOnOk: () => this.markAsNoAssurance(),
        nzOnCancel: () => this.revertChanges(false),
      });
    } else {
      this.modalService.confirm({
        nzClassName: "pdng",
        nzContent: "Are you sure you want to mark as assurances?",
        nzOkText: "OK",
        nzCancelText: "Cancel",
        nzOnOk: () => this.markAsAssurance(),
        nzOnCancel: () => this.revertChanges(true),
      });
    }
  }
  revertChanges(status) {
    this.noAssurance = status;
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
  getCnfrmMsg() {
    let notAssuredClause = [];
    if (this.qDetail.hasAssurance !== false) {
      for (var n in this.qDetail.clauses) {
        let chosseItem = this.assurances.find(
          (element) => element.clauseId === this.qDetail.clauses[n].id
        );
        if (!chosseItem) {
          notAssuredClause.push(this.qDetail.clauses[n].clauseTitle);
        }
      }
    }
    this.assuranceObj.submitcnfrmmsg =
      notAssuredClause.length > 0
        ? "All the other clauses will be marked as no assurance . Are you sure to continue?"
        : "Are you sure you want to submit?";
  }
  isAmClaimUser() {
    let loggedUser = this.auth.getCurrentUser().authorities[0];
    if (loggedUser && this.workflowFlowList) {
      let wrkflwUser = this.workflowFlowList.slice(-1).pop().owner;
      if (wrkflwUser.toLowerCase() === loggedUser.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
  goBackToList() {
    if (this.routerParams["keywords"].length > 0) {
      this.router.navigate(["business-dashboard/question/culling-assurance"], {
        state: {
          data: this.routerParams["keywords"],
        },
      });
      return;
    }
    this.location.back();
    // this.router.navigate(["business-dashboard/question/draft-assurance"]);
  }
  addKeyWord(word) {
    if (word) {
      this.addedArray ? "" : (this.addedArray = []);
      this.addedArray.forEach((element) => {
        if (element == word) {
          this.notify.showWarning("This key word is already exists..", "");
          return;
        }
      });
      this.addedArray.push(word);
    }
    this.newKeyWord = null;
  }
  removeKeyWord(index) {
    if (this.searchArray.length == this.addedArray.length) {
      this.searchArray.splice(index, 1);
    }
    this.addedArray.splice(index, 1);
  }
  searchOnKeyword() {
    // if (this.arraysEqual(this.addedArray, this.searchArray)) {
    //   return;
    // }
    this.searchArray = [];
    this.addedArray.forEach((element) => {
      this.searchArray.push(element);
    });
  }
  addFormVariables() {
    this.assuranceObj["markasassurance"] = true;
    this.validateForm.addControl(
      "title",
      new FormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      "ministerSubjectId",
      new FormControl(null, Validators.required)
    );
  }
  handleNotes(boolean: boolean): void {
    this.shownotes = boolean;
    this.noteGiven = "";
  }
  capitalize(string) {
    if (typeof string !== "string") return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  highlight(content) {
    let words = [];
    let ketwrdmatchArr = [];
    let lengthywrdmatchArr = [];
    if (this.searchArray && this.searchArray.length > 0) {
      words = this.searchArray;
    }
    if (content && words.length > 0) {
      words.forEach((element) => {
        content = content.replace(new RegExp(element, "gi"), (match) => {
          if (match) {
            if (match.trim().indexOf(" ") >= 0) {
              lengthywrdmatchArr.push(match);
              // lengthywrdmatchArr = lengthywrdmatchArr.filter(
              //   (v, i, a) => a.indexOf(v) === i
              // );
              this.matches.lengthkeywrd = lengthywrdmatchArr.length;
            } else {
              ketwrdmatchArr.push(match);
              this.matches.keywordmatch = ketwrdmatchArr.length;
            }
            this.matches.total =
              this.matches.lengthkeywrd + this.matches.keywordmatch;
            return '<span class="highlightText">' + match + "</span>";
          }
        });
      });
    }
    return content;
  }
  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = arr1.length; i--; ) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  showFileInfoPopUp() {
    this.showFileInfo = false;
  }
  canShowActionButtons() {
    if (this.qDetail.hasAssurance) {
      if (this.routerParams["keywords"].length > 0) {
        if (this.qDetail && this.qDetail.assuranceWorkflowId) {
          return false;
        }
      }
    }
    if (this.qDetail.hasAssurance === false) {
      return false;
    }
    return true;
  }
  _checkIfAlreadyMarkedNoAssurance(hasAssurance, clauseId) {
    if (hasAssurance === false) {
      let chosseItem = this.assurances.find(
        (element) => element.clauseId === clauseId
      );
      if (chosseItem && chosseItem.isAssured === false) {
        return true;
      }
    }
    return false;
  }
  getSelectionHtml(caluseId, answer) {
    let html = "";
    if (typeof window.getSelection !== "undefined") {
      let sel = window.getSelection().toString();
      let container = document.getElementById("clause_ans_" + caluseId);
      html = container.innerText;
      if (sel && html.indexOf(sel) !== -1) {
        return sel;
      }
    }
    return answer;
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
  // starts notes
  getNoteslist() {
    this.question
      .getAssuranceNotes(this.questionId, "ASSURANCE")
      .subscribe((res: any) => {
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
      type: "ASSURANCE",
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
      type: "ASSURANCE",
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
