import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'committee-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.css']
})
export class AddStaffComponent implements OnInit {
  @Input() allAssistant;
  @Input() allOfficer;
  @Input() allOfficeAttendent;
  @Input() allReporter;
  @Input() tabType;
  @Input() alreadyAddedMemberCount;
  @Input() allInvitee;
  checked = true;
  @Output() hideAddMember = new EventEmitter<any>();
  @Output() ListOfSelected = new EventEmitter<any>();

  noOfChecked: any = [];
  officerTab = false;
  assistantTab = false;
  officeAttendentTab = false;
  reporterTab = false;
  inviteeTab = false;
  selectedMembers=[];
  selectedValue = 'Anil';
  ButtonTitle =""
  disableAddButton = true;
  constructor() {}

  ngOnInit() {
    console.log(this.allOfficer);
    if(this.tabType == 'assistant'){
      this.ButtonTitle = "Add Assistant"
      this.assistantTab = true;
      this.allAssistant.forEach(element => {
        element.checked = false;
        element.disable = false;
      });
    }
    else if(this.tabType == 'officer'){
      this.ButtonTitle = "Add Officer"
      this.officerTab = true;
      this.allOfficer.forEach(element => {
        element.checked = false;
        element.disable = false;
      }); 
    }
    else if(this.tabType == 'officeAttendant'){
      this.officeAttendentTab = true;
      this.ButtonTitle = "Add Office Attendant"
      this.allOfficeAttendent.forEach(element => {
        element.checked = false;
        element.disable = false;
      });
    }else if(this.tabType == 'reporter'){
      this.reporterTab = true;
      this.ButtonTitle = "Add Reporter"
      this.allReporter.forEach(element => {
        element.checked = false;
        element.disable = false;
      });
    }
    else if(this.tabType == 'invitee'){
      this.inviteeTab = true;
      this.ButtonTitle = "Add Special Invitee"
      this.allInvitee.forEach(element => {
        element.checked = false;
        element.disable = false;
      });
    }
  }
  handleCancel(): void {
    this.hideAddMember.emit(false);
    this.selectedMembers = [];
  }
  addMember(){
    if(this.assistantTab){
      this.selectedMembers = this.allAssistant.filter(element=> element.checked == true);
    }
    else if(this.officerTab){
      this.selectedMembers = this.allOfficer.filter(element=> element.checked == true);
    }
    else if(this.officeAttendentTab){
      this.selectedMembers = this.allOfficeAttendent.filter(element=> element.checked == true);
    }
    else if(this.reporterTab){
      this.selectedMembers = this.allReporter.filter(element=> element.checked == true);
    }
    else if(this.inviteeTab){
      this.selectedMembers = this.allInvitee.filter(element=> element.checked == true);
    }
    console.log("selected",this.selectedMembers)
    this.ListOfSelected.emit(this.selectedMembers);
    this.hideAddMember.emit(false);
  }
  checkMemeber(box){
    box.checked = !box.checked;
  }
  disableMinister(){
    let count = 0;
    for (const box of this.allOfficer) {
      if (box.checked) {
        count++;
      }
    }
    if (count === 1) {
      for (const box of this.allOfficer) {
        if (!box.checked) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.allOfficer) {
        box.disable = false;
      }
    }
  }
  disableMemeber(){
    let count = 0;
    for (const box of this.allAssistant) {
      if (box.checked) {
        count++;
      }
    }
    if (count + this.alreadyAddedMemberCount == 11) {
      for (const box of this.allAssistant) {
        if (!box.checked) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.allAssistant) {
        box.disable = false;
      }
    }
  }
  getCheckedCount(list){
    const checkArray: any = [];
    for (const check of list) {
      checkArray.push(check.checked);
    }
    if (checkArray.includes(true)) {
      this.disableAddButton = false; 
    }else{
      this.disableAddButton = true;
    }
  }
}
