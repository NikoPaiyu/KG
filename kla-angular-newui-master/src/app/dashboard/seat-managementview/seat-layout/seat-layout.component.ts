import { Component, OnInit } from "@angular/core";
import { SeatService } from "../shared/services/seat.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: "app-seat-layout",
  templateUrl: "./seat-layout.component.html",
  styleUrls: ["./seat-layout.component.scss"]
})
export class SeatLayoutComponent implements OnInit {
  userId = 0;
  dropdownHideShow = false;
  savetexthideshow;
  public popoverTitle: string = "Remove Confirmation";
  public popoverMessage: string = "Are You Sure?";
  public selectedUser;
  public selectedSeatNumber = "";
  public memberDetails;
  public selectedSeat;
  public seatMappingList;

  constructor(
    private seatService: SeatService,
    private notify: NotificationCustomService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.getAllMembers();
    this.getAllSeats();
  }

  getAllMembers() {
    this.seatService.getAllUnSeatedMembers().subscribe(res => {
      this.memberDetails = res;
    });
  }

  getAllSeats() {
    this.seatService.getMappingList().subscribe(res => {
      this.seatMappingList = res;
      this.seatMappingList.forEach(mapping => {
        this.seatMappingList = res;
        this.seatMappingList.forEach(mapping => {
          let polygenControl = document.getElementById(mapping.seat.seatNumber);
          if(mapping.member){
          switch(mapping.member.details.memberGroup){
            case 'RULING_PARTY':
              polygenControl.classList.add("st11");
              break;
              case 'OPOSITION_PARTY':
                polygenControl.classList.add("st12");
                break;
                case 'TREASURY_BENCH':
                polygenControl.classList.add("st13");
                break;
                  default:
                  polygenControl.classList.add("st0");
                  break;
          }
        }
        });
      });
    });
  }

  selectSeat(event) {
    let filterObject = this.seatMappingList.find(
      element => element.seat.seatNumber == event.target.attributes.id.nodeValue
    );
    this.selectedSeatNumber = event.target.attributes.id.nodeValue;
    if (filterObject) {
      this.dropdownHideShow = false;
      this.savetexthideshow = false;
      this.selectedSeat = filterObject;
    } else {
      this.dropdownHideShow = true;
      this.savetexthideshow = true;
      this.clearSelectedSeats();
    }
  }

  saveSeatmapping(seatNumber, memberID) {
    if (seatNumber == undefined || seatNumber == "") {
      this.notify.showWarning(this.translate.instant('dashboard.notification.info'),
      this.translate.instant('dashboard.seatlayout.selectseat'));
    } else {
      if (memberID > 0) {
        this.seatService
          .updateSeatMapping(seatNumber, memberID)
          .subscribe(res => {
            this.getAllSeats();
            this.getAllMembers();
            this.clearSelectedSeats();
            this.selectedSeatNumber = "";
            this.notify.showSuccess(this.translate.instant('dashboard.notification.success'),
            this.translate.instant('dashboard.seatlayout.sucessinsertion'));
          });
      } else {
        this.notify.showWarning(this.translate.instant('dashboard.notification.info'),
        this.translate.instant('dashboard.seatlayout.selectmember'));
      }
    }
  }

  dropdownOnChange(selectedUserId) {
    let users = this.memberDetails.find(
      filter => filter.userId == selectedUserId
    );
    this.dropdownHideShow = true;
    this.savetexthideshow = true;
    if (selectedUserId > 0) {
      this.mapMambers(users);
    } else {
      this.clearSelectedSeats();
    }
  }

  
  mapMambers(users) {
    this.selectedSeat = {
      member: {
        userId: users.userId,
        userName: "",
        details: {
          firstName: users.details.firstName,
          malayalamFullName: users.details.malayalamFullName,
          lastName: "",
          profilePhoto: users.details.profilePhoto,
          keralaConstiturencyName: users.details.keralaConstiturencyName,
          keralaPolicticalPartyName: users.details.keralaPolicticalPartyName,
          memberGroup:users.details.memberGroup
        }
      }
    };
  }
  clearSelectedSeats() {
    this.userId = 0;
    this.selectedSeat = {
      member: {
        userId: 0,
        userName: "",
        details: {
          firstName: "",
          lastName: "",
          profilePhoto: "",
          keralaPolicticalPartyName: "",
          keralaConstiturencyName: ""
        }
      }
    };
  }
}
