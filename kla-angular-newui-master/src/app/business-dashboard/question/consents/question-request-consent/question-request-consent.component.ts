import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionService } from "../../shared/question.service";
import { mlaDetails } from "../../shared/model/question";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { differenceInCalendarDays } from "date-fns";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";
import { QuestionMenus } from "../../question.menus";
import { QuestionRBSService } from "../../shared/question-rbs.service";
@Component({
  selector: "app-question-request-consent",
  templateUrl: "./question-request-consent.component.html",
  styleUrls: ["./question-request-consent.component.scss"],
})
export class QuestionRequestConsentComponent implements OnInit {
  currentUser: UserData;
  constructor(
    private router: Router,
    private questionSerivce: QuestionService,
    private notify: NotificationCustomService,
    private authService: AuthService,
    private questionMenus: QuestionMenus,
    private route: ActivatedRoute,
    public rbsService: QuestionRBSService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }
  radioValue = "yes";
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData = [];
  listOfAllData: any = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  MLADetails: mlaDetails[] = [];
  parties: object = [];
  selectedPartyId;
  allChecked = [];
  today = new Date();
  clubbedFrom = "";
  clubbedTo = "";
  isVisible = false;
  isValid = false;
  searchParam = "";
  loading = false;
  dashBoardUrl;
  changeIndex = 1;
  isPpo = false;
  ppoId;
  toWhom;
  partyDetails = [];
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.toWhom = params.status;
    });
    if (this.currentUser.authorities.includes("parliamentaryPartySecretary")) {
      this.isPpo = true;
      this.ppoId = this.currentUser.userId;
    }
    this.redirecttoList();
    // this.getListOfParties();
    // this.getMembersDetailsWithConcents(
    //   this.clubbedFrom,
    //   this.currentUser.userId,
    //   this.clubbedTo
    // );
    this.dashBoardUrl = this.questionMenus.getDashBoardUrl();
  }
  redirecttoList() {
    if (this.isPpo) {
      if (this.toWhom == "ppotomember") {
        this.getListOfParties();
        this.getMembersDetailsWithConcents(
          this.clubbedFrom,
          this.currentUser.userId,
          this.clubbedTo
        );
      }
      else if (this.toWhom == "ppotoppo") {
        this.getppotoppoList();
      }
    }
    else {
      this.getListOfParties();
      this.getMembersDetailsWithConcents(
        this.clubbedFrom,
        this.currentUser.userId,
        this.clubbedTo
      );
    }

  }
  getppotoppoList() {
    this.questionSerivce.getPartyByuserId(this.ppoId).subscribe((res: any) => {
      if (res) {
        this.partyDetails = res;
        this.partyDetails.forEach(element => {
          if (element.kerelaPoliticalPartyId) {
            element.id = element.kerelaPoliticalPartyId;
          }
        });

        this.listOfAllData = this.partyDetails;
        this.partyDetails.forEach((value, index) => {
          this.partyDetails[index].slNo = index + 1;
        });
      }
      this.loading = false;
    });
  }

  getListOfParties() {
    if (this.isPpo) {
      this.selectedPartyId = 0;
      this.questionSerivce.getPartyByuserId(this.ppoId).subscribe((res) => {
        this.parties = res;
      });
    } else {
      this.selectedPartyId = 0;
      this.questionSerivce.getPartyByuserId(this.currentUser.userId).subscribe((res) => {
        this.parties = res;
      });
    }
  }
  //fuunction to fill memberDetails table
  getMembersDetailsWithConcents(clubbedFrom, memberId, clubbedTo) {
    this.loading = true;
    this.questionSerivce
      .getMemberDetailswithConsents(clubbedFrom, memberId, clubbedTo)
      .subscribe((res: any) => {
        if (res) {
          this.MLADetails = res;
          this.MLADetails = this.MLADetails.filter((x) => x.id != memberId);
          this.listOfAllData = this.MLADetails;
          this.MLADetails.forEach((value, index) => {
            this.MLADetails[index].slNo = index + 1;
          });
        }
        this.loading = false;
      });
  }
  requestConsent() {
    this.isValid = this._validateInput();
    if (this.isValid) {
      if (this.allChecked.length >= 1) {
        this.buildRequestData(this.allChecked)
        this.questionSerivce
          .requestConsent(this.buildRequestData(this.allChecked))
          .subscribe((element) => {
            this.notify.showSuccess("Success", "");
            this.onBack();
          });
      }
    }
  }
  buildRequestData(data) {
    let newArr = [];
    if (this.toWhom == "membertomember" || this.toWhom == "ppotomember") {
      data.forEach((values) => {
        let newObj = {
          memberIdFrom: this.currentUser.userId,
          memberIdTo: values.id,
          onlineConsentRequired: this.radioValue == "yes" ? true : false,
        };
        if (this.clubbedFrom && this.clubbedTo) {
          newObj["fromDate"] = this._getDateFormat(this.clubbedFrom);
          newObj["toDate"] = this._getDateFormat(this.clubbedTo);
        }
        newArr.push(newObj);
      });
      return newArr;
    }
    else if (this.toWhom == "ppotoppo") {
      data.forEach((values) => {
        let newObj = {
          memberIdFrom: this.currentUser.userId,
          memberIdTo: null,
          partyIdTo: values.id,
          onlineConsentRequired: this.radioValue == "yes" ? true : false,
        };
        if (this.clubbedFrom && this.clubbedTo) {
          newObj["fromDate"] = this._getDateFormat(this.clubbedFrom);
          newObj["toDate"] = this._getDateFormat(this.clubbedTo);
        }
        newArr.push(newObj);
      });
      return newArr;
    }

  }
  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }
  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(
      (item) => (this.mapOfCheckedId[item.id] = value)
    );
    this.refreshStatus();
  }
  refreshStatus(): void {
    this.allChecked = this.listOfAllData.filter(
      (value) => this.mapOfCheckedId[value.id]
    );
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.isIndeterminate =
      this.listOfDisplayData.some((item) => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
  }

  bindRadioValue(value) {
    this.radioValue = value;
    this.isVisible = false;
    if (this.radioValue == "no") {
      this.isVisible = true;
    }
  }
  disabledDateClubbedFrom = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };
  disabledDateClubbedTo = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date(this.clubbedFrom)) < 0;
  };
  onBack() {
    this.router.navigate(["question-consent"],
    { relativeTo: this.route.parent });
  }
  _getDateFormat(dateToFormat) {
    let date = new Date(dateToFormat).toISOString().slice(0, 10);
    return date;
  }
  _validateInput() {
    if (this.allChecked.length == 0) {
      this.notify.showError("check at least one", "");
      return false;
    }
    if (this.radioValue == "no") {
      if (!this.clubbedFrom || !this.clubbedTo) {
        this.notify.showError("select clubbing dates", "");
        return false;
      }
      if (
        !(
          this._getDateFormat(this.clubbedFrom) <=
          this._getDateFormat(this.clubbedTo)
        )
      ) {
        this.notify.showError("please select valid dates", "");
        return false;
      }
    }
    return true;
  }
  searchPipe() {
    this.changeIndex = 1;
    if (this.selectedPartyId == 0 && !this.searchParam && this.toWhom !== 'ppotoppo') {
      this.MLADetails = this.listOfAllData;
    }
    else {
      if (this.isPpo && this.toWhom == 'ppotoppo') {
        if (this.searchParam) {
          this.partyDetails = this.listOfAllData.filter(
            element =>
              element.kerelaPoliticalPartyName
                .toLowerCase()
                .includes(this.searchParam.toLowerCase())
          );
        }
        else { this.partyDetails = this.listOfAllData; }
      }
      else {
        this.MLADetails = this.listOfAllData.filter((element) =>
          this.filterItem(element, this.selectedPartyId, this.searchParam)
        );
      }
    }
    if (this.isPpo && this.toWhom == 'ppotoppo') {
      this.partyDetails.forEach((value, index) => {
        this.partyDetails[index].slNo = index + 1;
      });
    } else {
      this.MLADetails.forEach((value, index) => {
        this.MLADetails[index].slNo = index + 1;
      });
    }
  }
  filterItem(item: any, selectedPartyId, name) {
    if (
      selectedPartyId > 0 &&
      !name &&
      item.keralaPolicticalPartyid == selectedPartyId
    ) {
      return true;
    } else if (
      name &&
      selectedPartyId == 0 &&
      item.fullName.toLowerCase().includes(name.toLowerCase())
    ) {
      return true;
    } else if (
      item.keralaPolicticalPartyid == selectedPartyId &&
      item.fullName.toLowerCase().includes(name.toLowerCase())
    ) {
      return true;
    }
    return false;
  }
  getMembersWithDates() {
    if (!this.clubbedFrom && !this.clubbedTo) {
      this.notify.showWarning("select clubbing dates", "");
      return false;
    }
    if (this.clubbedFrom && this.clubbedTo) {
      this.clubbedFrom = this._getDateFormat(this.clubbedFrom);
      this.clubbedTo = this._getDateFormat(this.clubbedTo);
      if (this.clubbedFrom > this.clubbedTo) {
        this.notify.showError(
          "Sorry",
          "Clubbed from cannot be greater than Clubbed to"
        );
        this.listOfAllData = this.listOfDisplayData = this.MLADetails = null;
        return;
      }
      if (this.isPpo && this.toWhom == 'ppotoppo') {
        this.getppotoppoList();
      }
      else {
        this.getMembersDetailsWithConcents(
          this.clubbedFrom,
          this.currentUser.userId,
          this.clubbedTo
        );
      }
    }
  }
}
