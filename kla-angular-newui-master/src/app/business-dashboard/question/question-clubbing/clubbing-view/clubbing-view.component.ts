import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../../shared/question.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-clubbing-view",
  templateUrl: "./clubbing-view.component.html",
  styleUrls: ["./clubbing-view.component.scss"],
})
export class ClubbingViewComponent implements OnInit {
  clauseNo = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  requestId;
  clubbingData: any;
  shownotes = false;
  notesList = [];
  editedNote = "";
  noteGiven = "";
  editedNoteOn = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.requestId = params.id;
      this.getClubbRequest();
    });
  }
  getClubbRequest() {
    this.question.getClubbRequestById(this.requestId).subscribe((res) => {
      if (res) {
        this.clubbingData = res;
      }
    });
  }
  handleNotes(boolean: boolean): void {
    this.shownotes = boolean;
    this.noteGiven = "";
  }
  onReject() {
    if (this.notesList.length === 0) {
      this.notify.showError("Error", "Please Enter Notes");
      return;
    }
    this.question
      .rejectQuestionClubbRequest({note: this.notesList[0].note, requestId: this.requestId})
      .subscribe((res) => {
        this.notify.showSuccess("Success", "");
        this.router.navigate(["business-dashboard/question/clubbing-list"]);
      });
  }
  onAccept() {
    if (this.notesList.length === 0) {
      this.notify.showError("Error", "Please Enter Notes");
      return;
    }
    this.question
      .approveQuestionClubbRequest({note: this.notesList[0].note, requestId: this.requestId})
      .subscribe((res) => {
        this.notify.showSuccess("Success", "");
        this.router.navigate(["business-dashboard/question/clubbing-list"]);
      });
  }
  editNotes(index): void {
    this.notesList[index].editNote = false;
    this.notesList[index].noteditable = true;
    this.notesList[index].noteditable == true
      ? (this.editedNoteOn = true)
      : (this.editedNoteOn = false);
    this.editedNote = this.notesList[index].note;
  }
  updateNotes(index) {
    if (!this.editedNote) {
      this.notify.showError("Error", "Please Enter Notes");
      return;
    }
        this.notesList[index].note = this.editedNote;
        this.notesList[index].createDate = new Date();
        this.notesList[index].editNote = true;
        this.notesList[index].noteditable = false;
        this.editedNoteOn = false;
        this.notify.showSuccess("Add Success", "");
  }
  saveNotes() {
    if (!this.noteGiven) {
      this.notify.showError("Error", "Plesae Enter Notes");
      return;
    }
    if (this.notesList.length > 0) {
      this.noteGiven = "";
      this.notify.showWarning(
        "Warning",
        "Sorry, You can only edit existing Note"
      );
      return;
    }
    this.notify.showSuccess("Add Success", "");
    this.notesList.push({note: this.noteGiven});
    let i = this.notesList.length;
    this.notesList[i - 1].editNote = true;
    this.notesList[i - 1].noteditable = false;
    this.noteGiven = "";
  }
}
