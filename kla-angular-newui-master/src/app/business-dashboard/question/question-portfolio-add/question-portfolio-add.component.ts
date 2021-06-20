import { Component, OnInit } from "@angular/core";
import { QuestionService } from "../shared/question.service";
import { Entity } from "src/app/shared/models/entity";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { NestableComponent } from 'ngx-nestable';
@Component({
  selector: "app-question-portfolio-add",
  templateUrl: "./question-portfolio-add.component.html",
  styleUrls: ["./question-portfolio-add.component.scss"]
})
export class QuestionPortfolioAddComponent implements OnInit {
  public portfolios = [];
  public subjects = [];
  public subSubjects = [];
  subjectValue: string;
  subSubjectValue: string;
  isVisible = false;
  listOfPortfolio: any;
  selectedPortfolioId: any;
  selectedSubjectId: any;
  portfolioEditValue: string;
  portfolioValue: string;
  selectedSubSubjectId: any;
  isPortfolioOrderChanged = false;
  isSubjectOrderChanged = false;
  isSubSubjectOrderChanged = false;
  constructor(
    private questionService: QuestionService,
    private notify: NotificationCustomService
  ) { }

  ngOnInit() {
    this.getPortfolios();
  }

  portfolioClick(result) {
    this._removeSelection();
    this.subjects = [];
    this.subSubjects = [];
    this.selectedPortfolioId = null;
    this.subSubjectValue = "";
    const indexedValue = this.portfolios.findIndex(element => element.value == result);
    this.portfolios[indexedValue].active = true;
    this.getMinisterSubjectsByPortfolioId(this.portfolios[indexedValue].value);
    this.selectedPortfolioId = this.portfolios[indexedValue].value;
  }
  _removeSelection() {
    this.portfolios.filter(function (item) {
      return (item.active = "");
    });
    this.subjects.filter(function (item) {
      return (item.active = "");
    });
    this.subSubjects.filter(function (item) {
      return (item.active = "");
    });
  }
  subjectClick(result) {
    this.subjects.filter(function (item) {
      return (item.active = "");
    });
    this.selectedSubjectId = null;
    this.subSubjects = [];
    const indexedValue = this.subjects.findIndex(element => element.value == result);
    this.subjects[indexedValue].active = true;
    this.getMinisterSubSubjectsBySubjectId(this.subjects[indexedValue].value);
    this.selectedSubjectId = this.subjects[indexedValue];
  }

  subSubjectClick(result) {
    this.subSubjects.filter(function (item) {
      return (item.active = "");
    });
    const indexedValue = this.subSubjects.findIndex(element => element.value == result);
    this.subSubjects[indexedValue].active = true;
  }

  /* addPortfolio(addPortfolio) {
    this.portfolios.push({ label: addPortfolio, value: null });
    this.portfolioValue = '';
  } */

  addSubject(addSubject) {
    if (!this.selectedPortfolioId) {
      this.notify.showWarning("Warning", "Choose a Portfolio");
      this.subjectValue = "";
      return;
    }
    if (!addSubject) {
      this.notify.showWarning("Warning", "Please Enter a Subject");
      return;
    }
    if (this.selectedPortfolioId) {
      let data = {
        portfolio: {
          id: this.selectedPortfolioId
        },
        title: addSubject,
        priorityOrder: this.subjects ? this.subjects.length : 0
      };
      this.saveSubject(data);
    }
  }

  addSubSubject(addSubSubject) {
    if (!this.selectedSubjectId) {
      this.notify.showWarning("Warning", "Choose a Subject");
      this.subSubjectValue = "";
      return;
    }
    if (!addSubSubject) {
      this.notify.showWarning("Warning", "Please Enter a Sub Subject");
      return;
    }
    let data = {
      mockSubject: {
        id: this.selectedSubjectId.value
      },
      title: addSubSubject,
      priorityOrder: this.subSubjects ? this.subjects.length : 0

    };
    this.saveSubSubject(data);
  }
  saveSubject(subjectData) {
    this.questionService.saveSubject(subjectData).subscribe((response: any) => {
      this.subjects.push({ label: response.title, value: response.id, order: response.priorityOrder });
      this.subjectValue = "";
      this.notify.showSuccess("Success", "Subject Added Succesfully");
      this.saveSubjectOrder(false);
      // this.getMinisterSubjectsByPortfolioId(this.selectedPortfolioId);
    });
  }

