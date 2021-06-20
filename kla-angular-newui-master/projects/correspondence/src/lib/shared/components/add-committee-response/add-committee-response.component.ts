import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CorrespondenceService } from "../../services/correspondence.service";
@Component({
  selector: "Correspondence-add-committee-response",
  templateUrl: "./add-committee-response.component.html",
  styleUrls: ["./add-committee-response.component.css"],
})
export class AddCommitteeResponseComponent implements OnInit {
  @Input() businessData: FormArray;
  @Input() correspondenceFormGrp: FormGroup;
  @Input() businessReferId;
  memberList = [];
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
     this.getMemberListByPPO();
    });
  }
  getMemberListByPPO() {
    this.correspondenceService
      // . getMemberListByPPO(this.user.userId)
      .getMemberListByBusinessReferId(this.businessReferId)
      .subscribe((Response: any) => {
        this.memberList = Response;
        // this.memberList = this.memberList.filter(x=> x.details.memberGroup !== 'TREASURY_BENCH');
        if (this.memberList) {
          this.memberList.forEach((element) => {
            this.addMember(element);
          });
        //  this.addMember(this.memberList[0]);
        //  this.addMember(this.memberList[1]);
        //  this.addMember(this.memberList[2]);
        //  this.addMember(this.memberList[3]);
        //  this.addMember(this.memberList[4]);
        }
        // const controls = this.committeeResponse;
        // this.memberList.forEach((x) => {
        //   controls.push(
        //     this.fb.group({
        //       Member: x.memberName,
        //       commitee: [x.memberName, Validators.compose([Validators.required])],
        //     })
        //   );
      });
  }
  addMember(member) {
    let fg = this.fb.group({
      memberId: [
        member ? member : null,
        Validators.compose([Validators.required]),
      ],
      subjectId: [null, Validators.compose([Validators.required])],
      // memberName: [
      //   member ? member.details.fullName : null,
      // ],
    });
    this.businessData.push(fg);
  }
  changeSubject(event,data){
    this.previewData = this.subjectCommitte;
    this.previewData.forEach(element => {
      element.members = [];
    });
    this.correspondenceFormGrp.value.businessData.forEach(Data => {
      this.previewData.forEach(element => {
        if(Data.subjectId && Data.subjectId.id == element.id){
          element.members.push(Data.memberId.details.fullName)
        }
      });
    });
  }
}
