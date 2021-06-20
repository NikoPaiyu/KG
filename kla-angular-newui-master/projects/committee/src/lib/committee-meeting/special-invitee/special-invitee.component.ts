import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FileServiceService } from "../../shared/services/file-service.service";
import { NzNotificationService } from "ng-zorro-antd";
import { CommitteeService } from "../../shared/services/committee.service";
import { CommitteecommonService } from "../../shared/services/committeecommon.service";
@Component({
  selector: "committee-special-invitee",
  templateUrl: "./special-invitee.component.html",
  styleUrls: ["./special-invitee.component.scss"],
})
export class SpecialInviteeComponent implements OnInit {
  @Input() fileView = false;
  @Input() specialInvite;
  @Input() meeting;
  inviteeForm: FormGroup;
  user;
  meetingId;
  inviteeData = null;
  modules;
  allInvitee = [];
  listOfAllInvitee = [];
  tabType;
  showAddStaff = false;
  meetingDetails;
  isSubmitted = false;
  editMode = true;
  purpose;
  assignee: any;
  fileDetails = null;
  attachOrNot = false;
  specialInviteeAdded = false;

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
  }
  ngOnInit() {
    this.formvalidation();
    this.setEditorConfig();
    this.route.params.subscribe((params) => {
      if( params.id && !this.fileView){
        this.meetingId = params.id;
        this.getMeetingById();
      }else{
        this.meetingId = this.meeting.id;
        this.getMeetingById();
        this.editMode = false;
      }
      this.purpose = params.purpose;
      if(this.purpose == 'fullview' || this.purpose == 'view'){
        this.editMode = false;
      }
    });
  }
  formvalidation() {
    this.inviteeForm = this.fb.group({
      footerContent: [null, [Validators.required]],
      headerContent: [null, [Validators.required]],
      id: [null],
      userIds: this.fb.array([]),
    });
  }
  getMeetingById() {
    this.committeeService
      .getMeetingById(this.meetingId)
      .subscribe((res: any) => {
        this.inviteeData = null;
        this.meetingDetails = res;
        if (this.meetingDetails.fileNumber) {
          this.getFilePool();
        }
        if (res.specialInvite) {
          this.inviteeData = res.specialInvite;
        }
        if (this.inviteeData) {
          this.inviteeForm.patchValue({
            footerContent: this.inviteeData.footerContent,
            headerContent: this.inviteeData.headerContent,
            id: this.inviteeData.id,
          });
          this.setuserList();
        }
        this.getInvitteList();
        if (this.attachOrNot) {
          this.attachToFile();
        }
        console.log(this.inviteeForm.value);
      });
  }
  setuserList() {
    this.inviteeData.users.forEach((element) => {
      if(element.userId){
        this.addMember(element);
      }
    });
  }
  addMember(member) {
    let fg = this.fb.group({
      userId: [member ? member.userId : null],
      memberName: member.details.fullName,
    });
    (<FormArray>this.inviteeForm.get("userIds")).push(fg);
  }
  gotoBack() {
    window.history.back();
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
  get getUserData() {
    const controls = this.inviteeForm.get("userIds") as FormArray;
    // this.clau.seCount = controls.length;
    return controls;
  }
  deleteInvitee(controls, index) {
    let deletedMember = this.listOfAllInvitee.find(x=>x.userId == controls.value.userId );
    if(deletedMember){
        this.allInvitee.push(deletedMember);
    }
    let control = <FormArray>this.inviteeForm.controls.userIds;
    control.removeAt(index);
  }
  cancel(){
    
  }
  showStaffPopup(invitee) {
    this.tabType = invitee;
    this.showAddStaff = true;
  }
  getInvitteList() {
    this.committeeCommonService.getAllMinistersList().subscribe((Res: any) => {
      this.allInvitee = this.listOfAllInvitee = Res;
      const inviteeFormArray = this.inviteeForm.get("userIds") as FormArray;
      for (let inviteee of inviteeFormArray.controls) {
        this.allInvitee = this.allInvitee.filter(
          (x) => x.userId != inviteee.value.userId
        );
      }
    });
  }

  hideStaffPopUp(event) {
    this.showAddStaff = event;
  }
  addStaffFromPopUp(member) {
    if (this.tabType == "invitee") {
      member.forEach((element) => {
        this.addMember(element);
      });
      this.allInvitee = this.allInvitee.filter(
        (x) => !member.map((y) => y.userId).includes(x.userId)
      );
    }
  }

  saveSpecialInvitee() {
    this.isSubmitted = true;
    if (this.checkArrayValidity() && this.inviteeForm.valid) {
    let reqBody = this.buildReqBody();
    console.log(reqBody);
    this.committeeService.saveSpecialInvitee(reqBody).subscribe((Res: any) => {
      this.editMode = false;
      this.inviteeForm.reset();
      this.notification.success("Sucess", "Saved Sucessfully..");
      if (this.meetingDetails.fileId !== 'null') {
        this.router.navigate([
          "business-dashboard/committee/file-view/",
          this.meetingDetails.fileId,
        ]);
      } else {
        this.editMode = false;
        this.purpose = 'fullview';
        this.inviteeForm.reset();
        this.formvalidation();
        this.getMeetingById();
      }
    });
  } else{
    this.validationMessage();
  }
  }
  saveandResubmitData() {
    this.isSubmitted = true;
    if (this.checkArrayValidity() && this.inviteeForm.valid) {
      this.fileService
        .getFileById(this.meetingDetails.fileId, this.user.userId)
        .subscribe((res: any) => {
          if (res.fileResponse.status == "APPROVED") {
            let reqBody = this.buildReqBody();
            console.log("reqBody", reqBody);
            this.committeeService
              .saveSpecialInvitee(reqBody)
              .subscribe((Response: any) => {
                let fileReqbody = {
                  meetingSpecialInviteId: Response.id,
                  fileForm: {
                    activeSubTypes: ["MEETING_SPECIAL_INVITE"],
                    fileId: this.meetingDetails.fileId,
                    subtype: "COMMITTEE_MEETING",
                    type: "COMMITTEE",
                    userId: this.user.userId,
                  },
                };
                this.fileService
                  .reSubmitFile(fileReqbody)
                  .subscribe((Res: any) => {
                    this.notification.success(
                      "Success",
                      " Resubmitted Successfully"
                    );
                    this.router.navigate([
                      "business-dashboard/committee/file-view/",
                      this.meetingDetails.fileId,
                    ]);
                  });
              });
          } else if (this.assignee != this.user.userId) {
            this.save();
            this.notification.warning(
              "Sorry..",
              "Currently file is under approval flow..Try again later... "
            );
          } else if (this.assignee == this.user.userId) {
            this.attachOrNot = true;
            this.save();
          }
        });
    } else {
      this.validationMessage();
    }
  }

  save() {
    this.isSubmitted = true;
    if (this.checkArrayValidity() && this.inviteeForm.valid) {
      const reqBody = this.buildReqBody();
      this.committeeService
        .saveSpecialInvitee(reqBody)
          .subscribe((Response: any) => {
          this.editMode = false;
          this.inviteeForm.reset();
          this.formvalidation();
          this.getMeetingById();
          this.purpose = 'fullview';
          this.notification.success(
              'Success',
              'Special Invitees Saved'
            );
      });
    } else {
      this.validationMessage();
    }
  }

  checkArrayValidity() {
    let arrayValidity = true;
    if (this.inviteeForm.value.userIds.length < 1) {
      arrayValidity = false;
    }
    return arrayValidity;
  }
  buildReqBody() {
    let userId = [];
    if (this.inviteeForm.value.userIds) {
      this.inviteeForm.value.userIds.forEach((element) => {
        userId.push(element.userId.toString());
      });
    }
    let body = {
      fileId: this.meetingDetails.fileId,
      fileNumber: this.meetingDetails.fileNumber,
      meetingId: this.meetingDetails.id,
      footerContent: this.inviteeForm.value.footerContent,
      headerContent: this.inviteeForm.value.headerContent,
      id: this.inviteeForm.value.id,
      userIds: userId,
    };
    return body;
  }
  validationMessage() {
    // tslint:disable-next-line: forin
    for (const key in this.inviteeForm.controls) {
      this.inviteeForm.controls[key].markAsDirty();
      this.inviteeForm.controls[key].updateValueAndValidity();
    }
  }
  gotoFullview(){
    this.router.navigate(['/business-dashboard/committee/invitee','fullview', this.meetingId]);
  }
  editInvitee(){
    this.editMode = true;
  }
  cancelInvitee(){
    this.meetingDetails = null;
    this.inviteeData = null;
    this.inviteeForm.reset();
    this.editMode = false;
    this.getMeetingById();
  }

  getFilePool() {
    this.fileService
    .getFileById(this.meetingDetails.fileId, this.user.userId)
    .subscribe((Response: any) => {
      this.fileDetails = Response;
      const temp = this.fileDetails.meetings.find(m => m.meetingId == this.meetingId);
      if (temp.specialInvite) {
        this.specialInviteeAdded = true;
      }
      this.fileService
      .checkWorkFlowStatus(this.fileDetails.fileResponse.workflowId)
      .subscribe((Res: any) => {
        const current = Res[Res.length - 1];
        this.assignee = current.assignee;
      });
    });
  }

  attachToFile() {
    if (this.assignee == this.user.userId && this.fileDetails.fileResponse.status == 'SUBMITTED') {
      const body = {
        meetingSpecialInviteId: this.meetingDetails.specialInvite.id,
        fileForm: {
          activeSubTypes: this.fileDetails.fileResponse.activeSubTypes,
          fileId: this.meetingDetails.fileId,
          userId: this.user.userId,
          requestedAdditionalSubtype: ['MEETING_SPECIAL_INVITE']
        },
      };
      this.fileService.attachActiveSubtype(body).subscribe((res) => {
        this.notification.success(
          'Success',
          'Special Invitee Attached to File Successfully'
        );
        this.router.navigate([
          'business-dashboard/committee/file-view/',
          this.meetingDetails.fileId,
        ]);
      });
    } else if (this.fileDetails.fileResponse.status == 'APPROVED') {
      const fileReqbody = {
        meetingSpecialInviteId: this.meetingDetails.specialInvite.id,
        fileForm: {
          activeSubTypes: ['MEETING_SPECIAL_INVITE'],
          fileId: this.meetingDetails.fileId,
          subtype: 'COMMITTEE_MEETING',
          type: 'COMMITTEE',
          userId: this.user.userId,
        },
      };
      this.fileService
        .reSubmitFile(fileReqbody)
        .subscribe((Res: any) => {
          this.notification.success(
            'Success',
            'Special Invitee Attached to File Successfully'
          );
          this.router.navigate([
            'business-dashboard/committee/file-view/',
            this.meetingDetails.fileId,
          ]);
        });
    } else {
      this.notification.warning(
        'Sorry..',
        'Currently file is under approval flow..Try again later... '
      );
    }
  }
}
