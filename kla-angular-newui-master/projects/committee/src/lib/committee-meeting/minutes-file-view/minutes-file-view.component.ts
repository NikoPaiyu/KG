import {
  Component,
  Input,
  OnInit,
  Inject,
  EventEmitter,
  Output,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { CommitteeService } from "../../shared/services/committee.service";
import { FileServiceService } from "../../shared/services/file-service.service";

@Component({
  selector: "committee-minutes-file-view",
  templateUrl: "./minutes-file-view.component.html",
  styleUrls: ["./minutes-file-view.component.scss"],
})
export class MinutesFileViewComponent implements OnInit {
  activeSession: any;
  @Input() minutes: any;
  @Input() isFileView = false;
  @Input() meetingId = null;
  editMode = false;
  user: any;
  assignee: any;
  minuteBodyForm: FormGroup;
  @Output() updatedMinutes = new EventEmitter<any>();
  @Input() isPreview = false;
  attendanceDetails = {};
  committeWiseAttendance = {};
  constructor(
    public committeeService: CommitteeService,
    private route: ActivatedRoute,
    @Inject("authService") private AuthService,
    private fileService: FileServiceService,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {
    this.user = AuthService.getCurrentUser();
    if (!this.isFileView || !this.isPreview) {
      this.meetingId = this.route.snapshot.params.meetingId;
    }
  }

  ngOnInit() {
    this.validateDeptForm();
    // if (!this.isFileView && !this.isPreview) {
    //   this.getMinutesByMeetingId();
    // } else if (this.isFileView) {
    //   this.setFormData();
    //   this.getFilePool();
    // } else
    this.getMinutesByMeetingId();
    if (this.isPreview) {
      this.setAgendaArray();
      this.formatAttendanceData();
      console.log(this.minutes.deapartmentStaff);
    }
  }

  getMinutesByMeetingId() {
    this.committeeService
      .getMinutesByMeetingId(this.meetingId)
      .subscribe((Res) => {
        this.minutes = Res;
        this.getFilePool();
        this.setFormData();
      });
  }

  showEdit() {
    this.editMode = !this.editMode;
  }

  cancelEdit() {
    this.validateDeptForm();
    this.setFormData();
    this.showEdit();
  }

  getFilePool() {
    this.fileService
      .getFileById(this.minutes.fileId, this.user.userId)
      .subscribe((Response: any) => {
        this.fileService
          .checkWorkFlowStatus(Response.fileResponse.workflowId)
          .subscribe((Res: any) => {
            const current = Res[Res.length - 1];
            this.assignee = current.assignee;
          });
      });
  }

  validateDeptForm() {
    this.minuteBodyForm = this.fb.group({
      // staffArray: this.fb.array([]),
      subtitle: [null, Validators.required],
      agenda: this.fb.array([]),
    });
  }

  // initStaffArray() {
  //   return this.fb.group({
  //     staffDetail: this.fb.control(null, Validators.required),
  //   });
  // }

  // get formArr() {
  //   return this.minuteBodyForm.get('staffArray') as FormArray;
  // }

  get agendaArray(): FormArray {
    return this.minuteBodyForm.get("agenda") as FormArray;
  }

  // addStaff() {
  //   this.formArr.push(this.initStaffArray());
  // }

  // removeStaff(i) {
  //   this.formArr.removeAt(i);
  // }

  setFormData() {
    // this.minutes.deapartmentStaff.forEach((x) => {
    //   // this.formArr.push(this.fb.group({
    //   //   staffDetail: x,
    //   // }));
    // });
    this.minuteBodyForm.patchValue({
      subtitle: this.minutes.subtitle,
    });
    this.minutes.minutesDeatilResponse.forEach((a) => {
      const subAgenda = [];
      a.subAgendaBusiness.forEach((b) => {
        const suggestionArray = [];
        b.minutesDetailDto.addedSuggestions.forEach((c) => {
          c.clauseList.forEach((d) => {
            suggestionArray.push({
              id: d.id,
              content: d.content,
              memberName: d.memberName,
            });
          });
        });
        subAgenda.push(
          this.fb.group({
            id: b.id,
            title: [b.businessTitle],
            suggestions: [suggestionArray],
            description: b.minutesDetailDto.description[0],
            fileNumber: b.minutesDetailDto.refrenceFileNumber,
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
    this.formatAttendanceData();
  }

  updateMinutes() {
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
    const control1 = this.minuteBodyForm.get("agenda") as FormArray;
    // tslint:disable-next-line: forin
    for (const j in control1.controls) {
      const controlTwo = control1.controls[j] as FormGroup;
      // tslint:disable-next-line: forin
      for (const k in controlTwo.controls) {
        controlTwo.controls[k].markAsDirty();
        controlTwo.controls[k].updateValueAndValidity();
      }
    }

    if (this.minuteBodyForm.valid) {
      this.buildUpdateBody();
      this.committeeService
        .saveMinutes(this.buildUpdateBody())
        .subscribe((Res: any) => {
          this.notification.create(
            "success",
            "Success",
            "Minutes Updated Successfully!"
          );
          this.editMode = false;
          if (!this.isFileView) {
            this.getMinutesByMeetingId();
          } else {
            this.updatedMinutes.emit();
          }
        });
    }
  }

  buildUpdateBody() {
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
      id: this.minutes.id,
      meetingId: this.minutes.meetingId,
      fileId: this.minutes.fileId,
      fileNumber: this.minutes.fileNumber,
      title: this.minutes.title,
      subtitle: this.minuteBodyForm.value.subtitle,
      deapartmentStaff: staff,
      minutesDetailForm: minutesDetail,
    };
    return body;
  }

  setAgendaArray() {
    this.minutes.minutesDeatilResponse.forEach((a) => {
      const subAgenda = [];
      a.subagenda.forEach((b) => {
        const suggestionArray = [];
        b.suggestions.forEach((d) => {
          suggestionArray.push({ id: d.id, content: d.content });
        });
        subAgenda.push(
          this.fb.group({
            id: b.id,
            title: [b.title],
            suggestions: [suggestionArray],
            description: b.description,
            fileNumber: b.fileNumber,
          })
        );
      });
      this.agendaArray.push(
        this.fb.group({
          agendaType: [a.agendaType],
          subagenda: this.fb.array(subAgenda),
        })
      );
    });
  }
  formatAttendanceData() {
    let category = [];
    let committeeIds = [];
    if (this.minutes.attendees.length !== 0) {
      this.attendanceDetails = this.groupBy(this.minutes.attendees, "userRole");
      committeeIds = this.minutes.meetingMemberDto.map((x) => x.committeeId);
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
