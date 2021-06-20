import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { QuestionService } from '../../question.service';

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
  @Input() statusParam = null;
  lower =["(A)",'(B)',"(C)",'(D)','(E)','(F)'];
  questionNumber = false;
  constructor(private auth: AuthService,
    private questionSerivce: QuestionService,
    private notify: NotificationCustomService,
    public datepipe: DatePipe
    ) { }

  ngOnInit() {
    // let bodyControl = document.getElementsByTagName("body")[0];
    // bodyControl.classList.add("questionbooklet");
    if (this.qDetail.stage =='QUESTION') {
      this.questionNumber = true;
      
    }
  }
  showAnswer() {
    const clauses = this.qDetail.clauses;
    const today = new Date().toISOString().split("T")[0];
    let haveAns = clauses.every(
      (val, i, arr) => val.answer && val.answer.type
    );
    return haveAns
    // if (this.isMLA()) {
    //   return (haveAns && this.qDetail.questionDate <= today)
    // }
    // if (this.IsQsOfficials()) {
    //   return haveAns
    // }
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
  getPDF() {
    let body = this.buildRequestbody();
    let finalUrl = null;
    var mediaType = "application/pdf";
    this.questionSerivce.getReport(body).subscribe((response) => {
      if (response) {
        var blob = new Blob([response], { type: mediaType });
        finalUrl = URL.createObjectURL(blob);
        window.open(finalUrl,'_blank');
      } else {
        this.notify.showWarning("Sorry Report is not Available", "");
      }
    });
  }
  buildRequestbody(){
    let body = {
      reportType: this.qDetail.category == 'STARRED' ? 'StarredQuestionLOB' : 'UnStarredQuestionLOB',
      assemblyId: this.assembly,
      sessionId : this.session,
      questionNumber : this.qDetail.questionNumber,
      answerDate : this.datepipe.transform(this.qDetail.questionDate, 'dd-MM-yyyy'),
      heading : this.qDetail.heading,
      answeringBy : this.portFolio.ministerName,
      answeringPortfolio :  this.portFolio.nameInMalayalam
      ? this.portFolio.nameInMalayalam
      : this.portFolio.name,
      members : this.setMembers(),
      clauses : this.setClauses(),
    }
    return body;
  }
  setMembers(){
    let members = [];
    if(this.qDetail.clubbingDetails.length > 0){
      this.qDetail.clubbingDetails.forEach(data => {
       members.push(data.memberNameInMalayalam
        ? data.memberNameInMalayalam
        : data.memberName);
     });
    }
    return members;
  }
  setClauses(){
    let clauses = [];
    if(this.qDetail.clauses.length > 0){
      clauses = this.qDetail.clauses.map((x) => ({
        clause: x.clause,
        answer: x.answer.answer ,
      }));
    }
    return clauses;
  }
}