  saveSubSubject(subSubjectData) {
    this.questionService.saveSubSubject(subSubjectData).subscribe((response: any) => {
      this.subSubjects.push({ label: response.title, value: response.id, order: response.priorityOrder });
      this.subSubjectValue = "";
      this.notify.showSuccess("Success", "Sub Subject Added Succesfully");
      this.saveSubSubjectOrder(false);
      // this.getMinisterSubSubjectsBySubjectId(this.selectedSubjectId);
    });
  }

  getPortfolios() {
    this.questionService.listOfPortfolio().subscribe((res: any) => {
      this.mapProtfolioData(res);
    });
  }
  mapProtfolioData(res) {
    this.portfolios = [];
    this.subjects = [];
    this.subSubjects = [];
    this.isSubjectOrderChanged = false;
    this.isSubSubjectOrderChanged = false;
    this.isPortfolioOrderChanged = false;
    this.selectedPortfolioId = null;
    this.selectedSubjectId = null;
    this.selectedSubSubjectId = null;
    let comboDatas = [];
    res.forEach(portfolio => {
      comboDatas.push({
        label: portfolio.name,
        value: portfolio.id,
        order: portfolio.priorityOrder
      });
    });
    this.portfolios = comboDatas.sort((a, b) => a.order > b.order ? 1 : -1);
  }
  getMinisterSubjectsByPortfolioId(portFolioId) {

    this.questionService
      .getMinisterSubject(portFolioId)
      .subscribe((res: any) => {
        this.mapSubjectData(res);
      });
  }

  mapSubjectData(res) {
    this.subjects = [];
    this.subSubjects = [];
    this.isSubjectOrderChanged = false;
    this.isSubSubjectOrderChanged = false;
    this.selectedSubjectId = null;
    this.selectedSubSubjectId = null;
    let comboDatas = [];
    res.forEach(subject => {
      comboDatas.push({
        label: subject.title,
        value: subject.id,
        order: subject.priorityOrder

      });
    });
    this.subjects = comboDatas.sort((a, b) => a.order > b.order ? 1 : -1);

  }
  getMinisterSubSubjectsBySubjectId(subjectId) {

    this.questionService
      .getMinisterSubSubjects(subjectId)
      .subscribe((res: any) => {
        this.mapSubSubjectData(res);
      });
  }

  mapSubSubjectData(res) {
    this.subSubjects = [];
    this.isSubSubjectOrderChanged = false;
    this.selectedSubSubjectId = null;
    let comboDatas = [];
    res.forEach(subsubject => {
      comboDatas.push({
        label: subsubject.title,
        value: subsubject.id,
        order: subsubject.priorityOrder
      });
    });
    this.subSubjects = comboDatas.sort((a, b) => a.order > b.order ? 1 : -1);;

  }
  handleCancel() { }
  handleOk() { }

  onPortfolioItemDropped() {
    let d = this.portfolios.find((element, index) => element.$$id != index);
    if (d) {
      this.isPortfolioOrderChanged = true;
    }
  }
  savePortfolioOrder() {
    this.questionService
      .updatePortfolioOrder(this.portfolios)
      .subscribe((res: any) => {
        this.notify.showSuccess("Success", "Portfolio Order Updated.");
        this.isPortfolioOrderChanged = false;
        this.mapProtfolioData(res);
      });
  }
  onSubjectItemDropped() {
    let d = this.subjects.find((element, index) => element.$$id != index);
    if (d) {
      this.isSubjectOrderChanged = true;
    }
  }
  saveSubjectOrder(showmsg) {
    this.questionService
      .updateMinisterSubjectOrder(this.subjects)
      .subscribe((res: any) => {
        if (showmsg) {
          this.notify.showSuccess("Success", "Subject Order Updated.");
        }

        this.isSubjectOrderChanged = false;
        this.mapSubjectData(res);
      });
  }

  onSubSubjectItemDropped() {
    let d = this.subSubjects.find((element, index) => element.$$id != index);
    if (d) {
      this.isSubSubjectOrderChanged = true;
    }
  }
  saveSubSubjectOrder(showmsg) {
    this.questionService
      .updateMinisterSubSubjectOrder(this.subSubjects)
      .subscribe((res: any) => {
        if (showmsg) {
          this.notify.showSuccess("Success", "Sub Subject Order Updated.");
        }
        this.isSubSubjectOrderChanged = false;
        this.mapSubSubjectData(res);

      });
  }
}
