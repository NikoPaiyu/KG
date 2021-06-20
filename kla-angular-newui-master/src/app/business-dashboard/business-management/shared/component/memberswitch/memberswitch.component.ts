import { Component, OnInit, Input } from "@angular/core";
import { SeatService } from "src/app/business-dashboard/seat-management/shared/services/seat.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import {
  countUpTimerConfigModel,
  timerTexts,
  CountupTimerService
} from "ngx-timer";
import { BusinessControllerService } from "src/app/business-dashboard/lob/shared/services/business-controller.service";
import { NzModalService } from "ng-zorro-antd";
@Component({
  selector: "app-memberswitch",
  templateUrl: "./memberswitch.component.html",
  styleUrls: ["./memberswitch.component.scss"]
})
export class MemberswitchComponent implements OnInit {
  @Input() currentActiveBusinessLine;
  public memberDetailsForDropdown = [];
  public memberDetailsForSeat = [];
  public memberDetailsForHover;
  isStopButtonClickes = false;
  selectedBusinessName;
  selectedMemberDetails;
  searchText = "";
  businessDefaultList = [
    {
      businessId: -1,
      businessName: "Point of Order",
      businessNameMalayalam: "ക്രമപ്രശ്നം"
    },
    {
      businessId: -2,
      businessName: "Personal Explanation",
      businessNameMalayalam: "വ്യക്തിപരമായ വിശദീകരണം"
    },
    {
      businessId: -3,
      businessName: "intervention",
      businessNameMalayalam: "ഇടപെടലുകൾ"
    }
  ];
  switchTmerConfig;
  validationShow = false;
  currentlyOnMic;
  constructor(
    private seatMappingService: SeatService,
    private notify: NotificationCustomService,
    private controllerservice: BusinessControllerService,
    private switchcountupTimerService: CountupTimerService,
    private modalService: NzModalService
  ) { }
  ngOnInit() {
    this.ngxTimerConfig();
    this.getAllSeatedMembers();
    this.setBusinessDefaultListValue();
    this.setCurrentlyOnMic();
  }
  getAllSeatedMembers() {
    this.seatMappingService.getMappingList().subscribe((res: any) => {
      if (res) {
        //set value to seat
        this.memberDetailsForSeat = res;
        //iterate array for memberdetailsarray
        this.setValueToMemberDropDown(res);
        //set color to current business seat
        this.setDefaultColorForCurrentBusiness(res);
      } else {
        this.notify.showError(
          "Error",
          "Something went wrong please try again...."
        );
      }
    });
  }
  //set value to dropdown
  setValueToMemberDropDown(data) {
    this.memberDetailsForDropdown = [];
    data.forEach((obj, index) => {
      this.memberDetailsForDropdown.push(
        this.memberDetailsForSeat[index].member
      );
    });
  }
  //for search member
  searchMembers(searchText) {
    if (searchText) {
      this.setValueToMemberDropDown(this.memberDetailsForSeat);
      this.memberDetailsForDropdown = this.memberDetailsForDropdown.filter(
        element =>
          element.details.fullName
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    } else {
    }
  }
  //function call by hover over the seat
  selectSeatByHover(event) {
    if (event.target.id) {
      this.memberDetailsForHover = [];
      this.memberDetailsForHover = this.memberDetailsForSeat.find(
        element => element.seat.seatNumber == event.target.id
      );
      let polygenControl = document.getElementById(event.target.id);
      polygenControl.classList.add("st11");
    }
  }
  //reset color while seat over out
  resetColor(event) {
    if (event.target.id) {
      let polygenControl = document.getElementById(event.target.id);
      polygenControl.classList.remove("st11");
    }
  }
  //set business dropdown
  setBusinessDefaultListValue() {
    this.businessDefaultList = this.businessDefaultList.filter(
      obj => obj.businessId < 0
    );
    this.businessDefaultList.push({
      businessId: this.currentActiveBusinessLine.businessId,
      businessName: this.currentActiveBusinessLine.businessName,
      businessNameMalayalam: this.currentActiveBusinessLine
        .businessNameMalayalam
    });
    this.selectedBusinessName = this.businessDefaultList[3]
  }
  //function to click seat
  clickSeat(event) {
    if (event.target.id) {
      this.removeSwitchMemberColor();
      let polygenControl = document.getElementById(event.target.id);
      if (this.memberDetailsForHover) {
        polygenControl.classList.add("seat_active");
        this.searchMembers(this.memberDetailsForHover.member.details.fullName);
        this.searchText = this.memberDetailsForHover.member.details.fullName;
        this.selectedMemberDetails = this.memberDetailsForHover.member;
      } else {
        this.removeSwitchMemberColor();
        this.searchText = "";
        this.setValueToMemberDropDown(this.memberDetailsForSeat);
      }
    }
  }
  //function to set color for who on current business
  setDefaultColorForCurrentBusiness(data) {
    let memberSeatNumber;
    //check whether the user is primary
    if (this.currentActiveBusinessLine.questionbtn) {
      memberSeatNumber = data.find(
        element =>
          element.member.userId ==
          this.currentActiveBusinessLine.primaryMemberId
      );
    }
    //check whether the user is secondary
    else {
      memberSeatNumber = this.memberDetailsForSeat.find(
        element =>
          element.member.userId ==
          this.currentActiveBusinessLine.secondaryMemberId
      );
    }
    let polygenControl = document.getElementById(
      memberSeatNumber.seat.seatNumber
    );
    polygenControl.classList.add("st12");
  }
  onSwitch() {
    if (this.selectedBusinessName && this.selectedMemberDetails) {
      this.switchToMember();
    } else {
      this.validationShow = true;
      this.selectedBusinessName = this.selectedBusinessName
        ? this.selectedBusinessName
        : "";
      this.selectedMemberDetails = this.selectedMemberDetails
        ? this.selectedMemberDetails
        : "";
    }
  }
  switchToMember() {
    let currentBusinessDetails = {};
    if (
      this.selectedBusinessName.businessName == "Point of Order" ||
      this.selectedBusinessName.businessName == "Personal Explanation"
    ) {
      currentBusinessDetails = {
        businessName: this.selectedBusinessName.businessName,
        businessNameMalayalam: this.selectedBusinessName.businessNameMalayalam,
        businessCode: this.selectedBusinessName.businessName
      };
    } else {
      currentBusinessDetails = {
        businessName: this.currentActiveBusinessLine.businessName,
        businessNameMalayalam: this.currentActiveBusinessLine
          .businessNameMalayalam,
        businessCode: this.selectedBusinessName.businessName
      };
    }

    this.setItemToLocalstorage("switch");
    this.setCurrentlyOnMic();
    this.controllerservice
      .switchMember(currentBusinessDetails, this.selectedMemberDetails)
      .subscribe(res => {
        localStorage.setItem('isSwitched', 'true');
        this.notify.showSuccess("Success", "Display Switched.");
      });
  }
  stopSwitch() {
    this.removeSwitchMemberColor();
    this.setItemToLocalstorage("stop");
    this.setCurrentlyOnMic();
    this.controllerservice.unSwitchMember().subscribe(res => {
      localStorage.setItem('isSwitched', 'false');
      this.notify.showSuccess("Success", "Display Un Switched.");
    });
  }
  returnToOwner() {
    // this.stopSwitch();
    this.modalService.closeAll();
  }
  dropdownOnchange(data) {
    this.selectedMemberDetails = data;
    this.searchText = data.details.fullName;
    this.setSwitchmemberColor(data.userId);
  }
  setCurrentlyOnMic() {
    this.currentlyOnMic = {};
    this.currentlyOnMic = {
      memberName: localStorage.getItem("memberName"),
      businessName: localStorage.getItem("businessName")
    };
  }
  setSwitchmemberColor(userid) {
    this.removeSwitchMemberColor();
    let seatNumber = this.memberDetailsForSeat.find(
      element => element.member.userId == userid
    );
    let polygenControl = document.getElementById(seatNumber.seat.seatNumber);
    polygenControl.classList.add("seat_active");
  }
  removeSwitchMemberColor() {
    let i = 0;
    let allPolygenControl;
    for (i = 0; i < 186; i++) {
      allPolygenControl = document.getElementsByTagName("polygon")[i];
      allPolygenControl.classList.remove("st11");
      allPolygenControl.classList.remove("seat_active");
    }
  }
  ngxTimerConfig() {
    this.switchTmerConfig = new countUpTimerConfigModel();
    this.switchTmerConfig.timerTexts = new timerTexts();
    this.switchTmerConfig.timerTexts.hourText = ":";
    this.switchTmerConfig.timerTexts.minuteText = ":";
    this.switchTmerConfig.timerTexts.secondsText = " ";
  }
  setItemToLocalstorage(type) {
    localStorage.removeItem("businessName");
    localStorage.removeItem("memberName");
    //if  stop then reset business to old
    if (type == "stop") {
      localStorage.setItem(
        "businessName",
        this.currentActiveBusinessLine.businessNameMalayalam
      );
      localStorage.setItem(
        "memberName",
        this.currentActiveBusinessLine.questionbtn
          ? this.currentActiveBusinessLine.primaryMemberMalayalamFullName
          : this.currentActiveBusinessLine.secondaryMemberMalayalamFullName
      );
      //else reset to current switch business
    } else {
      localStorage.setItem(
        "businessName",
        this.selectedBusinessName.businessNameMalayalam
      );
      localStorage.setItem(
        "memberName",
        this.selectedMemberDetails.details.malayalamFullName
      );
    }
  }
  clearTextBoxValue() {
    this.setValueToMemberDropDown(this.memberDetailsForSeat);
    this.searchText = "";
  }
  getSwitchStatus() {
    if (localStorage.getItem('isSwitched') == 'true') {
      return true
    }
    else {
      return false;
    }
  }
}
