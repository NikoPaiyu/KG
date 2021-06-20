import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CorrespondenceService } from '../../services/correspondence.service';

@Component({
  selector: 'Correspondence-view-committee-response',
  templateUrl: './view-committee-response.component.html',
  styleUrls: ['./view-committee-response.component.css']
})
export class ViewCommitteeResponseComponent implements OnInit {
  @Input() businessData: FormArray;
  @Input() correspondenceFormGrp: FormGroup;
  @Input() committeeResponse;
  @Input() isEdit;
  @Input() businessReferId;
    user;
  subjectCommitte = [];
  previewData = [];
  constructor(
    private fb: FormBuilder,
    @Inject("authService") private auth,
    private correspondenceService: CorrespondenceService
  ) {
    this.user = auth.getCurrentUser();
  }

  ngOnInit() {
    if(this.businessReferId){
      this.getSubjectCommitteeList();
    }
  }
  getSubjectCommitteeList(){
    this.correspondenceService
    .getSubjectCommitteeList(this.businessReferId)
    .subscribe((Res: any) => {
     this.subjectCommitte = Res;
     this.setValue();
    });
  }
  setValue(){
    if (this.committeeResponse) {
      this.committeeResponse.forEach((element) => {
        this.addMember(element);
      });
      this.setPreviewData();
    }
    
  }
  addMember(member) {
    let fg = this.fb.group({
      memberId: [
        member ? member.memberId : null,
        Validators.compose([Validators.required]),
      ],
      memberName: [
        member ? member.memberName : null,
        Validators.compose([Validators.required]),
      ],
      memberMalayalamName: [
        member ? member.memberMalayalamName : null,
        Validators.compose([Validators.required]),
      ],

      subjectId: [
        member ? member.subjectId : null,
        Validators.compose([Validators.required]),
      ],
      subjectName :  [
        member ? member.subjectName : null,
        Validators.compose([Validators.required]),
      ],
    });
    this.businessData.push(fg);
  }
  setSubName(subId,index){
   let sub=this.subjectCommitte.find(element=> element.id == subId);
   this.businessData.controls[index].get("subjectName").setValue(sub.subjectName);
   this.setPreviewData();
  }
  setPreviewData(){
    this.previewData = this.subjectCommitte;
    this.previewData.forEach(element => {
      element.members = [];
    });
    this.correspondenceFormGrp.value.businessData.forEach(Data => {
      this.previewData.forEach(element => {
        if(Data.subjectId && Data.subjectId == element.id){
          element.members.push(Data.memberName)
        }
      });
    });
  }
}
