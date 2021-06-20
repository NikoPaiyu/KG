import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { QuestionList } from "../../shared/model/question";
import { AuthService } from "src/app/auth/shared/services/auth.service";

@Component({
  selector: "app-clubbing-list",
  templateUrl: "./clubbing-list.component.html",
  styleUrls: ["./clubbing-list.component.scss"],
})
export class QuestionClubbingListComponent implements OnInit {
  tablefiltrParams: any = { disable: {}, data: {} };
  isVisibleFilter = false;
  listOfData = [];
  listOfAllData = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchParam: string;
  searchAddress: string;
  listOfSearchName: string[] = [];
  role: string;
  statusParam: any;
  sortbyId = false;
  constructor(
    private router: Router,
    private question: QuestionService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}
  ngOnInit() {
    this.role = this.auth.getCurrentUser().authorities[0];
    this.getClubbingRequests();
  }
  getClubbingRequests() {
    this.question.getClubbingRequests().subscribe((res: any) => {
      this.listOfAllData = this.listOfData = res;
    });
  }
  view(list) {
    this.router.navigate(["business-dashboard/question/clubbing-view", list.requestId]);
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
          (element.fromQuestion &&
            element.fromQuestion
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.toQuestion &&
            element.toQuestion
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.requestedDate &&
            element.requestedDate
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.listOfData = this.listOfAllData;
    }
  }
}
