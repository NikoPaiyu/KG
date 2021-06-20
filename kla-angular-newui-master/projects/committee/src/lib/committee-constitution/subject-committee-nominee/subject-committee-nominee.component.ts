import { Component, Inject, OnInit } from "@angular/core";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import {
  committeeDto,
  MEMBER,
  nomineeDto,
} from "../../shared/model/nominee.model";
import { CommitteeService } from "../../shared/services/committee.service";
import { map } from "rxjs/operators";
import { CommitteecommonService } from "../../shared/services/committeecommon.service";
import { elementEventFullName } from "@angular/compiler/src/view_compiler/view_compiler";
import { FileServiceService } from "../../shared/services/file-service.service";
@Component({
  selector: "committee-subject-committee-nominee",
  templateUrl: "./subject-committee-nominee.component.html",
  styleUrls: ["./subject-committee-nominee.component.css"],
})
export class SubjectCommitteeNomineeComponent implements OnInit {
  committeResponseCount = 0;
  validateForm!: FormGroup;
  isSubmitted = false;
  deletedMemeberArray = [];
  showAddmember;
  i = [1, 2, 3, 4, 5, 6, 7, 8];
  user;
  committeeId;
  committeeData;
  committeeDetailsForm: FormGroup;
  allMinisters = [];
  allMembers = [];
  listOfAllMinisters = [];
  listOfAllMembers = [];
  tabtype;
  committeIndex;
  roleList = [];
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  listOfControls: Array<{ id: number; controlInstance: string }> = [];
  purpose;
  editMode = true;
  alreadyAddedMemberCount = 0;
  addMemberTitle = "Add Member";
  rbsPermission = {
    approveCommitee: false,
  };
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
    this.committeeCommonService.setCommitteePermissions(
      this.user.rbsPermissions
    );
    console.log(this.user);
  }
  ngOnInit() {
    this.loadPermissions();
    this.route.params.subscribe((params) => {
      this.committeeId = params.id;
      this.purpose = params.purpose;
      if (this.purpose == "view") {
        this.editMode = false;
      } else if (this.purpose == "edit") {
        this.editMode = true;
      }
      this.getCommitteeById();
    });
    this.getAllRolesList();
  }
  back() {
    window.history.back();
  }
  loadPermissions() {
    if (
      this.committeeCommonService.doIHaveAnAccess("FILE", "APPROVE") ||
      this.committeeCommonService.doIHaveAnAccess(
        "FILE_RATIFICATION",
        "APPROVE"
      )
    ) {
      this.rbsPermission.approveCommitee = true;
    }
  }
  getTotalMemberCount(committeIndex) {
    let totalCount = 0;
    totalCount =
      this.memberListFormArray(committeIndex).length +
      this.exOfficeFormArray(committeIndex).length +
      this.chairmanFormArray(committeIndex).length;

    return totalCount;
  }
  getTotalExOfficioandMemberCount(committeIndex) {
    let totalCount = 0;
    totalCount =
      this.memberListFormArray(committeIndex).length +
      this.exOfficeFormArray(committeIndex).length;
    return totalCount;
  }
  checkForMaxMemberCount(committeIndex) {
    let exceeded = false;
    this.alreadyAddedMemberCount = this.getTotalExOfficioandMemberCount(
      committeIndex
    );
    console.log("alreadyAddedMemberCount", this.alreadyAddedMemberCount);
    if (
      this.alreadyAddedMemberCount >= 10 &&
      (this.tabtype == "member" || this.tabtype == "exOffice")
    ) {
      this.notification.warning(
        // "Sorry","You already added  "+this.exOfficeFormArray(committeIndex).length +"  Ex Officio's and  " +this.memberListFormArray(committeIndex).length +"  Members" );
        "Sorry",
        "You can only add a maximum of 11 members, including the chairman!!"
      );
      exceeded = true;
    }
    return exceeded;
  }
  showAddmemberPopup(type, committeIndex) {
    this.tabtype = type;
    if (this.checkForMaxMemberCount(committeIndex)) {
      return;
    }
    this.committeIndex = committeIndex;
    if (this.tabtype == "member") {
      let alreadyAdded = this.memberListFormArray(committeIndex);
      //  this.alreadyAddedMemberCount = this.memberListFormArray(committeIndex).length;
      for (const memObj of alreadyAdded.controls) {
        console.log(memObj.value.memberId);
        this.allMembers = this.allMembers.filter(
          (x) => x.userId != memObj.value.memberId
        );
      }
    }
    if (this.tabtype == "exOffice" || this.tabtype == "chairman") {
      this.allMinisters = this.listOfAllMinisters;
      let alreadyAdded = this.exOfficeFormArray(committeIndex);
      for (const memObj of alreadyAdded.controls) {
        this.allMinisters = this.allMinisters.filter(
          (x) => x.userId != memObj.value.memberId
        );
      }
      let chairmanAdded = this.chairmanFormArray(committeIndex);
      for (const memObj of chairmanAdded.controls) {
        this.allMinisters = this.allMinisters.filter(
          (x) => x.userId != memObj.value.memberId
        );
      }
    }
    this.showAddmember = true;
  }
  cancelAddMember(event) {
    this.showAddmember = event;
  }

  getAllRolesList() {
    this.committeeService.getAllRolesList().subscribe((Res: any) => {
      this.roleList = Res;
    });
  }
  getCommitteeById() {
    this.setCommitteForm().subscribe((form) => {
      this.committeeDetailsForm = form;
      console.log(this.committeeDetailsForm.value);
      console.log(this.committeeDetailsForm.value.committeeDto.length);
      this.setMemberDTO();
      this.getAllMinisters();
      this.getAllMembers();
    });
  }

  setCommitteForm() {
    return this.committeeService.getCommitteeById(this.committeeId).pipe(
      map((apiResponse: any) =>
        this.fb.group({
          id: [apiResponse ? apiResponse.id : null],
          assemblyId: [apiResponse ? apiResponse.assemblyId : null],
          categoryId: [apiResponse ? apiResponse.categoryId : null],
          fileId: [apiResponse ? apiResponse.fileId : null],
          fileNumber: [apiResponse ? apiResponse.fileNumber : null],
          name: [
            apiResponse ? apiResponse.name : null,
            Validators.compose([Validators.required]),
          ],
          committeeDto: this.setCommitteDto(apiResponse),
          nomineeDto: this.fb.array(
            apiResponse.nomineeDto.map((nominee) =>
              this.generateNomineeForm(nominee)
            )
          ),
          status: [apiResponse ? apiResponse.status : null],
          memberFileStatus: [apiResponse ? apiResponse.memberFileStatus : null],
        })
      )
    );
  }
  setCommitteDto(apiResponse) {
    this.committeResponseCount = apiResponse.committeeDto.length;
    if (apiResponse.nomineeDto.length != 0) {
      return this.fb.array(
        apiResponse.nomineeDto.map((commitee) =>
          this.generateCommitteeDTOForm(commitee)
        )
      );
    } else {
      return this.fb.array(
        apiResponse.committeeDto.map((commitee) =>
          this.generateCommitteeDTOForm(commitee)
        )
      );
    }
  }
  generateCommitteeDTOForm(committee: committeeDto) {
    return this.buildCommitteORNomineeForm(committee);
  }
  generateNomineeForm(nominee: nomineeDto) {
    return this.buildCommitteORNomineeForm(nominee);
  }
  buildCommitteORNomineeForm(data) {
    const DataForm = this.fb.group({
      assemblyId: [data ? data.assemblyId : null],
      categoryId: [data ? data.categoryId : null],
      contacts: [],
      dateOfConstitution: [data ? data.dateOfConstitution : null],
      id: [data ? data.id : null],
      memberDtos: this.fb.array([]),
      memberDtoResponse: this.fb.group({
        MEMBER:
          data.memberDtoResponse && data.memberDtoResponse.MEMBER
            ? this.fb.array(
                data.memberDtoResponse.MEMBER.map((member) =>
                  this.generateMemberForm(member)
                )
              )
            : this.fb.array([]),
        CHAIRMAN:
          data.memberDtoResponse && data.memberDtoResponse.CHAIRMAN
            ? this.fb.array(
                data.memberDtoResponse.CHAIRMAN.map((member) =>
                  this.generateMemberForm(member)
                )
              )
            : this.fb.array([]),
        EX_OFFICIO:
          data.memberDtoResponse && data.memberDtoResponse.EX_OFFICIO
            ? this.fb.array(
                data.memberDtoResponse.EX_OFFICIO.map((member) =>
                  this.generateMemberForm(member)
                )
              )
            : this.fb.array([]),
      }),
      name: [
        data ? data.name : null,
        Validators.compose([Validators.required]),
      ],
      status: [data ? data.status : null],
      subjectId: [data ? data.subjectId : null],
      subjectName: [data ? data.subjectName : null],
    });
    return DataForm;
  }
  generateMemberForm(member: MEMBER) {
    // this.allMembers = this.allMembers.filter(allmem => allmem.userId !== member.memberId);
    this.allMinisters = this.allMinisters.filter(
      (allmem) => allmem.userId !== member.memberId
    );
    const memberForm = this.fb.group({
      delete: [member.delete],
      id: [member ? member.id : null],
      memberId: [member ? member.memberId : null],
      roleId: [member ? member.roleId : null],
      memberName: [member ? member.memberName : null],
      partySide: [member ? member.member.details.memberGroup : null],
      portfolioName: [member ? member.portfolioName : null],
      newMember: [false],
    });
    return memberForm;
  }
  get committeeDtoFormArray() {
    const controls = this.committeeDetailsForm.get("committeeDto") as FormArray;
    return controls;
  }
  memberListFormArray(mem) {
    const controls = mem.get("memberDtoResponse.MEMBER") as FormArray;
    return controls;
  }
  chairmanFormArray(mem) {
    const controls = mem.get("memberDtoResponse.CHAIRMAN") as FormArray;
    return controls;
  }
  exOfficeFormArray(ex) {
    const controls = ex.get("memberDtoResponse.EX_OFFICIO") as FormArray;
    return controls;
  }
  memberDTOsFormArray(comm) {
    const controls = comm.get("memberDtos") as FormArray;
    return controls;
  }
  deleteChairman(committe, chairman) {
    console.log("chairman", chairman);
    let chairmanId = chairman.value.memberId;
    let controls = committe.get("memberDtoResponse.CHAIRMAN") as FormArray;
    controls.removeAt(chairman);
    this.deletedMemeberArray.push(chairman.value);
    let deletedMember = this.listOfAllMinisters.find(
      (x) => x.userId == chairman.value.memberId
    );
    if (deletedMember) {
      this.allMinisters.push(deletedMember);
    }
    let memberDtoFormArray = this.memberDTOsFormArray(committe);
    let index = 0;
    for (let memObj of memberDtoFormArray.controls) {
      if (
        memObj.value.memberId == chairmanId &&
        memObj.value.newMember == false
      ) {
        memObj.value.delete = true;
      } else if (
        memObj.value.memberId == chairmanId &&
        memObj.value.newMember == true
      ) {
        memberDtoFormArray.removeAt(index);
      }
      index++;
    }
  }
  deleteMember(committe, member, memberIndex) {
    let memberId = member.value.memberId;
    let controls = committe.get("memberDtoResponse.MEMBER") as FormArray;
    this.deletedMemeberArray.push(member.value);
    let deletedMember = this.listOfAllMembers.find(
      (x) => x.userId == member.value.memberId
    );
    if (deletedMember) {
      this.allMembers.push(deletedMember);
    }
    controls.removeAt(memberIndex);
    let memberDtoFormArray = this.memberDTOsFormArray(committe);
    let index = 0;
    for (let memObj of memberDtoFormArray.controls) {
      if (
        memObj.value.memberId == memberId &&
        memObj.value.newMember == false
      ) {
        memObj.value.delete = true;
      } else if (
        memObj.value.memberId == memberId &&
        memObj.value.newMember == true
      ) {
        memberDtoFormArray.removeAt(index);
      }
      index++;
    }
  }
  deleteEx_Officio(committe, member, memberIndex) {
    let memberId = member.value.memberId;
    let controls = committe.get("memberDtoResponse.EX_OFFICIO") as FormArray;
    controls.removeAt(memberIndex);
    let memberDtoFormArray = this.memberDTOsFormArray(committe);
    let index = 0;
    for (let memObj of memberDtoFormArray.controls) {
      if (
        memObj.value.memberId == memberId &&
        memObj.value.newMember == false
      ) {
        memObj.value.delete = true;
      } else if (
        memObj.value.memberId == memberId &&
        memObj.value.newMember == true
      ) {
        memberDtoFormArray.removeAt(index);
      }
      index++;
    }
  }
  getAllMinisters() {
    this.committeeCommonService.getAllMinistersList().subscribe((Res: any) => {
      this.allMinisters = this.listOfAllMinisters = Res;
    });
  }
  getAllMembers() {
    this.committeeCommonService
      .getAllExcludingMinisters()
      .subscribe((Res: any) => {
        Res.forEach((r, index) => {
          if (r.roles) {
            let found = r.roles.find(
              (item) =>
                item.roleName === "speaker" || item.roleName === "deputySpeaker"
            );
            if (found) {
              Res.splice(index, 1);
            }
          }
        }); // Removing Speaker
        this.allMembers = this.listOfAllMembers = Res;
        const CommitteformArray = this.committeeDetailsForm.get(
          "committeeDto"
        ) as FormArray;
        for (let commObj of CommitteformArray.controls) {
          let memberFormArray = commObj.get(
            "memberDtoResponse.MEMBER"
          ) as FormArray;
          if (memberFormArray) {
            for (let memobj of memberFormArray.controls) {
              this.allMembers = this.allMembers.filter(
                (x) => x.userId != memobj.value.memberId
              );
            }
          }
        }
      });
  }
  addMember(member) {
    if (this.tabtype == "member") {
      let roleCode = this.roleList.find((element) => element.code == "MEMBER");
      console.log(roleCode);
      member.forEach((element) => {
        this.memberListFormArray(this.committeIndex).push(
          this.generateAddedMemberArray(element, roleCode)
        );
        this.memberDTOsFormArray(this.committeIndex).push(
          this.generateAddedMemberArray(element, roleCode)
        );
      });
      this.allMembers = this.allMembers.filter(
        (x) => !member.map((y) => y.userId).includes(x.userId)
      );
    } else if (this.tabtype == "chairman") {
      let roleCode = this.roleList.find(
        (element) => element.code == "CHAIRMAN"
      );
      member.forEach((element) => {
        this.chairmanFormArray(this.committeIndex).push(
          this.generateAddedMemberArray(element, roleCode)
        );
        this.memberDTOsFormArray(this.committeIndex).push(
          this.generateAddedMemberArray(element, roleCode)
        );
        this.allMinisters = this.allMinisters.filter(
          (x) => !member.map((y) => y.userId).includes(x.userId)
        );
      });
    } else if (this.tabtype == "exOffice") {
      let roleCode = this.roleList.find(
        (element) => element.code == "EX_OFFICIO"
      );
      member.forEach((element) => {
        this.exOfficeFormArray(this.committeIndex).push(
          this.generateAddedMemberArray(element, roleCode)
        );
        this.memberDTOsFormArray(this.committeIndex).push(
          this.generateAddedMemberArray(element, roleCode)
        );
      });
    }
  }
  generateAddedMemberArray(member, code) {
    let memberForm = this.fb.group({
      delete: [false],
      id: [null],
      memberId: [member ? member.userId : null],
      memberName: [member ? member.details.fullName : null],
      roleId: [code ? code.id : null],
      partySide: [member ? member.details.memberGroup : null],
      portfolioName: [member ? member.details.portfolioName : null],
      newMember: [true],
    });
    return memberForm;
  }
  setMemberDTO() {
    const CommitteformArray = this.committeeDetailsForm.get(
      "committeeDto"
    ) as FormArray;
    for (let commObj of CommitteformArray.controls) {
      let anscontrols = <FormArray>(<FormGroup>commObj).controls["memberDtos"];

      let memberFormArray = commObj.get(
        "memberDtoResponse.MEMBER"
      ) as FormArray;
      if (memberFormArray) {
        for (let memobj of memberFormArray.controls) {
          anscontrols.push(this.fb.control(memobj.value));
        }
      }
      let chairArray = commObj.get("memberDtoResponse.CHAIRMAN") as FormArray;
      if (chairArray) {
        for (let chObj of chairArray.controls) {
          anscontrols.push(this.fb.control(chObj.value));
        }
      }
      let exOfficeArray = commObj.get(
        "memberDtoResponse.EX_OFFICIO"
      ) as FormArray;
      if (exOfficeArray) {
        for (let ex of exOfficeArray.controls) {
          anscontrols.push(this.fb.control(ex.value));
        }
      }
    }
  }
  cancelCommitte() {
    this.getCommitteeById();
    this.editMode = false;
  }
  saveCommitte() {
    console.log(this.committeeDetailsForm.value);
    this.isSubmitted = true;
    if (this.committeeDetailsForm.valid && this.checkArrayValidity()) {
      this.editMode = false;
      this.committeeService
        .saveCommitte(this.committeeDetailsForm.value)
        .subscribe((Res: any) => {
          this.notification.success("Success", " Saved Successfully");
          this.router.navigate([
            "business-dashboard/committee/file-view/",
            this.committeeDetailsForm.value.fileId,
          ]);
        });
    } else {
      this.validationMessage();
    }
  }
  reSubmitCommitte() {
    this.isSubmitted = true;
    console.log("arrayValidity", this.checkArrayValidity());
    console.log("validity", this.committeeDetailsForm.valid);
    if (this.committeeDetailsForm.valid && this.checkArrayValidity()) {
      let reqBody = {
        comitteeId: this.committeeId,
        fileForm: {
          activeSubTypes: ["COMMITTEE_MEMBER"],
          assemblyId: this.committeeDetailsForm.value.assemblyId,
          fileId: this.committeeDetailsForm.value.fileId,
          fileNumber: this.committeeDetailsForm.value.fileNumber,
          subtype: "COMMITTEE_FILE",
          userId: this.user.userId,
        },
      };
      this.committeeService
        .saveCommitte(this.committeeDetailsForm.value)
        .subscribe((Res: any) => {
          this.fileService.reSubmitFile(reqBody).subscribe((Res: any) => {
            this.notification.success("Success", " Resubmitted Successfully");
            this.router.navigate([
              "business-dashboard/committee/file-view/",
              this.committeeDetailsForm.value.fileId,
            ]);
          });
        });
    } else {
      this.validationMessage();
    }
  }
  checkArrayValidity() {
    let arrayValidity = true;
    let notifyMsg = null;
    debugger;
    this.committeeDetailsForm.value.committeeDto.forEach((element) => {
      if (this.rbsPermission.approveCommitee) {
        if (
          element.memberDtoResponse.CHAIRMAN.length == 0 ||
          //  element.memberDtoResponse.EX_OFFICIO.length == 0 ||
          element.memberDtoResponse.MEMBER.length == 0
        ) {
          arrayValidity = false;
        } else if (
          element.memberDtoResponse.EX_OFFICIO.length +
            element.memberDtoResponse.MEMBER.length +
            element.memberDtoResponse.CHAIRMAN.length <
          7
        ) {
          arrayValidity = false;
          notifyMsg =
            "Please check all the committees....!! Minimum 7 Members should be in each committee";
        }
      }
      if (
        element.memberDtoResponse.EX_OFFICIO.length +
          element.memberDtoResponse.MEMBER.length >
        10
      ) {
        arrayValidity = false;
        notifyMsg =
          "Please check all the committees....!! Maximum limit 10 for Ex-offico and Members is exceeded";
      }
    });
    if (notifyMsg) {
      this.notification.warning("Warning", notifyMsg);
    }
    return arrayValidity;
  }
  validationMessage() {
    for (const key in this.committeeDetailsForm.controls) {
      this.committeeDetailsForm.controls[key].markAsDirty();
      this.committeeDetailsForm.controls[key].updateValueAndValidity();
      if (key === "committeeDto") {
        const control = this.committeeDetailsForm.get(
          "committeeDto"
        ) as FormArray;
        // tslint:disable-next-line: forin
        for (const j in control.controls) {
          const controlTwo = control.controls[j] as FormGroup;
          // tslint:disable-next-line: forin
          for (const k in controlTwo.controls) {
            controlTwo.controls[k].markAsDirty();
            controlTwo.controls[k].updateValueAndValidity();
          }
        }
      }
    }
  }
  viewChart() {
    // this.committeeService
    // .saveCommitte(this.committeeDetailsForm.value)
    // .subscribe((Res:any) => {
    //  this.allMembers = Res;
    // });
  }
  cancel() {}
  EditCommitte() {
    this.editMode = true;
  }
  getAddMemberTitle() {
    let popupTitle = "";
    if (this.tabtype == "exOffice") {
      popupTitle = "Add Ex Officio";
    } else if (this.tabtype == "chairman") {
      popupTitle = "Add Chairman";
    } else {
      popupTitle = "Add Member";
    }
    return popupTitle;
  }
}
