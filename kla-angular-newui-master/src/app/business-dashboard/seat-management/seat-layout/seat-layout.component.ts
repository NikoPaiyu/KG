import { Component, OnInit } from "@angular/core";
import { SeatService } from "../shared/services/seat.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
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
    private notify: NotificationCustomService
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
      this.notify.showWarning("Info", "Please Select Seat..");
    } else {
      if (memberID > 0) {
        this.seatService
          .updateSeatMapping(seatNumber, memberID)
          .subscribe(res => {
            this.getAllSeats();
            this.getAllMembers();
            this.clearSelectedSeats();
            this.selectedSeatNumber = "";
            this.notify.showSuccess("Success", "Successfully Inserted..");
          });
      } else {
        this.notify.showWarning("Info", "Please Select Member..");
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

  removeSeat(SeatID,memberG) {
    this.seatService.removeSeat(SeatID).subscribe((res: any) => {
      this.seatMappingList = res;
      this.savetexthideshow = true;
      this.getAllMembers();
    });
    // this.seatMappingList.filter(element => element.seat.seatNumber != SeatID);
    let polygenControl = document.getElementById(SeatID);
    if(memberG){
      switch(memberG){
        case 'RULING_PARTY':
          polygenControl.classList.remove("st11");
          break;
          case 'OPOSITION_PARTY':
            polygenControl.classList.remove("st12");
            break;
            case 'TREASURY_BENCH':
              polygenControl.classList.remove("st13");
              break;
                default:
                polygenControl.classList.remove("st0");
                break;
      }
    }
    //polygenControl.classList.remove("st12");
    this.dropdownHideShow = true;
    this.clearSelectedSeats();
  }
  mapMambers(users) {
    this.selectedSeat = {
      member: {
        userId: users.userId,
        userName: "",
        details: {
          firstName: users.details.firstName,
          lastName: "",
          fullName: users.details.fullName,
          malayalamFullName: users.details.malayalamFullName,
          profilePhoto: users.details.profilePhoto,
          keralaConstiturencyName: users.details.keralaConstiturencyName,
          keralaPolicticalPartyName: users.details.keralaPolicticalPartyName,
          memberGroup: users.details.memberGroup
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
          fullName: "",
          malayalamFullName: "",
          lastName: "",
          profilePhoto: "",
          keralaPolicticalPartyName: "",
          keralaConstiturencyName: "",
          memberGroup:""
        }
      }
    };
  }
}
