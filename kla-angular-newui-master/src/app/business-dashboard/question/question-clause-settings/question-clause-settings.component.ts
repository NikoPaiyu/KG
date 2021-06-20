import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { QuestionService } from "../shared/question.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";

@Component({
  selector: "app-question-clause-settings",
  templateUrl: "./question-clause-settings.component.html",
  styleUrls: ["./question-clause-settings.component.scss"],
})
export class QuestionClauseSettingsComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private question: QuestionService,
    private notify: NotificationCustomService,
    private auth: AuthService
  ) {}
  validateForm: FormGroup;
  clauseData: any = [];
  // clausecount: any = [];
  editField = false;
  selectedtab;
  wordCount;
  clauseCount;
  memberCount;
  minClauseWordCount = 10;
  // minwordcount;
  // maxNoticeCount;
  // minNoticeCount;
  ngOnInit() {
    this.validateForm = this.fb.group({
      wordcount: [null, [Validators.required]],
      // minwordcount: [null, [Validators.required]],
      // maxNoticeCount: [null, [Validators.required]],
      // minNoticeCount: [null, [Validators.required]],
      clauseno: [null, [Validators.required]],
      mlacount: [null, [Validators.required]],
    });
    this.question.getQuestionCongirations().subscribe((response) => {
      if (response) {
        this.clauseData = response;
        this.clauseData.sort((a, b) => (a.id > b.id ? 1 : -1));
        this.memberCount = this.clauseData[0].count;
        this.clauseCount = this.clauseData[1].count;
        this.wordCount = this.clauseData[2].count;
        // this.minwordcount=this.clauseData[3].count;
        // this.maxNoticeCount=this.clauseData[4].count;
        // this.maxNoticeCount=this.clauseData[5].count;
      }
    });
  }

  tabselected(type) {
    this.selectedtab = type;
  }
  submit() {
    if (this.validateForm.valid) {
      if (this.validateForm.value.wordcount < this.minClauseWordCount) {
        this.notify.showWarning(
          "Minimum word count for clause is " + this.minClauseWordCount,
          ""
        );
        return;
      }
      this.editField = false;
      this.clauseData[0].count = this.validateForm.value.mlacount;
      this.clauseData[1].count = this.validateForm.value.clauseno;
      this.clauseData[2].count = this.validateForm.value.wordcount;
      // this.clauseData[3].count = this.validateForm.value.minwordcount;
      // this.clauseData[4].count = this.validateForm.value.maxNoticeCount;
      // this.clauseData[5].count = this.validateForm.value.minNoticeCount;

      this.question
        .updateClauseDataSettings(this.clauseData)
        .subscribe((res: any) => {
          this.notify.showSuccess("Updated Succesfully...", "");
        });
    } else {
      for (const i in this.validateForm.controls) {
        if (this.validateForm.controls[i]) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
      }
    }
  }
  setValue() {
    let clauseData = this.clauseData;
    if (clauseData) {
      this.validateForm.patchValue({
        wordcount: clauseData[2].count,
        clauseno: clauseData[1].count,
        mlacount: clauseData[0].count,
        // minwordcount:clauseData[3].count,
        // maxNoticeCount:clauseData[3].count,
        // minNoticeCount:clauseData[3].count
      });
    }
  }
  edit() {
    this.editField = true;
    this.setValue();
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
  }
}
