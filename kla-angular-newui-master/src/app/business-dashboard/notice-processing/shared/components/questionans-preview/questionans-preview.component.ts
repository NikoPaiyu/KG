import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from "src/app/auth/shared/services/auth.service";

@Component({
  selector: 'app-questionans-preview',
  templateUrl: './questionans-preview.component.html',
  styleUrls: ['./questionans-preview.component.scss']
})
export class QuestionansPreviewComponent implements OnInit {
  @Input() qDetail;
  @Input() assembly;
  @Input() session;
  @Input() ministersubject;
  @Input() portFolio;
  lower = ["(A)", '(B)', "(C)", '(D)', '(E)', '(F)'];
  questionNumber = false;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    if (this.qDetail.stage == 'QUESTION') {
      this.questionNumber = true;

    }
  }
  showAnswer() {
    const clauses = this.qDetail.clauses;
    const today = new Date().toISOString().split("T")[0];
    let haveAns = clauses.every(
      (val, i, arr) => val.answer && val.answer.type
    );
    if (this.isMLA()) {
      return (haveAns && this.qDetail.questionDate < today)
    }
    if (this.IsQsOfficials()) {
      return haveAns
    }
  }
  isMLA() {
    return this.auth.getCurrentUser().authorities.includes("MLA");
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


}
