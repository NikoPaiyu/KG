import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "committee-add-member",
  templateUrl: "./add-member.component.html",
  styleUrls: ["./add-member.component.scss"],
})
export class AddMemberComponent implements OnInit {
  @Input() allMembers;
  @Input() allMinisters;
  @Input() tabType;
  @Input() alreadyAddedMemberCount;
  checked = true;
  @Output() hideAddMember = new EventEmitter<any>();
  @Output() ListOfSelected = new EventEmitter<any>();

  noOfChecked: any = [];
  ministerTab = false;
  memberTab = false;
  exOfficeTab = false;
  selectedMembers=[];
  selectedValue = 'Anil';
  addButtonLabel ="";
  constructor() {}

  ngOnInit() {
    if(this.tabType == 'member'){
      this.memberTab = true;
      this.addButtonLabel = "Add Member"
    }
    else if(this.tabType == 'chairman'){
      this.ministerTab = true;
      this.addButtonLabel = "Add Chairman"
    }
    else if(this.tabType == 'exOffice'){
      this.exOfficeTab = true;
      this.addButtonLabel = "Add ExOfficio"
    }

    this.allMembers.forEach(element => {
      element.checked = false;
      element.disable = false;
    });
    this.allMinisters.forEach(element => {
      element.checked = false;
      element.disable = false;
    });
    console.log(this.memberTab,this.ministerTab,this.exOfficeTab)
    console.log(this.allMinisters);
  }
  handleCancel(): void {
    this.hideAddMember.emit(false);
    this.selectedMembers = [];
  }
  addMember(){
    if(this.memberTab){
      this.selectedMembers = this.allMembers.filter(element=> element.checked == true);
    }
    else if(this.ministerTab){
      this.selectedMembers = this.allMinisters.filter(element=> element.checked == true);
    }
    if(this.exOfficeTab){
      this.selectedMembers = this.allMinisters.filter(element=> element.checked == true);
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
    for (const box of this.allMinisters) {
      if (box.checked) {
        count++;
      }
    }
    if (count === 1) {
      for (const box of this.allMinisters) {
        if (!box.checked) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.allMinisters) {
        box.disable = false;
      }
    }
  }
  disableMemeber(){
    let count = 0;
    for (const box of this.allMembers) {
      if (box.checked) {
        count++;
      }
    }
    if (count + this.alreadyAddedMemberCount == 10) {
      for (const box of this.allMembers) {
        if (!box.checked) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.allMembers) {
        box.disable = false;
      }
    }
  }
  disableExOffico(){
    let count = 0;
    for (const box of this.allMinisters) {
      if (box.checked) {
        count++;
      }
    }
    if (count +  this.alreadyAddedMemberCount == 10) {
      for (const box of this.allMinisters) {
        if (!box.checked) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.allMinisters) {
        box.disable = false;
      }
    }
  }
  }
