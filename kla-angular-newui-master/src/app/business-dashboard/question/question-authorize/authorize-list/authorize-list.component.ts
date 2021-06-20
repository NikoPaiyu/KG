import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";

@Component({
  selector: "app-authorize-list",
  templateUrl: "./authorize-list.component.html",
  styleUrls: ["./authorize-list.component.scss"],
})
export class AuthorizeListComponent implements OnInit {
  listOfData = [];
  listOfAllData = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchParam: string;
  searchAddress: string;
  listOfSearchName: string[] = [];
  statusParam: any;
  showQuestionDeatils = false;
  assemblySession: object = [];
  questionDetails;
  clauseNo = ["A", "B", "C", "D", "E", "F", "G", "H"];
  constructor(
    private question: QuestionService,
    private notify: NotificationCustomService,

  ) { }
  ngOnInit() {
    this.getPendingAuthorizeList();
    this.getAssemblySession();
  }
  getPendingAuthorizeList() {
    this.listOfAllData = this.listOfData = [];
    this.question.getPendingAuthorizeList().subscribe((res: any) => {
      this.listOfAllData = this.listOfData = res;
    });
  }
  getAssemblySession() {
    this.question.getAllAssemblyAndSession().subscribe((res) => {
      if (res) {
        this.assemblySession = res;
        }
    });
  }
  view(id) {
    this.question.getVersionsList(id).subscribe((res: any) => {
      this.questionDetails = res.current.question;
      if (
        this.questionDetails.assemblyId &&
        this.questionDetails.sessionId &&
        this.assemblySession
      ) {
        this.questionDetails.assemblyId = this.assemblySession[
          "assembly"
        ].find(
          (item) => item.id === this.questionDetails.assemblyId
        ).assemblyId;
        this.questionDetails.sessionId = this.assemblySession["session"].find(
          (item) => item.id === this.questionDetails.sessionId
        ).sessionId;
      }
      this.showQuestionDeatils = true;
    });
  }
  ApproveAuthorizeRequest(requestId) {
    this.question.ApproveAuthorization(requestId).subscribe((res: any) => {
      this.notify.showSuccess(res.body, "");
      this.getPendingAuthorizeList();
    });
  }
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }
  search(): void {
    const filterFunc = (item: { name: string; age: number; address: string }) =>
      (this.searchAddress
        ? item.address.indexOf(this.searchAddress) !== -1
        : true) &&
      (this.listOfSearchName.length
        ? this.listOfSearchName.some((name) => item.name.indexOf(name) !== -1)
        : true);
    const data = this.listOfData.filter((item) => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.listOfData = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.listOfData = data;
    }
  }
  DoNothing() {
    return false;
  }
  onSearchUser() {
    if (this.searchParam) {
      this.listOfData = this.listOfAllData.filter(
        (element) =>
          (element.fromMember &&
            element.fromMember
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.toMember &&
            element.toMember
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.questionHeading &&
            element.questionHeading
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.listOfData = this.listOfAllData;
    }
  }
}
