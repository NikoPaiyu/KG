import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "../../../../auth/shared/services/auth.service";
import { UserData } from "../../../../auth/shared/models";
import { QuestionRBSService } from "../../shared/question-rbs.service";
import { Location } from '@angular/common';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
@Component({
  selector: 'app-create-answer-status-list',
  templateUrl: './create-answer-status-list.component.html',
  styleUrls: ['./create-answer-status-list.component.scss']
})
export class CreateAnswerStatusListComponent implements OnInit {
  isContentEditable = true;
  showPreview = false;
  previewData = ""
  buttonList: any = [];
  list;
  listId;
  allResponse;
  currentUser: UserData;
  pageTitle: string = "Answer Status List";
  assemblySession: object = [];
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
  getAnswerStatusListById(listId) {
    if (listId) {
      this.question.getAnswerStatusListById(listId).subscribe(res => {
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
        this.getAnswerStatusListById(this.listId);
      }
    }); 
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
  loadRBSPermissions() {
    if (this.currentUser.userId) {
      this.rbsService
        .getQuestionPermissions(this.currentUser.userId)
        .subscribe(() => {
          this.buttonList = this.rbsService.getrbsPermissionForBallot();
        });
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
    this.question.getGeneratedAnswerStatusList
      (this.assemblySession['assembly'].currentassembly, this.assemblySession['session'].currentsession)
      .subscribe(res => {
        this.list = res;
        let assembly = this.assemblySession["assembly"].find(
          (item) => item.id === this.list.assemblyId
        ).assemblyId;
        let session = this.assemblySession["session"].find(
          (item) => item.id === this.list.sessionId
        ).sessionId;
        this.list.heading = `${assembly} -ാം കേരള നിയമസഭയുടെ ${session} -ാം സമ്മേളനം`;
        this.list.subHeading = "ഉത്തരം ലഭിക്കാനുള്ള ചോദ്യങ്ങളുടെയും വിവരം ശേഖരിച്ചുവരുന്നുവെന്നു മറുപടി നല്കിയവയുടെയും വിശദമായ സ്റ്റേറ്റ്മെന്റ്"

      })

  }

  saveAnswerList() {

    this.list.heading = document.getElementById('header').innerText;
    this.list.subHeading = document.getElementById('subheader').innerText;
    let saveData = {
      "id": this.listId ? this.listId : '',
      "assembyId": this.list.assemblyId,
      "sessionId": this.list.sessionId,
      "report": this.list
    }
    this.question.saveAnswerStatusList(saveData).subscribe(res => {
      this.notify.showSuccess("Success", "List Saved.");
      this.goBack();
    })
  }

  submitAnswerList() {
    this.list.heading = document.getElementById('header').innerText;
    this.list.subHeading = document.getElementById('subheader').innerText;
    let saveData = {
      "id": this.listId ? this.listId : '',
      "assembyId": this.list.assemblyId,
      "sessionId": this.list.sessionId,
      "report": this.list
    }
    this.question.submitAnswerStatusList(saveData).subscribe(res => {
      this.notify.showSuccess("Success", "List Submitted.");
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
}
