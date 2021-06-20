import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-speaker-list',
  templateUrl: './speaker-list.component.html',
  styleUrls: ['./speaker-list.component.css']
})
export class SpeakerListComponent implements OnInit {
  today: any = new Date();
  tempSpeakerList: any = [];
  sessionList: any = [];
  isAssignVisible = false
  search = null;
  viewLinks = false;
  speakerList: any = [];
  note = {
    session: "",
    type: "",
    date: "",
    resolution: ""
  };
  colCheckboxes = [
    { id: 0, label: 'bill', check: true, disable: false },
    { id: 1, label: 'date', check: true, disable: false },
    { id: 2, label: 'priority', check: true, disable: false },
    { id: 3, label: 'session', check: true, disable: false },
    { id: 4, label: 'status', check: true, disable: false }

  ];
  showHideCreateBillMetaform = false;
  showHideCreateNotice = false;
  listOfData: any =[
    {
      session : 4,
      date : "16-6-21",
      type : "bill",
      fileNo : 1,
      status :  "No"
    },
    {
      session :  6,
      date :  "16-6-21",
      type :  "bill",
      fileNo : 1,
      status : "No"
    }
  ]
  billPresentationDates: any = [];
  constructor(
    private pmbrCommonService: PmbrCommonService, 
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getSpeakerList();
    this.presentationDates();
    this.getSessions();
  }
  presentationDates(){
    const body = {
    ballotingDate: this.today,
      ballotingType: "BILL"
    }
    this.pmbrCommonService.presentationDates(body).subscribe((res: any) =>{
      this.billPresentationDates = res;
    })
  }
  searchList() {
    if (this.search) {
      this.speakerList = this.tempSpeakerList.filter(
        (element) =>
          (element.billMetaDataDto.title &&
            element.billMetaDataDto.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.createdDate &&
            element.billMetaDataDto.createdDate
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.priority &&
            element.billMetaDataDto.priority
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.session &&
            element.billMetaDataDto.session
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.billMetaDataDto.status &&
            element.billMetaDataDto.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.speakerList = this.tempSpeakerList;
    }
  }
  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 6) {
      for (const box of this.colCheckboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colCheckboxes) {
        box.disable = false;
      }
    }
  }
  showLinks() {
    // this.tempBillList.forEach(element => {
    //   if (element.billMetaDataDto.id === id) {
    //     element.viewLinks = true;
    //   } else {
    //     element.viewLinks = false;
    //   }
    // });
  }
  viewBill(){

  }
  viewNote(id){
    this.router.navigate(["business-dashboard/pmbr/speaker-note-view/",id]);
  }
  createNote(){
    this.isAssignVisible = true
  }
  createNotes(){
    const body = {
session: this.note.session,
date: this.note.date,
resolution: this.note.resolution,
type: this.note.type
    }
    console.log(body);
  }
  getSpeakerList(){
    this.pmbrCommonService.getSpeakerNoteList().subscribe(res => {
      this.speakerList = this.tempSpeakerList = res;
      console.log(this.speakerList);
    });
  }
  getSessions(){
    this.pmbrCommonService.getAllSession().subscribe(res => {
      this.sessionList = res;
      console.log(this.sessionList);
    });
  }
  createSpeakerNote(){
    const body = {
        assemblyId: 0,
        date: this.note.date,
        fileId: 0,
        fileNumber: "string",
        id: 0,
        sessionId: this.note.session,
        status: "string",
        type: this.note.type,
        resolution: this.note.resolution,
          }
          this.pmbrCommonService.speakerNote(body).subscribe(res => {
                console.log(body);
                this.notification.success('Success', 'Speaker Note Created Successfully.');
           });
           this.getSpeakerList();
this.isAssignVisible = false;
  }
  cancel(){
    this.isAssignVisible = false;
  }
}
