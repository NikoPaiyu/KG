import { Component, OnInit } from "@angular/core";
import { Question } from "../../shared/model/question";
import { QuestionService } from "../../shared/question.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserDetails } from "../../../user-management/shared/models/userDetails";
import { UserManagementService } from "../../../user-management/shared/services/user-management.service";
import { QuestionMenus } from "../../question.menus";
import * as jsPdf from "jspdf";
import "jspdf-autotable";
import { TranslateService } from '@ngx-translate/core';
import { QuestionRBSService } from "../../shared/question-rbs.service";
interface ItemData {
  id: number;
}
@Component({
  selector: "app-question-mla-listing",
  templateUrl: "./question-mla-listing.component.html",
  styleUrls: ["./question-mla-listing.component.scss"]
})
export class QuestionMlaListingComponent implements OnInit {
  filterCheckboxes = [
    { label: this.translate.instant('business-dashboard.question.constituency'), checked: false },
    { label: this.translate.instant('business-dashboard.questionmlalisting.partyside'), checked: false },
    { label: this.translate.instant('business-dashboard.questionmlalisting.usertype'), checked: false }
  ];
  checked = true;
  isVisible = false;
  clearfilter;
  assemblyList: any;
  sessionList: any;
  searchParam: string = "";
  filterSelected = {
    userType: null,
    roleDisplay: null,
    constituencyName: null,
    party: null,
    partySide: null,
    memberGroup: null
  };
  usertypeSelect = "";
  filterconstituency = [];
  filterparty = [];
  dashBoardUrl;
  selectedAssemblyValue: number;
  selectSessionValue: number;
  printable = false;
  routeData = null;
  assemblySession;
  constructor(
    private router: Router,
    private questionSerivce: QuestionService,
    public userService: UserManagementService,
    private questionMenus: QuestionMenus,
    private route: ActivatedRoute,
    private translate: TranslateService,
    public rbsService: QuestionRBSService
  ) { this.setRouterData(); }
  setRouterData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    )
      this.routeData = this.router.getCurrentNavigation().extras.state.data;
  }
  ngOnInit() {
    this.dashBoardUrl = this.questionMenus.getDashBoardUrl();
    this.getAssemblySession();
    this.getlistOfMla();
  }
  getAssemblySession() {
    this.questionSerivce.getAllAssemblyAndSession().subscribe((assemblySession) => {
      if (assemblySession) {
        this.assemblySession = assemblySession;
        this.assemblyList = assemblySession.assembly;
        this.selectedAssemblyValue = assemblySession['assembly']['currentassembly'];
        this.sessionList = assemblySession.session;
        this.selectSessionValue = assemblySession['session']['currentsession'];
      }
    });
  }

  save() { }
  showModal(): void {
    this.isVisible = true;
  }
  onCheckBoxChange(box) {
    box.checked = !box.checked;
  }
  handleListColumnView(box) {
    box.checked = !box.checked;
  }
  handleOk(): void {
    this.isVisible = false;
    this.constituencydisable = this.filterCheckboxes.find(
      element => element.label === "Constituency"
    ).checked;
    this.rulingdisable = this.filterCheckboxes.find(
      element => element.label === "Party Side"
    ).checked;
    this.partysidedisable = this.filterCheckboxes.find(
      element => element.label === "User Type"
    ).checked;
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    let self = this;
    let counter2 = 0;

    this.constituencydisable
      ? Object.keys(self.listOfAllMla).forEach(function (key) {
        counter2++;
        self.filterconstituency.push(self.listOfAllMla[key].constituencyName);
        if (counter2 == self.listOfAllMla.length) {
          self.filterconstituency = self.filterconstituency.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
  }

  handleCancel(): void {
    this.isVisible = false;

    if (this.isVisible == false) {
      this.clearFilter();
    }
  }

  listOfMla = [];
  listOfAllMla = [];

  getlistOfMla() {
    this.listOfMla = [];
    this.listOfAllMla = [];
    this.questionSerivce.getMlaList().subscribe((user: any) => {
      this._formatDataForRendering(user);
    });
  }
  _formatDataForRendering(user) {
    const listArrr = [];
    const self = this;
    user.forEach(function (user) {
      const userelement = new UserDetails();
      userelement.constituencyId = user.details.keralaConstituencyId;
      userelement.firstName = (user.details.firstName).trim();
      userelement.lastName = user.details.lastName;
      userelement.constituencyName = user.details.keralaConstituencyName;
      userelement.partyId = user.details.keralaPolicticalPartyid;
      userelement.memberGroup = self.rebuildPartySide(user.details.memberGroup);
      userelement.mobileNumber = user.details.mobileNumber;
      userelement.id = user.userId;
      // userelement.partyId = self.rebuildPartyByName(user.details.keralaPolicticalPartyid);
      user.roles.forEach(element => {
        userelement.role.push(element.roleId);
        userelement.roleDisplay.push(element.roleName);
      });

      listArrr.push(userelement);
    });
    this.listOfMla = this.listOfAllMla = listArrr;
    this.setFilteronBack();
  }
  partyList = [];

  rebuildPartyByName(keralaPolicticalPartyid) {
    let partyname = "";
    this.userService.getParties().subscribe((party: any) => {
      this.partyList = party;

      this.partyList.forEach(function (element: any) {
        if (element.value === keralaPolicticalPartyid) {
          partyname = element.label;
        }
      });
    });
    return partyname;
  }
  rebuildPartySide(memberGroup) {
    let partyside = "";
    if (memberGroup == "RULING_PARTY" || memberGroup == "TREASURY_BENCH") {
      partyside = "Ruling";
    } else {
      partyside = "Opposition";
    }

    return partyside;
  }

  AssemblyId = ["questionData"];

  // sortKey: string | null = null;
  sortValue: string | null = null;
  sortName: string | null = null;
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  loading = true;
  sort(sort: { key: string; value: string }): void {
    const data = this.listOfMla.filter(item => item);
    if (sort.key && sort.value) {
      this.listOfMla = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.listOfMla = data;
    }
  }

  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  currentPageDataChange($event: ItemData[]): void {
    this.listOfMla = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfMla.every(
      item => this.mapOfCheckedId[item.id]
    );
    this.isIndeterminate =
      this.listOfMla.some(item => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfMla.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  assemblydisable = true;
  AssemblyDisable() {
    this.assemblydisable = false;
  }

  sessiondisable = true;
  SessionDisable() {
    this.sessiondisable = false;
  }
  fliterNum: any;
  constituencydisable = false;
  partydisable = false;
  rulingdisable = false;
  partysidedisable = false;
  //partysidedisable = true;
  // namedisable=false;
  disableFilter(fliterNum) {
    switch (fliterNum) {
      case 1:
        this.constituencydisable = false;
        this.filterSelected.constituencyName = null;
        this.filterCheckboxes.forEach(element => {
          if (element.label == "Constituency") {
            element.checked = false;
          }
        });
        break;
      case 2:
        this.rulingdisable = false;
        this.filterSelected.memberGroup = null;
        this.filterCheckboxes.forEach(element => {
          if (element.label == "Party Side") {
            element.checked = false;
          }
        });
        break;

      case 3:
        this.partysidedisable = false;
        this.filterSelected.roleDisplay = null;
        this.filterCheckboxes.forEach(element => {
          if (element.label == "User Type") {
            element.checked = false;
          }
        });
        break;
      default:
        break;
    }
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  clearFilter() {
    this.constituencydisable = false;
    this.partydisable = false;
    this.rulingdisable = false;
    this.partysidedisable = false;
    //  this.namedisable=false;
    this.filterSelected = {
      userType: null,
      constituencyName: null,
      party: null,
      partySide: null,
      memberGroup: null,
      roleDisplay: null
    };

    this.filterCheckboxes = [
      { label: "Constituency", checked: false },
      { label: "Party Side", checked: false },
      { label: "User Type", checked: false }
    ];
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }

  viewMember(list) {
    this.router.navigate(["question-mlaView", list.id],
      {
        relativeTo: this.route.parent, state: {
          data: this.filterSelected
        }
      });
  }
  sessionSort;
  onSearchUser() {
    if (this.searchParam)
      this.listOfMla = this.listOfAllMla.filter(
        element =>
          element.memberGroup
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.firstName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.lastName
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          (element.constituencyName &&
            element.constituencyName
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.mobileNumber &&
            element.mobileNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    else this.listOfMla = this.listOfAllMla;
  }

  searchCol(filter: any) {
    debugger;
    if (!filter) {
      this.listOfMla = this.listOfAllMla;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    else
      this.listOfMla = this.listOfAllMla.filter((item: any) =>
        this.applyFilter(item, filter)
      );
  }
  applyFilter(element: any, filter: any) {
    for (const field in filter) {
      if (filter[field]) {
        if (field === "roleDisplay") {
          if (
            !element.roleDisplay.some(
              role => role.toLowerCase() == filter[field].toLowerCase()
            )
          ) {
            return false;
          }
        } else if (field === "constituencyName") {
          if (typeof filter[field] === "string") {
            if (
              !element[field] ||
              element[field].toLowerCase() !== filter[field].toLowerCase()
            ) {
              return false;
            }
          } else if (typeof filter[field] === "number") {
            if (!element[field] || element[field] !== filter[field]) {
              return false;
            }
          }
        }
        else if (field === "memberGroup") {
          if (typeof filter[field] === "string") {
            if (
              !element[field] ||
              element[field].toLowerCase() !== filter[field].toLowerCase()
            ) {
              return false;
            }
          } else if (typeof filter[field] === "number") {
            if (!element[field] || element[field] !== filter[field]) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  printableScreen() {
    this.printable = true;
  }

  captureScreen() {
    let doc = new jsPdf("p", "pt");

    doc.autoTable({ html: "#mladata" });
    // doc.save('MLA Details.pdf');
    var blob = doc.output("blob");

    var w = window.open(URL.createObjectURL(blob));
  }

  cancelPrint() {
    this.printable = false;
  }
  setFilteronBack() {
    if (this.routeData) {
      this.filterSelected = this.routeData;
      this.searchCol(this.filterSelected);
      if (this.filterSelected.roleDisplay) {
        this.partysidedisable = true;
        this.filterCheckboxes.forEach(element => {
          if (element.label == "User Type") {
            element.checked = true;
          }
        });
      }
      if (this.filterSelected.memberGroup) {
        this.rulingdisable = true;
        this.filterCheckboxes.forEach(element => {
          if (element.label == "Party Side") {
            element.checked = true;
          }
        });
      }
      if (this.filterSelected.constituencyName) {
        this.constituencydisable = true;
        this.filterCheckboxes.forEach(element => {
          if (element.label == "Constituency") {
            element.checked = true;
          }
        });
      }
      this._loadSelectedfilterData();
    }
  }
  findSessionListByAssembly(selAssembly) {
    this.resetdataOnchnage();
    if (this.assemblySession) {
      if (this.assemblySession['sessionByAssembly'].
      find(
        (element) => element.id === selAssembly)) {
        let session = this.assemblySession['sessionByAssembly'].find(
          (element) => element.id === selAssembly).session;
          this.sessionList = session;
          this.selectSessionValue = session.slice(-1).pop().id
      }
    }
    if(this.selectSessionValue) {
      this.getlistOfMla();
    }
  }
  resetdataOnchnage() {
    this.sessionList = [];;
    this.selectSessionValue = null;
  }
}
