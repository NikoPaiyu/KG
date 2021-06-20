import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { CommitteeService } from '../../shared/services/committee.service';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'committee-objection-note',
  templateUrl: './objection-note.component.html',
  styleUrls: ['./objection-note.component.css']
})
export class ObjectionNoteComponent implements OnInit {
  @Output() cancelnote = new EventEmitter<any>();
  noteForm: FormGroup;
  @Input() subagenda;
  @Input() reportDto;
  @Input() purpose;
  @Input() meetingInfo;
  presentedMemberList;
  allPresentedMemberList;
  memberList;
  memberResponse
  user;
  myCommiteeId;
  modules;
  constructor(  private fb: FormBuilder,public common: CommitteecommonService,
    private committeeService: CommitteeService,private router: Router,private notification: NzNotificationService,
    @Inject('authService') private AuthService,
    ) {
     this.user = AuthService.getCurrentUser();
     }

  ngOnInit() {
    this.setEditorConfig();
    this.getAllMembers();
    this.setnoteForm();
    
  }
  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline"],
        ["link"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
      ],
    };
  }
  setnoteForm() {
    this.noteForm = this.fb.group({
      note: [null, Validators.required],
      signedMembers: [null, Validators.required],
    });
  }
  getAllMembers(){
    let presentedMember = [];
    let myCommitteeMembers = [];
    console.log(this.subagenda);
    this.committeeService
    .getCommiteeMembersBySubagendaId(this.subagenda.forwardedBusiness.id)
    .subscribe((Res:any) => {
      this.memberResponse = Res;
      if(this.meetingInfo.id && this.memberResponse.members){
        // presentedMember = this.memberResponse.members;
        // presentedMember = presentedMember.filter(member=>  // to check whther the member is presented or not
        //   member.attendence[this.meetingInfo.id].present == true
        // )
        this.memberResponse.members.forEach(member => {
          if(member.attendence[this.meetingInfo.id] && member.attendence[this.meetingInfo.id].present == true){
            presentedMember.push(member);
          }
        });
      }
      this.presentedMemberList=this.allPresentedMemberList = presentedMember;
      this.presentedMemberList.forEach(element => {
        element.disabled = false;
      });
      if(this.isMLA()){
        this.presentedMemberList.forEach(element => {
          if(element.memberId == this.user.userId ){
            element.disabled = true;
           this.myCommiteeId = element.committeeId;
          }
        });
        this.noteForm.patchValue({
          signedMembers : [this.user.userId] // setting current member as defult selection
        });
        myCommitteeMembers = this.presentedMemberList.filter(m=>m.committeeId == this.myCommiteeId); // Filtering My commiteee members
        this.memberList = myCommitteeMembers;
      }else{
        this.memberList = this.presentedMemberList
      }
      this.memberList = this.memberList
        .filter(x => !this.reportDto.dissentNoteAddedMembers.includes(x.memberId)); //filtering already dissent note added members
    });
  }
  onMemberChange(member){
    let currentMember,myCommitteeMembers = [];
    if(member.length != 0){
    if(!this.isMLA()){
      currentMember = this.memberList.find(m=>m.memberId == member[0]);
      myCommitteeMembers = this.presentedMemberList.filter(m=>m.committeeId == currentMember.committeeId); // Filtering My commiteee members
      this.memberList = myCommitteeMembers;
      this.memberList = this.memberList
        .filter(x => !this.reportDto.dissentNoteAddedMembers.includes(x.memberId));
    }
    }else{
      this.memberList = this.presentedMemberList
    }
  }
  cancelDissentnote(){
    this.cancelnote.emit(false);
  }
  isMLA() {
    return this.AuthService.getCurrentUser().authorities.includes('MLA');
  }
  addNote(){
    console.log(this.noteForm.value);
    if(this.noteForm.valid){
     let body={
       note: this.noteForm.value.note,
       signedMembers : this.noteForm.value.signedMembers,
       forwardedBusinessId:this.subagenda.forwardedBusiness.id,
     }
    // tslint:disable-next-line: align
    this.committeeService.createDissentNote(body).subscribe((res: any) => {
      console.log(res);
      this.notification.success("Success","Success")
      this.cancelDissentnote();
    });
   }else{
    for (const i in this.noteForm.controls) {
      this.noteForm.controls[i].markAsDirty();
      this.noteForm.controls[i].updateValueAndValidity();
    }
   }
  
  }
 
}
