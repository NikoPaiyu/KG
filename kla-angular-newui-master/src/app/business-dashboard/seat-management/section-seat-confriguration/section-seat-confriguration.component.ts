import { Component, OnInit } from '@angular/core';
import { SeatService } from '../shared/services/seat.service';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import {
  NzNotificationService,
} from "ng-zorro-antd";

@Component({
  selector: 'app-section-seat-confriguration',
  templateUrl: './section-seat-confriguration.component.html',
  styleUrls: ['./section-seat-confriguration.component.scss']
})
export class SectionSeatConfrigurationComponent implements OnInit {
  sectionSeatForm: FormGroup;
  assignSeatId;
  seatNumber: any;
  assistantLists: any;
  assignAssistant;
  isAssignVisible: boolean;
  sectionId;
  seatnumber;
  seatassignlist;
  businesslist: any = [];
  isVisible = false;
  isVisible1 = false;
  klasessionList;
  allBusiness;
  assistantList;
  businessList: any;
  seatDescription: any;
  listOfData: any = [];
  constructor( private seatService: SeatService,
    private fb: FormBuilder,
    private notification: NzNotificationService) { }
  showModal(): void {
    this.getbusinesslist(); 
    this.isVisible = true;
  }
  showModal1(seatId): void {
    this.getAssistantList();
    this.assignSeatId = seatId;
    this.isVisible1 = true;
  }
  handleOk(): void {
    this.isVisible = false;
    this.isVisible1 = false;
    this.seatNumber = null;
    this.businessList = null;
    this.seatDescription = null;
    this.assistantLists =null;
  }

  handleCancel(): void {
    this.isVisible1 = false;
    this.isVisible = false;
    this.seatNumber = null;
    this.businessList = null;
    this.seatDescription = null;
    this.assistantLists = null;
  }
  formValidation(): void {
    this.sectionSeatForm = this.fb.group ({
      sectionId : [null],
      businesslist :  [null],
      seatnumber : [null],
      description : [null],
      assistentlist : [null]
    });
  }
  ngOnInit() {
    this.formValidation();
    this.getKlaSessionList(); 
  }
  getKlaSessionList() {
    this.seatService.getKlaSections().subscribe((res) => {
      this.klasessionList = res;
    });
  }
  listofSeat() {
    const body = {
      sectionId: this.sectionSeatForm.value.sectionId,
    }
    this.seatService.getassignseat(body).subscribe((res) => {
      this.listOfData = res;
      console.log(res);
    });
    this.handleOk();
  }

  getbusinesslist() {
    this.seatService.getallbusiness().subscribe((res) => {
      this.allBusiness = res;
    });
  }
  saveSectionSeat() {
    if (this.listOfData.find(x => x.seatNumber === this.sectionSeatForm.value.seatnumber.toString())) {
      this.notification.create(
        "warning",
        "Warning",
        "Seat Number Already Exist. Please Choose Another Number!"
      );
    } else {
      const body = {
        businessDtos: [
          {
            businessId:  this.sectionSeatForm.value.businesslist,
            deleted: false,
          }
        ],
        seatId: null,
        sectionId: this.sectionSeatForm.value.sectionId,
        number: this.sectionSeatForm.value.seatnumber.toString(),
        description: this.sectionSeatForm.value.description
      }
      this.seatService.saveSeat(body).subscribe((res) => {
        const temp: any = res;
        this.notification.create(
          "success",
          "Success",
          "Seat Added Successfully!"
        );
        this.listofSeat();
      });
      
      this.handleOk();
    }
  }
  removeSeat(seatId) {
    const body = {
      seatId: seatId,
    }
    this.seatService.deleteseat(body).subscribe((res) => {
      const temp: any = res;
      this.notification.create(
        "success",
        "Success",
        "Seat Removed Successfully!"
      );
      this.listofSeat();
    });
    this.handleOk();
  }

  assignSectionSeat(){
    const body = {
      seatId: this.assignSeatId,
      userId: this.sectionSeatForm.value.assistentlist
      }
    this.seatService.assignSeat(body).subscribe((res) => {
      const temp: any = res;
      this.notification.create(
        "success",
        "Success",
        "Assigned to Seat Successfully!"
      );
      this.listofSeat();
    });
  }
  showAssignModal() {
    this.isAssignVisible = true;
  }
  getAssistantList() {
    const body = {
        klaDesignatoinId : 10,
        klaSectionId : this.sectionSeatForm.value.sectionId
      }
    this.seatService.getnonmemberslist(body).subscribe((Res: any) => {
    this.assignAssistant= Res;
    console.log(Res);
    });
  }
  unAssignSectionSeat(userId){
    this.seatService.unAssignseat(userId).subscribe((res) =>{
      const temp: any = res;
      this.notification.create(
        "success",
        "Success",
        "UnAssigned Seat Successfully!"
      );
      this.listofSeat();
    });
  }
}
