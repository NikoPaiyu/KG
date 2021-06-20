import { Component, Inject, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { parseISO } from "date-fns";
import { NzNotificationService } from "ng-zorro-antd";
import { CommitteeService } from "../../shared/services/committee.service";
import { FileServiceService } from "../../shared/services/file-service.service";
@Component({
  selector: "committee-minute-view",
  templateUrl: "./minute-view.component.html",
  styleUrls: ["./minute-view.component.css"],
})
export class MinuteViewComponent implements OnInit {
  validateForm: FormGroup;
  minuteBodyForm: FormGroup;
  isVisible = false;
  singleValue = "Meeting Tittle-12/10/20";
  secretariat = "Member1";
  listOfControls: Array<{ id: number; controlInstance: string }> = [];
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  content =
    '<h1 class="ql-align-center"><strong>പൊതുഭരണ(രഹസ്യ) വകുപ്പ്</strong></h1><h3 class="ql-align-center">Kerala Government Secretariat, Mahathma Gandhi Road,</h3><h3 class="ql-align-center">Opp. Statue Junction, Palayam, Thiruvananthapuram, Kerala 695001</h3><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p>തിരുവനന്തപുരം 																																														24/8/2020 </p><p><br></p><h2 class="ql-align-center"><strong style="color: rgb(0, 0, 0);"><u>Correct Statement Request</u></strong></h2><p class="ql-align-center"><br></p><p>		<strong><p><span style="background-color: transparent; color: rgb(0, 0, 0);">എഴുത്ത് ഉപകരണങ്ങൾ വെബിൽ എവിടേയും നിങ്ങൾ തിരഞ്ഞെടുക്കുന്ന ഭാഷയിൽ ടൈപ്പുചെയ്യുന്നതിനെ സുഗമമാക്കുന്നു. അത് പരീക്ഷിച്ചുനോക്കുന്നതിന്, ചുവടെ നിങ്ങളുടെ ഭാഷയും എഴുത്ത്</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">ഉപകരണങ്ങളും തിരഞ്ഞെടുത്ത് ടൈപ്പുചെയ്യാൻ ആരംഭിക്കുക.</span></p><p>&nbsp;</p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Google Input Tools makes it easy to type in the language you choose, anywhere on the web. To try it out, choose your language and input tool below and begin typing. </span></p></strong> </p><p><br></p><p class="ql-align-right">J.S. Jayanthlal K Arunan </p><p class="ql-align-right">Joint Secretary </p><p class="ql-align-right"><br></p><p class="ql-align-right"><strong>എന്ന് ഉത്തരവിൻ പ്രകാരം</strong></p><p class="ql-align-right"><br></p><p class="ql-align-right">പി എസ് മാത്യു തോമസ്  </p><p class="ql-align-right">സെക്ഷൻ ഓഫീസർ </p><p><br></p><p><strong>പകർപ്പ്:</strong> </p><p><ol><li><span style="background-color: transparent;">Secretary, Kerala Legislative Assembly, Thiruvananthapuram</span></li><li><span style="background-color: transparent;">Comptroller Auditor General of India, Thiruvananthapuram</span></li><li><span style="background-color: transparent;">സി.പി.എൽ. സെക്ഷൻ-എ, നി.സെ., തിരുവനന്തപുരം </span></li></ol><p><br></p> </p>';
  urlState: any = null;
  public Editor: any;
  ckeConfig: any;
  minuteForm: FormGroup;
  meetingId: any;
  minuteDetails: any;
  user: any;
  activeSession: any;
  minutes = {
    committee: null,
    title: null,
    meetingDetails: null,
  };
  attendeeList: any;
  mark = false;
  populateData: any = [];
  minuteContents: any = {
    title: null,
    subtitle: null,
    attendees: null,
  };
  previewData = null;
  attendanceDetails = {};
  committeWiseAttendance = {};
  constructor(
    private router: Router,
    @Inject("editor") public ckEditor,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    public committeeService: CommitteeService,
    private route: ActivatedRoute,
    @Inject("authService") private AuthService,
    private fileService: FileServiceService
  ) {
    this.user = AuthService.getCurrentUser();
    this.Editor = ckEditor;
    this.urlState = this.router.getCurrentNavigation().extras.state;
    this.meetingId = this.route.snapshot.params.meetingId;
  }

  showModal(): void {
    this.isVisible = !this.isVisible;
    this.previewData = this.setValueForPreview();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      // console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
  }
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.listOfControl.length > 0
        ? this.listOfControl[this.listOfControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `member${id}`,
    };
    const index = this.listOfControl.push(control);
    // console.log(this.listOfControl[this.listOfControls.length - 1]);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }

  removeField1(
    i: { id: number; controlInstance: string },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.listOfControls.length > 1) {
      const index = this.listOfControls.indexOf(i);
      this.listOfControls.splice(index, 1);
      // console.log(this.listOfControls);
      this.validateForm.removeControl(i.controlInstance);
    }
  }
  addField1(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.listOfControls.length > 0
        ? this.listOfControls[this.listOfControls.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `member${id}`,
    };
    const index = this.listOfControls.push(control);
    // console.log(this.listOfControls[this.listOfControls.length - 1]);
    this.validateForm.addControl(
      this.listOfControls[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }
  ngOnInit() {
    // this.setEditorConfig();
    if (this.urlState) {
      this.populateMinuteData();
      this.validateDeptForm();
      this.getAttendeeList();
      this.minuteFormValidation();
      this.currentAssemblyAndSession();
      this.minuteForm.patchValue({
        fileId: parseInt(this.urlState.fileId, 10),
        fileNumber: this.urlState.fileNumber,
        meetingId: parseInt(this.urlState.meetingId, 10),
      });
      this.minutes.committee = this.urlState.committee;
      this.minutes.title = this.urlState.title;
      this.minutes.meetingDetails = this.urlState.meeting;
    }
    if (this.meetingId) {
      this.getMinutesByMeetingId();
    }
  }

  setEditorConfig() {
    this.ckeConfig = {
      toolbar: [
        "bold",
        "italic",
        "underline",
        "bulletedList",
        "numberedList",
        "alignment",
      ],
      placeholder: "Enter Here...",
      title: {
        isEnabled: false,
      },
    };
  }

  minuteFormValidation() {
    this.minuteForm = this.fb.group({
      description: [null, [Validators.required]],
      fileId: [null, [Validators.required]],
      fileNumber: [null, [Validators.required]],
      meetingId: [null, [Validators.required]],
      minutes: [null],
      subtitle: [null],
      title: [null, [Validators.required]],
      attendees: [null],
    });
  }

  saveMinutes() {
    // tslint:disable-next-line: forin
    for (const i in this.minuteBodyForm.controls) {
      this.minuteBodyForm.controls[i].markAsDirty();
      this.minuteBodyForm.controls[i].updateValueAndValidity();
    }
    // const control = this.minuteBodyForm.get('staffArray') as FormArray;
    // // tslint:disable-next-line: forin
    // for (const j in control.controls) {
    //   const controlTwo = control.controls[j] as FormGroup;
    //   // tslint:disable-next-line: forin
    //   for (const k in controlTwo.controls) {
    //     controlTwo.controls[k].markAsDirty();
    //     controlTwo.controls[k].updateValueAndValidity();
    //   }
    // }
    if (this.minuteBodyForm.valid) {
      this.committeeService
        .saveMinutes(this.buildBody())
        .subscribe((Res: any) => {
          this.minuteDetails = Res;
          this.notification.create(
            "success",
            "Success",
            "Minutes Saved Successfully!"
          );
          this.attachMinutes();
        });
    }
  }

  buildBody() {
    const staff = [];
    // this.minuteBodyForm.value.staffArray.forEach((x, index) => {
    //   staff.push(this.formArr.controls[index].value.staffDetail);
    // });
    const minutesDetail = [];
    this.minuteBodyForm.value.agenda.forEach((a) => {
      a.subagenda.forEach((s) => {
        const sugessionIdArray = [];
        s.suggestions.forEach((c) => {
          sugessionIdArray.push(c.id);
        });
        minutesDetail.push({
          suggestionIds: sugessionIdArray,
          description: [s.description],
          subAgendaBusinessId: s.id,
          refrenceFileNumber: s.fileNumber,
          refrenceFileId: null,
          isOldFile: false,
        });
      });
    });
    const body = {
      meetingId: this.urlState.meetingId,
      fileId: this.populateData.meetingDetailsDto.fileId,
      fileNumber: this.populateData.meetingDetailsDto.fileNumber,
      title: this.minuteContents.title,
      subtitle: this.minuteBodyForm.value.subtitle,
      deapartmentStaff: staff,
      minutesDetailForm: minutesDetail,
    };
    return body;
  }

  goBack() {
    window.history.back();
  }

  getMinutesByMeetingId() {
    this.committeeService
      .getMinutesByMeetingId(this.meetingId)
      .subscribe((Res) => {
        this.minuteDetails = Res;
        this.minutes.title = this.minuteDetails.title;
      });
  }

  attachMinutes() {
    const reqBody = {
      minutesId: this.minuteDetails.id,
      meetingId: this.minuteDetails.meetingId,
      fileForm: {
        activeSubTypes: ["MEETING_MINUTES"],
        assemblyId: this.activeSession.assemblyId,
        fileId: this.minuteDetails.fileId,
        fileNumber: this.minuteDetails.fileNumber,
        subtype: "COMMITTEE_MEETING",
        type: "COMMITTEE",
        userId: this.user.userId,
      },
    };
    this.fileService.reSubmitFile(reqBody).subscribe((Res: any) => {
      this.notification.success("Success", " Resubmitted Successfully");
      this.router.navigate([
        "business-dashboard/committee/file-view/",
        this.minuteDetails.fileId,
      ]);
    });
  }

  currentAssemblyAndSession() {
    this.committeeService.getCurrentAssemblyAndSession().subscribe((Res) => {
      this.activeSession = Res;
    });
  }

  getAttendeeList() {
    this.committeeService
      .getAttendees(this.urlState.meetingId)
      .subscribe((Res: any) => {
        this.attendeeList = Res.attendees;
        this.attendeeList.forEach((element) => {
          element.present = false;
        });
      });
  }

  markAttendance() {
    this.mark = !this.mark;
  }

  populateMinuteData() {
    this.committeeService
      .populateMinuteData(this.urlState.meetingId)
      .subscribe((Res: any) => {
        this.populateData = Res;
        this.developContent();
        this.getAgendaArray();
      });
  }

  developContent() {
    const committee = this.populateData.meetingDetailsDto.committee.find(
      (c) => c.parentCommittee === true
    );
    const month = new Array();
    month[0] = "ജനുവരി ";
    month[1] = "ഫെബ്രുവരി ";
    month[2] = "മാർച്ച് ";
    month[3] = "ഏപ്രിൽ ";
    month[4] = "മെയ് ";
    month[5] = "ജൂൺ ";
    month[6] = "ജൂലൈ ";
    month[7] = "ഓഗസ്റ്റ് ";
    month[8] = "സെപ്‌റ്റംബർ ";
    month[9] = "ഒക്റ്റോബർ ";
    month[10] = "നവംബർ ";
    month[11] = "ഡിസംബർ ";
    const date =
      parseISO(this.populateData.meetingDetailsDto.date).getFullYear() +
      " " +
      month[parseISO(this.populateData.meetingDetailsDto.date).getMonth()] +
      parseISO(this.populateData.meetingDetailsDto.date).getDate();
    this.minuteContents.title =
      '<div class="row"><div class="col-md-12 d-flex justify-content-center"><h5><strong><u>' +
      this.activeSession.assemblyValue +
      '-ാം കേരള നിയമസഭ</u></strong></h5></div></div> <div class="col-md-12 d-flex justify-content-center"><h6><strong>' +
      committee.subject.code.split("_").join(" ") +
      '</strong></h6></div><div class="col-md-12 d-flex justify-content-center"><h6><strong>(' +
      committee.subject.description +
      ')</strong></h6></div><div class="row"><div class="col-md-12 d-flex justify-content-center"><h6><strong><u>' +
      date +
      "-ാം തീയതിയിലെ യോഗനടപടിക്കുറിപ്പ്</u></strong></h6></div></div>";

    const ampm =
      parseISO(this.populateData.meetingDetailsDto.time).getHours() >= 12
        ? "pm"
        : "am";

    // tslint:disable-next-line: max-line-length
    const time =
      (parseISO(this.populateData.meetingDetailsDto.time).getHours() > 12
        ? parseISO(this.populateData.meetingDetailsDto.time).getHours() - 12
        : parseISO(this.populateData.meetingDetailsDto.time).getHours() - 12) +
      ":" +
      (parseISO(this.populateData.meetingDetailsDto.time).getMinutes() < 10
        ? "0" + parseISO(this.populateData.meetingDetailsDto.time).getMinutes()
        : parseISO(this.populateData.meetingDetailsDto.time).getMinutes()) +
      " " +
      ampm;

    const parent = this.populateData.meetingMemberDto.find(
      (x) => x.type === "PARENT_COMMITTEE"
    );
    const exOfficio = parent.members.find((x) => x.roleCode === "EX_OFFICIO");
    const chairman = parent.members.find((x) => x.roleCode === "CHAIRMAN");

    this.minuteContents.subtitle =
      committee.subject.description +
      " സംബന്ധിച്ച " +
      committee.subject.code.split("_").join(" ") +
      "," +
      date +
      "-ാം തീയതി " +
      this.populateData.meetingDetailsDto.occasion.split("_").join(" ") +
      " " +
      time +
      " മണിയ്ക്ക് നിയമസഭാ സമുച്ചയത്തിലെ " +
      this.populateData.meetingDetailsDto.venue.name +
      " സമ്മേളനഹാളിൽ സമിതി ചെയർമാനായ " +
      chairman.memberName +
      "ന്റെ അദ്ധ്യക്ഷതയിൽ യോഗം ചേർന്നു.";
    exOfficio
      ? (this.minuteContents.subtitle +=
          " സമിതിയുടെ എക്സ്- ഒഫീഷ്യോ അംഗമായ " + exOfficio.memberName + "നും")
      : "";
    this.minuteContents.subtitle +=
      " താഴെപറയുന്ന അംഗങ്ങളും പ്രസ്തുത യോഗത്തിൽ സന്നിഹിതരായിരുന്നു.";

    this.minuteBodyForm.patchValue({
      subtitle: this.minuteContents.subtitle,
    });
    this.minuteContents.attendees = this.populateData.attendees;
    this.formatAttendanceData();
    this.populateData.minutesDeatilResponse.forEach((agenda) => {
      agenda.subAgendaBusiness.forEach((subagenda) => {
        subagenda.description = null;
        subagenda.fileNumber = null;
      });
    });
  }

  // '<div class="row"><div class="col-md-2"><nz-form-label>Meeting Title</nz-form-label></div><div class="col-md-10"><b>'
  //   + this.populateData.meetingDetailsDto.title +
  //   '</b></div>

  validateDeptForm() {
    this.minuteBodyForm = this.fb.group({
      // staffArray: this.fb.array([ // removing as not required
      //     this.initStaffArray()
      //   ]),
      subtitle: [null, Validators.required],
      agenda: this.fb.array([]),
    });
  }

  // initStaffArray() { // removing as not required
  //   return this.fb.group({
  //     staffDetail: this.fb.control(null, Validators.required),
  //   });
  // }

  // get formArr() {
  //   return this.minuteBodyForm.get('staffArray') as FormArray;
  // }

  // addStaff() { // removing as not required
  //   this.formArr.push(this.initStaffArray());
  // }

  // removeStaff(i) {
  //   this.formArr.removeAt(i);
  // }

  get agendaArray(): FormArray {
    return this.minuteBodyForm.get("agenda") as FormArray;
  }

  getAgendaArray() {
    this.populateData.minutesDeatilResponse.forEach((a) => {
      const subAgenda = [];
      a.subAgendaBusiness.forEach((b) => {
        const suggestionArray = [];
        b.minutesDetailDto.suggestions.forEach((c) => {
          c.clauseList.forEach((d) => {
            suggestionArray.push({ id: d.id, content: d.content });
          });
        });
        subAgenda.push(
          this.fb.group({
            id: b.id,
            title: [b.businessTitle],
            suggestions: [suggestionArray],
            description: this.fb.control(null),
            fileNumber: this.fb.control(null),
          })
        );
      });
      this.agendaArray.push(
        this.fb.group({
          agendaType: [a.agendaType.name],
          subagenda: this.fb.array(subAgenda),
        })
      );
    });
  }

  setValueForPreview() {
    const staff = [];
    // this.minuteBodyForm.value.staffArray.forEach((x, index) => {
    //   if (this.formArr.controls[index].value.staffDetail) {
    //     staff.push(this.formArr.controls[index].value.staffDetail);
    //   }
    // });
    const minutes = {
      title: this.minuteContents.title,
      subtitle: this.minuteBodyForm.value.subtitle,
      attendees: this.minuteContents.attendees,
      deapartmentStaff: staff,
      minutesDeatilResponse: this.minuteBodyForm.value.agenda,
      meetingMemberDto: this.minuteContents.meetingMemberDto,
    };
    // console.log(minutes);
    return minutes;
  }
  formatAttendanceData() {
    let category = [];
    let committeeIds = [];
    if (this.minuteContents.attendees.length !== 0) {
      this.attendanceDetails = this.groupBy(
        this.minuteContents.attendees,
        "userRole"
      );
      committeeIds = this.populateData.meetingMemberDto.map(
        (x) => x.committeeId
      );
      committeeIds = committeeIds.filter((x) => x !== null);
      committeeIds.forEach((cat) => {
        this.committeWiseAttendance[cat] = [];
      });
      let memberCatgory = ["MEMBER", "CHAIRMAN", "EX-OFFICIO"];
      memberCatgory.forEach((CATEGORY) => {
        if (
          this.attendanceDetails[CATEGORY] &&
          this.attendanceDetails[CATEGORY].length !== 0
        ) {
          this.attendanceDetails[CATEGORY].forEach((member) => {
            if (committeeIds.includes(member.committeeId)) {
              if (!this.committeWiseAttendance[member.committeeId][CATEGORY]) {
                this.committeWiseAttendance[member.committeeId][CATEGORY] = [];
              }
              this.committeWiseAttendance[member.committeeId][CATEGORY].push(
                member
              );
            }
          });
        }
      });
      // console.log(this.committeWiseAttendance);
      // this.groupBy(this.minuteContents.attendees, 'committeeId')
    }
  }
  groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, {});
  }
}
