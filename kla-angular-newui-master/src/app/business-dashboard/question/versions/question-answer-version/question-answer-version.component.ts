import { Component, OnInit } from "@angular/core";
import * as diff from "node_modules/diff";
import { QuestionService } from "../../shared/question.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";
@Component({
  selector: "app-question-answer-version",
  templateUrl: "./question-answer-version.component.html",
  styleUrls: ["./question-answer-version.component.scss"],
})
export class QuestionAnswerVersionComponent implements OnInit {
  clauseNo = ["A", "B", "C", "D", "E", "F", "G", "H"];
  questionId;
  statusParam: any;
  versionsCombo = [];
  selectedVersionV1 = 1;
  selectedVersionV2 = 2;
  v1: any = {};
  v2: any = {};
  vesion1: any = {};
  vesion2: any = {};
  currentUser: UserData;
  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.statusParam = params && params.status ? params.status : "";
      if (params["id"]) {
        this.questionId = params["id"];
        this.getVersionsInittaiDetails();
      }
    });
  }
  getVersionsInittaiDetails() {
    if (this.questionId)
      this.questionService
        .getAnswerVersions(this.questionId, 1)
        .subscribe((res: any) => {
          if (res && res.length > 0) {
            this.versionsCombo = [
              {
                version: 1,
                id: 1,
              },
              {
                version: 2,
                id: 2,
              },
            ];
            for (var n in res) {
              res[n].clause_elementId = "clauseV" + res[n].version + "_" + n;
              res[n].ans_elementId = "answerV" + res[n].version + "_" + n;
              res[n].type_elementId = "typeV" + res[n].version + "_" + n;
              res[n].clause = "";
            }
            this.v1 = this.vesion1 = res;
            this.questionService
              .getView(this.questionId, this.currentUser.userId)
              .subscribe((response) => {
                if (response && response["question"]) {
                  let clauses = response["question"].clauses;
                  let version = res.length + 1;
                  let counter = 0;
                  let newArr = [];
                  clauses.forEach((element) => {
                    let newObj = {};
                    this.v1[counter].clause = element.clause;
                    counter++;
                    newObj["id"] = element.answer.id;
                    newObj["answer"] = element.answer.answer;
                    newObj["answer"] = element.answer.answer;
                    newObj["clauseAnswerUrl"] = element.answer.clauseAnswerUrl;
                    newObj["type"] = element.answer.type;
                    newObj["version"] = version;
                    newObj["clauseId"] = element.id;
                    newObj["clause"] = element.clause;
                    newObj["clause_elementId"] =
                      "clauseV" + version + "_" + counter;
                    newObj["ans_elementId"] =
                      "answerV" + version + "_" + counter;
                    newObj["type_elementId"] =
                      "typeV" + version + "_" + counter;
                    newArr.push(newObj);
                    // tslint:disable-next-line: triple-equals
                    if (counter == clauses.length) {
                      this.v2 = this.vesion2 = newArr;
                    }
                  });
                }
              });
          }
        });
  }
  getV1VersionDetailsById(versionId) {
    if (versionId === 2) {
      this.v1 = this.vesion2;
    } else {
      this.v1 = this.vesion1;
    }
  }
  getV2VersionDetailsById(versionId) {
    if (versionId === 1) {
      this.v2 = this.vesion1;
    } else {
      this.v2 = this.vesion2;
    }
  }
  getData(elementId, oldValue, newValue, index) {
    var data = diff.diffWords(
        oldValue ? oldValue.toString() : "",
        newValue ? newValue.toString() : ""
      ),
      fragment = document.createDocumentFragment(),
      display = document.getElementById(elementId);
    if (display) {
      var span = null,
        decoration = null,
        decorationColor = null,
        textColor = null,
        divBackColor = null;
      data.forEach((part) => {
        if (!divBackColor && (part.added || part.removed))
          divBackColor = "#f3f371";
        decoration = part.removed ? "line-through" : "none";
        decorationColor = part.removed ? "red" : "";
        textColor = part.removed ? "red" : part.added ? "#18d615" : "";
        span = document.createElement("span");
        span.style.textDecoration = decoration;
        span.style.textDecorationColor = decorationColor;
        span.style.color = textColor;
        span.appendChild(document.createTextNode(part.value));
        fragment.appendChild(span);
      });
      display.innerHTML = "";
      display.style.background = divBackColor;
      display.appendChild(fragment);
    }
  }
  compareTwoValues(oldValue, newValue) {
    if (oldValue != newValue) return true;
  }
  goBack() {
    if (this._IsMinister()) {
      this.router.navigate([
        "business-dashboard/question/question-correctionview",
        this.questionId,
        this.statusParam,
      ]);
    } else {
      this.router.navigate([
        "business-dashboard/question/question-view",
        this.questionId,
      ]);
    }
  }
  _IsMinister() {
    return this.authService.getCurrentUser().authorities.includes("minister");
  }
}
