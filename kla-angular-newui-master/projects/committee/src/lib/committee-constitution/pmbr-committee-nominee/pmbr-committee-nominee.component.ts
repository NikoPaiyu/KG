import { Component, Inject, Input,  OnInit } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { CommitteData, MEMBER } from '../../shared/model/nominee.model';
import { CommitteeService } from '../../shared/services/committee.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';
@Component({
  selector: 'committee-pmbr-committee-nominee',
  templateUrl: './pmbr-committee-nominee.component.html',
  styleUrls: ['./pmbr-committee-nominee.component.css']
})
export class PmbrCommitteeNomineeComponent implements OnInit {
  @Input() memberDetailDto;
  @Input() userDetails;
  @Input() isFileView = false;
  @Input() committeeId =null
    memberDtoResponse = {
      MEMBER: [],
      CHAIRMAN: [],
    };
    commiteeDetails: CommitteData;
    // committeeId;
    purpose;
    editMode = true;
    user;
    showAddmember = false;
    allMembers;
    listOfAllMembers;
    selectedMembers;
    roleList = [];
    tabType = null;
    fileDetails;
    rbsPermission={
      addChairman : false
    }
    editable = {
      name: false,
      chairman : false,
      members : false
    }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
    private fb: FormBuilder,
    private committeeService: CommitteeService,
    private committeeCommonService: CommitteecommonService,
    private fileService: FileServiceService
  ) { 
    this.user = AuthService.getCurrentUser();
    this.committeeCommonService.setCommitteePermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.loadPermissions();
    this.gelAllMembers();
    this.getAllRolesList();
    if(!this.isFileView){
      this.route.params.subscribe((params) => {
        this.committeeId = params.id;
        this.purpose = params.purpose;
      });
    }
    if(this.purpose == 'addnew'){
      this.editable.name = true;
      this.editable.members = true;
    }
    if(this.purpose == 'edit'){
      // this.editable.name = true;
      // this.editable.members = true;
      if(this.rbsPermission.addChairman){
        this.editable.chairman = true;
      }
    }
    this.getCommiteeById();
    
  }
  back() {
    window.history.back();
  }
  loadPermissions() {
    if (this.committeeCommonService.doIHaveAnAccess('ADD_SELECT_COMMITEE_CHAIRMAN', 'UPDATE')) {
      this.rbsPermission.addChairman = true;
    }
  }  
  getCommiteeById() {
    this.committeeService
      .getCommitteeById(this.committeeId)
      .subscribe((Res: any) => {
        this.commiteeDetails = Res;
        this.commiteeDetails.committeeDto[0].memberDtoResponse = this.setmemberDtoResponse(
          this.commiteeDetails.committeeDto[0].memberDtoResponse
        );
        this.commiteeDetails.committeeDto[0].memberDtos = this.setMemberDto();
        console.log(this.commiteeDetails);
        this.getFilePool();
      });
  }
  setmemberDtoResponse(memData) {
    let data = {
      MEMBER:
        memData && memData.MEMBER
          ? (memData.MEMBER.map((member) =>
              this.generateMemberForm(member)
            ) as Array<any>)
          : [],
      CHAIRMAN:
        memData && memData.CHAIRMAN
          ? (memData.CHAIRMAN.map((member) =>
              this.generateMemberForm(member)
            ) as Array<any>)
          : [],
      EX_OFFICIO:
        memData && memData.EX_OFFICIO
          ? (memData.EX_OFFICIO.map((member) =>
              this.generateMemberForm(member)
            ) as Array<any>)
          : [],
    };
    return data;
  }
  setMemberDto() {
    let body = [];
    this.commiteeDetails.committeeDto[0].memberDtoResponse.MEMBER.forEach(
      (element) => {
        body.push(element);
      }
    );
    this.commiteeDetails.committeeDto[0].memberDtoResponse.CHAIRMAN.forEach(
      (element) => {
        body.push(element);
      }
    );
    return body;
  }
  generateMemberForm(member: MEMBER) {
    const memberForm = {
      delete: member.delete,
      id: member ? member.id : null,

      memberId: member ? member.memberId : null,

      roleId: member ? member.roleId : null,

      memberName: member ? member.memberName : null,

      partySide: member ? member.member.details.memberGroup : null,
      newMember: false,
      portfolioName : null,
    };
    return memberForm;
  }

  showAddmemberPopup(type, co) {
    this.tabType = type;
    if(this.tabType == 'chairman'){debugger;
      let selectedCommiteeMembers = [];
      
      for (const memObj of this.commiteeDetails.committeeDto[0].memberDtoResponse.MEMBER) {
       let extracted = this.listOfAllMembers.find(x => x.userId == memObj.memberId);
       if(extracted){
        selectedCommiteeMembers.push(extracted);
       }
       }
      // for (const memObj of this.listOfAllMembers) {
      //   selectedCommiteeMembers = this.listOfAllMembers
      //   if(x => x.userId == memObj.memberId);
      //  }
      this.allMembers = selectedCommiteeMembers; 
      for (const memObj of this.commiteeDetails.committeeDto[0].memberDtoResponse.CHAIRMAN) {
        this.allMembers = this.allMembers
        .filter(x => x.userId != memObj.memberId);
       }
    }
    else if(this.tabType == 'member'){
      this.allMembers = this.listOfAllMembers; 
      for (const memObj of this.commiteeDetails.committeeDto[0].memberDtoResponse.MEMBER) {
        this.allMembers = this.allMembers
        .filter(x => x.userId != memObj.memberId);
       }
    }
    this.allMembers.forEach((element) => {
      element.checked = false;
      element.disable = false;
    });
    this.showAddmember = true;
  }
  gelAllMembers() {
    this.committeeCommonService.getAllMembersList().subscribe((Res: any) => {
      Res.forEach((r, index) => {
        if (r.roles) {
          let found = r.roles.find(
            (item) => item.roleName === "speaker"
          );
          if (found) {
            Res.splice(index, 1);
          }
        }
      });
      this.allMembers = this.listOfAllMembers = Res;
    });
  }
  getAllRolesList() {
    this.committeeService.getAllRolesList().subscribe((Res: any) => {
      this.roleList = Res;
    });
  }
  checkMemeber(box) {
    box.checked = !box.checked;
  }
  disableMemeber() {
    if(this.tabType == 'chairman'){
    let count = 0;
    for (const box of this.allMembers) {
      if (box.checked) {
        count++;
      }
    }
    if (count === 1) {
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
  }
  addMember() {
    if (this.tabType == "member") {
      let roleCode = this.roleList.find((element) => element.code == "MEMBER");
      this.selectedMembers = this.allMembers.filter(
        (element) => element.checked == true
      );
      if (this.selectedMembers) {
        let memberSelected;
        this.selectedMembers.forEach((element) => {
          memberSelected = this.generateAddedMemberArray(element, roleCode);
          this.commiteeDetails.committeeDto[0].memberDtoResponse.MEMBER.push(
            memberSelected
          );
          this.commiteeDetails.committeeDto[0].memberDtos.push(
            memberSelected
          );
        });
        this.showAddmember = false;
      }
    } else if (this.tabType == "chairman") {
      let roleCode = this.roleList.find(
        (element) => element.code == "CHAIRMAN"
      );
      this.selectedMembers = this.allMembers.filter(
        (element) => element.checked == true
      );
      if (this.selectedMembers) {
        let chSelected;
        this.selectedMembers.forEach((element) => {
          chSelected = this.generateAddedMemberArray(element, roleCode);
          let deleteIndex = this.commiteeDetails.committeeDto[0].memberDtoResponse.
                     MEMBER.findIndex( element => element.memberId == chSelected.memberId)
          if(deleteIndex >= 0){
            this.commiteeDetails.committeeDto[0].memberDtoResponse.MEMBER.splice(deleteIndex, 1); //deleting from member array
          }    
         let dtoDeleteIndex = this.commiteeDetails.committeeDto[0].memberDtos.findIndex( element => element.memberId == chSelected.memberId)       
          if(dtoDeleteIndex >= 0){
            if(this.commiteeDetails.committeeDto[0].memberDtos[dtoDeleteIndex].id){
              this.commiteeDetails.committeeDto[0].memberDtos[dtoDeleteIndex].delete = true; //deleting old from member array
            }else{
              this.commiteeDetails.committeeDto[0].memberDtos.splice(dtoDeleteIndex, 1);//deleting from newly aded memberDTOs array
            }
          } 
          this.commiteeDetails.committeeDto[0].memberDtoResponse.CHAIRMAN.push(
            chSelected
          );
          this.commiteeDetails.committeeDto[0].memberDtos.push(
            chSelected
          );
        });
        this.showAddmember = false;
      }
    }
  }
  generateAddedMemberArray(member, code) {
    let memberForm = {
      delete: false,
      id: null,
      memberId: member ? member.userId : null,
      memberName: member ? member.details.fullName : null,
      roleId: code ? code.id : null,
      partySide: member ? member.details.memberGroup : null,
      newMember: true,
      portfolioName : null,
    };
    return memberForm;
  }
  handleCancel() {
    this.showAddmember = false;
    this.selectedMembers = null;
  }

  saveCommitee(attach) {
    // this.commiteeDetails.committeeDto[0].memberDtos = this.setbuildReqBody();
    if(this.checkValidity()){
    this.committeeService
      .saveCommitte(this.commiteeDetails)
      .subscribe((Res: any) => {
        if (attach) {
          this.attachToFile();
        } else {
          this.notification.success("Success", " Saved Successfully");
          this.router.navigate([
            "business-dashboard/committee/file-view/",
            this.commiteeDetails.fileId,
          ]);
        }
      });
    }  
  }
  checkValidity(){
    let validity = true;
    if(this.commiteeDetails.committeeDto[0].name.length == 0){
      validity = false;
      this.notification.error("Error","Commitee name is required!")
    }else if(this.commiteeDetails.committeeDto[0].memberDtoResponse.MEMBER.length == 0){
      validity = false;
      this.notification.error("Error","Please add at least one member!")
    }else if(this.commiteeDetails.committeeDto[0].memberDtoResponse.CHAIRMAN.length == 0 &&
      this.rbsPermission.addChairman
      ){
      validity = false;
      this.notification.error("Error","Please add chairman!")
    }
    return validity;
  }
  getFilePool() {
    this.fileService
    .getFileById(this.commiteeDetails.fileId, this.user.userId)
    .subscribe((Response: any) => {
      this.fileDetails = Response;
      // this.fileService
      // .checkWorkFlowStatus(this.fileDetails.fileResponse.workflowId)
      // .subscribe((Res: any) => {
      //   const current = Res[Res.length - 1];
      //   this.assignee = current.assignee;
      // });
    });
  }
  attachToFile() {
    const body = {
      comitteeId: this.committeeId,
      fileForm: {
        activeSubTypes: this.fileDetails.fileResponse.activeSubTypes,
        fileId: this.commiteeDetails.fileId,
        userId: this.user.userId,
        requestedAdditionalSubtype: ['COMMITTEE_MEMBER']
      },
    };
    this.fileService.attachActiveSubtype(body).subscribe((res) => {
      this.notification.success(
        'Success',
        'Member Details Attached to File Successfully'
      );
      this.router.navigate([
        'business-dashboard/committee/file-view/',
        this.commiteeDetails.fileId,
      ]);
    });
  }
  deleteChairman(chairmanData,chIndex){debugger;
    this.commiteeDetails.committeeDto[0].memberDtoResponse.CHAIRMAN.splice(chIndex, 1);//deleting member from memberDtoResponse.CHAIRMAN
    let index = 0;
    this.commiteeDetails.committeeDto[0].memberDtos.forEach(m => { // deleteing chariman from memberDtos
      if(m.memberId == chairmanData.memberId && m.roleId == chairmanData.roleId &&
        chairmanData.newMember == false ){
         m.delete = true;
      }else if(m.memberId == chairmanData.memberId && m.roleId == chairmanData.roleId &&
        chairmanData.newMember == true)
      {
        this.commiteeDetails.committeeDto[0].memberDtos.splice(index, 1);
      }
      index ++;  
    });

    //adding deeleted chairman  to member array back as a new member
    let roleCode = this.roleList.find((element) => element.code == "MEMBER");
    let memberData = {
      delete: false,
      id: null,
      memberId:chairmanData.memberId,
      memberName: chairmanData.memberName,
      newMember: true,
      partySide: chairmanData.partySide,
      portfolioName : null,
      roleId: roleCode.id,
      member : null
    };
    memberData.delete = false;
    this.commiteeDetails.committeeDto[0].memberDtoResponse.MEMBER.push(memberData);
    this.commiteeDetails.committeeDto[0].memberDtos.push(memberData);
    console.log(this.commiteeDetails);
  }
  deleteMember(memberData,memIndex){
    this.commiteeDetails.committeeDto[0].memberDtoResponse.MEMBER.splice(memIndex, 1); //deleting member from memberDtoResponse.MEMBER
    let index = 0;
    this.commiteeDetails.committeeDto[0].memberDtos.forEach(m => { //deleting member from memberDtos
      if(m.memberId == memberData.memberId && m.roleId == memberData.roleId &&
         memberData.newMember == false ){
         m.delete = true;
      }else if(m.memberId == memberData.memberId && m.roleId == memberData.roleId && 
        memberData.newMember == true) {
        this.commiteeDetails.committeeDto[0].memberDtos.splice(index, 1);
      }
      index ++;  
    });
    console.log(this.commiteeDetails);

  }
}
