import { Component, OnInit } from "@angular/core";
import * as diff from "node_modules/diff";
import { QuestionService } from "../../shared/question.service";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-question-versioning",
  templateUrl: "./question-versioning.component.html",
  styleUrls: ["./question-versioning.component.scss"],
})
export class QuestionVersioningComponent implements OnInit {
  clauseNo = ["A", "B", "C", "D", "E", "F", "G", "H"];
  questionId;
  statusParam: any;
  statusValue;
  qstatus: any;
  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.statusParam = params && params.status ? params.status : "";
      if (this.statusParam === "VIEW") {
        this.statusValue = "view";
      }
      if (this.statusParam === "EDIT") {
        this.statusValue = "edit";
      }
      if (params["id"]) {
        this.questionId = params["id"];
      }
      this.qstatus = params && params.qstatus ? params.qstatus : "";
    });
  }
  versionsCombo = [];
  selectedVersionV1;
  selectedVersionV2;
  v1: any = {};
  v2: any = {};
  assemblySession: object = [];
  ngOnInit() {
    this.getAssemblySession();
  }
  getAssemblySession() {
    this.questionService.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
          this.assemblySession = res;
          this.getVersionsInittaiDetails();
        }
    });
  }
  getVersionsInittaiDetails() {
    if (this.questionId) {
      this.questionService
        .getVersionsList(this.questionId)
        .subscribe((res: any) => {
          this.versionsCombo = res.versionDtails;
          this.versionsCombo.forEach((element) => {
            if (element.owner.roles.length > 1) {
            element.owner.roles.forEach((ele) => {
                if (ele.roleName === "speaker") {
                  element.ROLE = "Speaker";
                } else if (ele.roleName === "MLA"){
                  element.ROLE = ele.roleName;
                }
              });
            } else {
              element.ROLE = element.owner.roles[0].roleName;
            }
          });
          console.log(this.versionsCombo);
          this.v1 = res.mlaVersion;
          if (this.v1.question.category === "UNSTARRED") {
            this.v1.question.priority = null;
          }
          if (
            this.v1.question.assemblyId &&
            this.v1.question.sessionId &&
            this.assemblySession
          ) {
            this.v1.question.assemblyId = this.assemblySession["assembly"].find(
              (item) => item.id === this.v1.question.assemblyId
            ).assemblyId;
            this.v1.question.sessionId = this.assemblySession["session"].find(
              (item) => item.id === this.v1.question.sessionId
            ).sessionId;
          }
          this.selectedVersionV1 = this.v1.id;
          this.v2 = res.current;
          if (this.v2.question.category === "UNSTARRED") {
            this.v2.question.priority = null;
          }
          if (
            this.v2.question.assemblyId &&
            this.v2.question.sessionId &&
            this.assemblySession
          ) {
            this.v2.question.assemblyId = this.assemblySession["assembly"].find(
              (item) => item.id === this.v2.question.assemblyId
            ).assemblyId;
            this.v2.question.sessionId = this.assemblySession["session"].find(
              (item) => item.id === this.v2.question.sessionId
            ).sessionId;
          }
          this.selectedVersionV2 = this.v2.id;
        });
    }
  }

  getV1VersionDetailsById(versionId) {
    this.questionService.getVersionById(versionId).subscribe((res) => {
      this.v1 = {};
      this.v1 = res;
      if (this.v1.question.category === "UNSTARRED") {
        this.v1.question.priority = null;
      }
      if (
        this.v1.question.assemblyId &&
        this.v1.question.sessionId &&
        this.assemblySession
      ) {
        this.v1.question.assemblyId = this.assemblySession["assembly"].find(
          (item) => item.id === this.v1.question.assemblyId
        ).assemblyId;
        this.v1.question.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.v1.question.sessionId
        ).sessionId;
      }
    });
  }

  getV2VersionDetailsById(versionId) {
    this.questionService.getVersionById(versionId).subscribe((res) => {
      this.v2 = {};
      this.v2 = res;
      if (this.v2.question.category === "UNSTARRED") {
        this.v2.question.priority = null;
      }
      if (
        this.v2.question.assemblyId &&
        this.v2.question.sessionId &&
        this.assemblySession
      ) {
        this.v2.question.assemblyId = this.assemblySession["assembly"].find(
          (item) => item.id === this.v2.question.assemblyId
        ).assemblyId;
        this.v2.question.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.v2.question.sessionId
        ).sessionId;
      }
    });
  }
  createSpanGroup(dataChanges, fragmentToappend) {
    var span = null,
      decoration = null,
      decorationColor = null,
      textColor = null,
      divBackColor = null;
    dataChanges.forEach((part) => {
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
      fragmentToappend.appendChild(span);
    });
    fragmentToappend.style.background = divBackColor;
    return fragmentToappend;
  }
  getData(elementId, oldValue, newValue) {
    let data = diff.diffWords(
        oldValue ? oldValue.toString() : "",
        newValue ? newValue.toString() : ""
      ),
      fragment = document.createDocumentFragment(),
      display = document.getElementById(elementId);
    if (elementId === "ministerSubjectV2" || elementId === "ministerV2") {
      let data = diff.diffLines(
          oldValue ? oldValue.toString() : "",
          newValue ? newValue.toString() : ""
        ),
        fragment = document.createDocumentFragment(),
        display = document.getElementById(elementId);
    }
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
  getMinisterData(elementId, oldValue, newValue) {
    let data = diff.diffLines(
        oldValue ? oldValue.toString() : "",
        newValue ? newValue.toString() : ""
      ),
      fragment = document.createDocumentFragment(),
      display = document.getElementById(elementId);
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
  getMLAData(elementId, oldValues, newValues) {
    let i = 0;
    var display = document.getElementById(elementId);
    display.innerHTML = "";
    for (i; i < oldValues.length || i < newValues.length; i++) {
      var data = diff.diffWords(
        oldValues[i] ? oldValues[i].memberName : "",
        newValues[i] ? newValues[i].memberName : ""
      );
      var div = null;
      div = document.createElement("div");
      div.style.cssText =
        "border: 1px solid #eee;padding: 15px;border-radius: 4px;margin-bottom: 10px;margin: 0 5px 10px;";
      if (i != 0) div.style.paddingTop = "15px";
      display.appendChild(this.createSpanGroup(data, div));
    }
  }

  getNoticeNoData(elementId, oldValues, newValues) {
    let i = 0;
    var display = document.getElementById(elementId);
    display.innerHTML = "";
    for (i; i < oldValues.length || i < newValues.length; i++) {
      var data = diff.diffWords(
        oldValues[i] ? oldValues[i].noticeNumber.toString() : "",
        newValues[i] ? newValues[i].noticeNumber.toString() : ""
      );
      var div = null;
      div = document.createElement("div");
      display.appendChild(this.createSpanGroup(data, div));
    }
  }
  getClauseData(elementId, oldValues, newValues) {
    let i = 0;
    let j = 0;
    var display = document.getElementById(elementId);
    display.innerHTML = "";
    for (j; j < oldValues.length; j++) {
      oldValues[j].deleted = true;
      if (
        newValues.some(
          (value) =>
            (value.id === oldValues[j].id ||
              value.clause.trim() !== oldValues[j].clause.trim()) &&
            value.clauseOrder === oldValues[j].clauseOrder
        )
      ) {
        oldValues[j].deleted = false;
      }
    }
    for (i; i < oldValues.length || i < newValues.length; i++) {
      if (oldValues[i] && oldValues[i].deleted) {
        var data = diff.diffLines(
          oldValues[i] ? oldValues[i].clause.toString() : "",
          newValues[i] ? newValues[i].clause.toString() : ""
        );
        var subjectdata = diff.diffLines(
          oldValues[i] && oldValues[i].subSubjectName
            ? oldValues[i].subSubjectName.toString()
            : "",
          newValues[i] && newValues[i].subSubjectName
            ? newValues[i].subSubjectName.toString()
            : ""
        );
      } else {
        var data = diff.diffWords(
          oldValues[i] ? oldValues[i].clause.toString() : "",
          newValues[i] ? newValues[i].clause.toString() : ""
        );
        var subjectdata = diff.diffWords(
          oldValues[i] && oldValues[i].subSubjectName
            ? oldValues[i].subSubjectName.toString()
            : "",
          newValues[i] && newValues[i].subSubjectName
            ? newValues[i].subSubjectName.toString()
            : ""
        );
      }

      var rowDiv = document.createElement("div");
      rowDiv.className = "row";
      rowDiv.style.cssText = "padding-top:15px;";
      var divCol4 = document.createElement("div");
      divCol4.className = "col-md-4";
      var span = document.createElement("span");
      span.appendChild(
        document.createTextNode("Clause " + this.clauseNo[i] + " :")
      );
      divCol4.appendChild(span);
      var divCol8 = document.createElement("div");
      divCol8.className = "col-md-8";
      rowDiv.appendChild(divCol4);
      rowDiv.appendChild(this.createSpanGroup(data, divCol8));
      display.appendChild(rowDiv);
      if (
        (oldValues[i] && oldValues[i].subSubjectName) ||
        (newValues[i] && newValues[i].subSubjectName)
      ) {
        var rowDiv1 = document.createElement("div");
        rowDiv1.className = "row";
        rowDiv1.style.cssText = "padding-top:15px;";
        var divCol4 = document.createElement("div");
        divCol4.className = "col-md-4";
        var span = document.createElement("span");
        span.appendChild(document.createTextNode("Minister SubSubject:"));
        divCol4.appendChild(span);
        var divCol8 = document.createElement("div");
        divCol8.className = "col-md-8";
        rowDiv1.appendChild(divCol4);
        rowDiv1.appendChild(this.createSpanGroup(subjectdata, divCol8));
        display.appendChild(rowDiv1);
      }

      var rowDiv2 = document.createElement("div");
      rowDiv2.className = "row";
      rowDiv2.style.cssText = "padding-top:30px;";
      display.appendChild(rowDiv2);
    }
  }

  getTagData(elementId, oldValues, newValues) {
    let i = 0;
    var display = document.getElementById(elementId);
    display.innerHTML = "";
    for (i; i < oldValues.length || i < newValues.length; i++) {
      var data = diff.diffWords(
        oldValues[i] ? oldValues[i].tag : "",
        newValues[i] ? newValues[i].tag : ""
      );
      var div = null;
      div = document.createElement("div");
      div.className = "col-auto marginbtm-10";
      div.style.cssText =
        "border: 1px solid #eee;padding: 6px;border-radius: 4px;margin-right: 5px;";
      display.appendChild(this.createSpanGroup(data, div));
    }
  }

  onV1Change() {
    this.v1 = this.v2;
  }

  onV2Change() {
    this.v2 = this.v1;
  }

  compareTwoValues(oldValue, newValue) {
    if (oldValue != newValue) return true;
  }
  goBack() {
    if (this.statusValue === "view") {
      this.router.navigate([
        "business-dashboard/question/question-view",
        this.questionId,
        this.qstatus,
      ]);
    }
    // if (this.statusValue === "edit") {
    //   this.router.navigate([
    //     "business-dashboard/question/question-edit",
    //     this.questionId,
    //   ]);
    else {
      this.router.navigate([
        "business-dashboard/question/question-editsec",
        this.questionId,
        this.qstatus,
      ]);
    }
  }
}
