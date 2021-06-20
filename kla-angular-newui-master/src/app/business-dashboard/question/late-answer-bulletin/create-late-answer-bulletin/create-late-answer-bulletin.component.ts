import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "../../../../auth/shared/services/auth.service";
import { UserData } from "../../../../auth/shared/models";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { Location } from '@angular/common';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-create-late-answer-bulletin',
  templateUrl: './create-late-answer-bulletin.component.html',
  styleUrls: ['./create-late-answer-bulletin.component.scss']
})
export class CreateLateAnswerBulletinComponent implements OnInit {

  isContentEditable = true;
  showPreview = false;
  previewData = ""
  buttonList: any = [];
  list;
  listId;
  allResponse;
  currentUser: UserData;
  pageTitle: string = "Late Answer Bulletin";
  assemblySession: object = [];
  bulletinFtr = { isVisible: false, footer: '' }
  submitCnfrmmessge = 'Do you want to submit this bulletin without footer?';
  constructor(
    private question: QuestionService,
    private location: Location,
    private route: ActivatedRoute,
    private authService: AuthService,
    private rbsService: QuestionRBSService,
    private notify: NotificationCustomService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.route.params.subscribe((params) => {
      this.listId = params["listId"] ? params["listId"] : "";
    });
  }

  ngOnInit() {
    this.getAssemblySession();
    this.loadRBSPermissions();
  }
  getLateAnswerBulletinById(listId) {
    if (listId) {
      this.question.getLateAnswerBulletinById(listId).subscribe(res => {
        this.list = res.data;
        let assembly = this.assemblySession["assembly"].find(
          (item) => item.id === this.list.assemblyId
        ).assemblyId;
        let session = this.assemblySession["session"].find(
          (item) => item.id === this.list.sessionId
        ).sessionId;
        this.list.assemblyValue = assembly;
        this.list.sessionValue = session;
        this.list.date = new Date(res.createDateTime).toJSON().split("T")[0].toString();
        this.allResponse = res;
      })
    }
  }
  getAssemblySession() {
  this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        this.getLateAnswerBulletinById(this.listId);
      }
    });
  }
  loadRBSPermissions() {
    if (this.currentUser.userId) {
      this.rbsService
        .getQuestionPermissions(this.currentUser.userId)
        .subscribe(() => {
          this.buttonList = this.rbsService.getrbsPermissionForBallot();
        });
    }
  }
  findSessionListByAssembly(selAssembly) {
    if (this.assemblySession) {
      if (this.assemblySession['sessionByAssembly'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['sessionByAssembly'].find(
          (element) => element.id === selAssembly).session;
        this.assemblySession['session'] = session;
        this.assemblySession['session'].currentsession = session.slice(-1).pop().id
      }
    }
    if(this.assemblySession['session'].currentsession) {
      this.redirectToList();
    }
  }
  redirectToList() {
    // this.getAnswerStatuslist();
  }

  getAnswerStatuslist() {
    this.list = null;
    this.question
      .getBallotSet(
        this.assemblySession["assembly"].currentassembly,
        this.assemblySession["session"].currentsession
      )
      .subscribe((res: any) => {
        this.list = res ? res : null
      });
  }

  generateList() {
    this.list = null;
    this.question.getGeneratedLateAnswerBulletin
      (this.assemblySession['assembly'].currentassembly, this.assemblySession['session'].currentsession)
      .subscribe(res => {
        this.list = res;
        let assembly = this.assemblySession["assembly"].find(
          (item) => item.id === this.list.assemblyId
        ).assemblyId;
        let session = this.assemblySession["session"].find(
          (item) => item.id === this.list.sessionId
        ).sessionId;
        let registrationDate = this.question.formatDateDDMMYYYY(
          new Date()
        );
        this.list.heading = `${assembly} -ാം കേരള നിയമസഭയുടെ ${session} -ാം സമ്മേളനത്തിൽ ${this.showDates()} തീയ്യതികളിലെ ചോദ്യങ്ങളുടെ പട്ടികയിൽ ഉൾപ്പെടുത്തിയിരുന്നതും യഥാസമയം ഉത്തരം ലഭിക്കാത്തതും എന്നാൽ ${registrationDate} വരെ ഉത്തരം ലഭിച്ചതുമായ ചോദ്യങ്ങളുടെ നമ്പർ താഴെ കൊടുത്തിരിക്കുന്നു. ഉത്തരങ്ങൾ നിയമസഭാമന്ദിരത്തിലെ മെംബേർസ് റഫറൻസ് വിഭാഗത്തിൽ (റൂം നം.504) സൂക്ഷിച്ചിട്ടുണ്ട്. `;
      })
  }
  showDates() {
    let newDate = '';
    if (this.list.dates) {
      let arr = this.list.dates.split(',');
      arr.forEach(element => {
        newDate += element.toString().split("-").reverse().join("-") + ', ';
      });
      newDate = newDate.replace(/,\s*$/, "");
    }
    return newDate;
  }

  saveBulletin() {

    this.list.heading = document.getElementById('header').innerText;
    let saveData = {
      "id": this.listId ? this.listId : '',
      "assembyId": this.list.assemblyId,
      "sessionId": this.list.sessionId,
      "bulletin": JSON.stringify(this.list)
    }
    this.question.saveLateAnswerBulletin(saveData).subscribe(res => {
      this.notify.showSuccess("Success", "Bulletin Saved.");
      this.goBack();
    })
  }

  submitBulletin() {
    this.list.heading = document.getElementById('header').innerText;
    let saveData = {
      "id": this.listId ? this.listId : '',
      "assembyId": this.list.assemblyId,
      "sessionId": this.list.sessionId,
      "bulletin": JSON.stringify(this.list)
    }
    this.question.submitLateAnswerBulletin(saveData).subscribe(res => {
      this.notify.showSuccess("Success", "Bulletin Submitted.");
      this.goBack();
    })
  }

  goBack() {
    this.location.back();
  }

  showPreviewModal() {
    let bodyControl = document.getElementsByTagName("body")[0];
    bodyControl.classList.add("questionbooklet");
    this.showPreview = true;
    this.previewData = document.getElementById('print-section').innerHTML;
    this.previewData = this.previewData.split('contenteditable="true"').join("");

  }
  cancelVersion() {
    let bodyControl = document.getElementsByTagName("body")[0];
    bodyControl.classList.remove("questionbooklet");
    this.showPreview = false;
  }

  totalColumn(key, length) {
    let total = 0;
    if (this.list && this.list.rows && this.list.rows.length > 0) {
      if (!length)
        total = this.list.rows.reduce((prev, next) => prev + next[key], 0);
      else
        total = this.list.rows.reduce((prev, next) => prev + next[key].length, 0);
    }
    return total ? total : "ഇല്ല";
  }
  addFooter() {
    if(!this.bulletinFtr.footer) {
      this.notify.showWarning('Warning', 'Please Enter Footer!');
      return;
    }
    this.submitCnfrmmessge = 'Do you want to submit this bulletin?';
    this.list.footer = this.bulletinFtr.footer;
    this.bulletinFtr.isVisible = false;
  }
  cancelFooter() {
    this.bulletinFtr.isVisible = false;
    this.list.footer = this.bulletinFtr.footer;
    if(!this.bulletinFtr.footer) {
      this.submitCnfrmmessge = 'Do you want to submit this bulletin without footer?';
    }
  }
}
