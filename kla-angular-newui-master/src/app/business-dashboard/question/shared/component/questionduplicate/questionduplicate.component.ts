import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-questionduplicate",
  templateUrl: "./questionduplicate.component.html",
  styleUrls: ["./questionduplicate.component.scss"]
})
export class QuestionduplicateComponent implements OnInit {
  size = "default";
  multipleValue = [];
  memberId;
  @Input() questionDuplicateDetails;
  currentNoticeNumber;
  existingQuestion: any = [];
  existingQuestiontemp;
  constructor() {}

  ngOnInit() {
    this.pageLoadFunction();
  }
  pageLoadFunction() {
    this.multipleValue = this.questionDuplicateDetails.currentQuestionTags;
    this.currentNoticeNumber = this.questionDuplicateDetails.existingQuestions[0].noticeNumber;
    this.existingQuestion = this.questionDuplicateDetails.existingQuestions[0];
    this.existingQuestiontemp = this.questionDuplicateDetails.existingQuestions;
    this.memberId = "All";
  }
  getexistingQuestionByNoticeNumber(noticeNumber) {
    this.existingQuestion = this.questionDuplicateDetails.existingQuestions.find(
      x => x.noticeNumber == noticeNumber
    );
    this.currentNoticeNumber = noticeNumber;
  }
  search() {
    if (this.memberId == "All") {
      this.existingQuestion = this.questionDuplicateDetails.existingQuestions[0];
      this.existingQuestiontemp = this.questionDuplicateDetails.existingQuestions;
    } else {
      this.existingQuestion = this.questionDuplicateDetails.existingQuestions.find(
        x => x.ministerSubjectId == this.memberId
      );
      this.existingQuestiontemp = [];
      this.existingQuestiontemp = this.questionDuplicateDetails.existingQuestions.filter(
        x => x.ministerSubjectId == this.memberId
      );
    }
    this.currentNoticeNumber = this.existingQuestion.noticeNumber;
  }
}
