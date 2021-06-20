import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { NzModalService } from "ng-zorro-antd";
import { DraftListPreviewComponent } from "../../shared/component/draft-list-preview/draft-list-preview.component";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { forkJoin } from "rxjs";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from "@angular/forms";
@Component({
  selector: "app-draft-list-view",
  templateUrl: "./draft-list-view.component.html",
  styleUrls: ["./draft-list-view.component.scss"],
})
export class DraftListViewComponent implements OnInit {
  listId;
  wrkflowBtnParams = { FrwrBtnlabel: "Forward" };
  isReordered = false;
  DraftlistData = { answerAssuranceList: {}, assurances: [] };
  assemblySession: object = [];
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
  answerAssuranceList: any;
  editedNote = "";
  noteGiven = "";
  editedNoteOn = false;
  validateForm: FormGroup;
  isVisibleModel = false;
  showCreateForm = false;
  departmentList = [];
  AssuranceQid: number;
  constructor(
    public rbsService: QuestionRBSService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private question: QuestionService,
    private auth: AuthService,
    private notify: NotificationCustomService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.listId = params.id;
      this.getAssemblySession();
      this.getNoteslist();
      this.setForm();
      this.getMinisterList();
    });
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
    if (this.answerAssuranceList) {
      let clause = this.answerAssuranceList.find(
        (element) => element.clauseId === clauseId
      );
      if (clause) {
        this.validateForm.controls["clauseTitle"].setValue(clause.clauseTitle);
        this.validateForm.controls["assurance"].setValue(clause.answer.answer);
      } else {
        this.validateForm.controls["clauseTitle"].setValue("");
        this.validateForm.controls["assurance"].setValue("");
      }
    }
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.getDraftListById();
      }
    });
  }
  getDraftListById() {
    this.question.getDraftListById(this.listId).subscribe((res) => {
      this.DraftlistData = res;
      this.answerAssuranceList = this.DraftlistData.answerAssuranceList;
      this.getTaskActors(this.answerAssuranceList.workflowId);
      this._handleclaimMsg();
      this._orderAssurances();
    });
  }
  getMinisterList() {
    this.question.listOfMinisterSubjects().subscribe((response: any) => {
      this.departmentList = response;
      this.departmentList.sort((a, b) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
      );
    });
  }
  handleNotes(boolean: boolean): void {
    this.shownotes = boolean;
  }
  getWorkflowTracking(status) {
    let data = this.answerAssuranceList;
    if (data["workflowId"]) {
      this.question
        .getActivityFlow(data["workflowId"])
        .subscribe((Response) => {
          this.workflowFlowList = Response;
          this.showFileInfo = status;
        });
    }
  }
  forwardAssuranceList() {
    if (!this.wrkflowBtnParams["forwardToQS"]) {
      this.notify.showError("Error", "Please Select A role");
      return;
    }
    let body = {
      forwardTo: this.wrkflowBtnParams["forwardToQS"],
      userId: this.auth.getCurrentUser().userId,
      fromGroup: this._findRole(),
      listId: this.answerAssuranceList["id"],
    };
    this.question.forwardAssuranceList(body).subscribe((element) => {
      this.notify.showSuccess("Successfully forwarded", "");
      this.goBackToList();
    });
  }
  claimUnclaim() {
    this.question
      .claimUnclaimQuestion(
        this.answerAssuranceList["id"],
        this.auth.getCurrentUser().userId,
        this.claimParams["IsClaimed"],
        this._findRole(),
        "ASSURANCE_LIST",
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
  _orderAssurances() {
    this.DraftlistData.assurances = this.DraftlistData.assurances.sort((a, b) =>
      a.assuranceOrder > b.assuranceOrder ? 1 : -1
    );
  }
  _handleclaimActivity() {
    this.answerAssuranceList["claimedBy"] = this.auth.getCurrentUser().userId;
    this.claimParams["IsClaimed"] = true;
    this.claimParams["BtnLbl"] = "Unclaim";
    this.claimParams["prompt"] = "Are you sure you want to unclaim?";
    this.claimParams["showClaimBtn"] = true;
  }
  _handleunclaimActivity() {
    this.answerAssuranceList["claimedBy"] = null;
    this.claimParams["IsClaimed"] = false;
    this.claimParams["BtnLbl"] = "Claim";
    this.claimParams["prompt"] = "Are you sure you want to claim?";
    this.claimParams["showClaimBtn"] = true;
  }
  _handleclaimMsg() {
    if (
      this.answerAssuranceList["claimedBy"] ===
      this.auth.getCurrentUser().userId
    ) {
      this.claimParams["IsClaimed"] = true;
      this.claimParams["BtnLbl"] = "Unclaim";
      this.claimParams["prompt"] = "Are you sure you want to unclaim?";
      this.claimParams["showClaimBtn"] = true;
    } else if (this.answerAssuranceList["claimedBy"] == null) {
      this.claimParams["showClaimBtn"] = true;
    }
  }
  goBackToList() {
    this.router.navigate(["business-dashboard/question/assured-list", "LIST"]);
  }
  admitAssuranceList() {
    let body = {
      approvedBy: this.auth.getCurrentUser().userId,
      fromGroup: this._findRole(),
      listId: this.answerAssuranceList["id"],
    };
    this.question.admitAssuranceList(body).subscribe((element) => {
      this.notify.showSuccess("Approved Successfully", "");
      this.goBackToList();
    });
  }
  saveAnsAssurance() {
    if (this.validateForm.valid) {
      let data = this.validateForm.value;
      this.createAnsAssurance(data);
    } else {
      for (const key in this.validateForm.controls) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }
  createAnsAssurance(data) {
    this.question.saveAssurance(data, this.AssuranceQid).subscribe((res) => {
      this.notify.showSuccess("Success", "Updated Assurance");
      this.getDraftListById();
      this.showCreateForm = false;
      this.isVisibleModel = false;
    });
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
  editAssurance(data) {
    console.log(data);
    data.clauseId = Number(data.clauseId);
    this.validateForm.patchValue(data, { emitEvent: false });
    this.isVisibleModel = true;
    this.AssuranceQid = data.qid;
  }
  _findRole() {
    if (this.auth.getCurrentUser().authorities.indexOf("speaker") !== -1) {
      return "speaker";
    }
    return this.auth.getCurrentUser().authorities[0];
  }
  capitalize(string) {
    if (typeof string !== "string") return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  listOrderChanged(orderedList) {
    this.isReordered = true;
    let minOrder = this.getMinOrder();
    for (let i = 0; i < orderedList.length; i++) {
      orderedList[i].assuranceOrder = minOrder++;
      orderedList[i].assuranceNo = "14/19/" + orderedList[i].assuranceOrder;
    }
    //this.saveAssuranceOrder();
  }
  getMinOrder() {
    // tslint:disable-next-line: max-line-length
    return this.DraftlistData.assurances.reduce(
      (min, p) => (p.assuranceOrder < min ? p.assuranceOrder : min),
      this.DraftlistData.assurances[0].assuranceOrder
    );
  }
  saveAssuranceOrder() {
    this.question
      .saveAssuranceOrder(this.DraftlistData)
      .subscribe((res: any) => {});
  }
  printPreview() {
    this.modalService.create({
      nzContent: DraftListPreviewComponent,
      nzWidth: "800",
      nzFooter: null,
      nzComponentParams: {
        previewData: this.DraftlistData.assurances,
        assembly: this.convertAssembly(),
        session: this.convertSession(),
        // hidePrint: false,
      },
    });
  }
  convertSession() {
    let sessionid = this.DraftlistData.answerAssuranceList["sessionId"];
    return this.assemblySession["session"].find((item) => item.id === sessionid)
      .sessionId;
  }
  convertAssembly() {
    let assemblyId = this.DraftlistData.answerAssuranceList["assemblyId"];
    return this.assemblySession["assembly"].find(
      (item) => item.id === assemblyId
    ).assemblyId;
  }
  showFileInfoPopUp() {
    this.showFileInfo = false;
  }
  cancelNewAssurance() {
    this.showCreateForm = false;
    this.isVisibleModel = false;
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
    this.question
      .getAssuranceNotes(this.listId, "ASSURANCE_LIST")
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
  updateNotes(index, note) {
    if (!this.editedNote) {
      this.notify.showError("Error", "Plesae Enter Notes");
      return;
    }
    let body = {
      assuranceListId: this.listId,
      note: this.editedNote,
      ownerId: this.auth.getCurrentUser().userId,
      id: note.id,
      type: "ASSURANCE_LIST",
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
  saveNotes(): void {
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
      assuranceListId: this.listId,
      note: this.noteGiven,
      ownerId: this.auth.getCurrentUser().userId,
      id: null,
      type: "ASSURANCE_LIST",
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
