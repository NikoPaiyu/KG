import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { CommitteeService } from "../../shared/services/committee.service";
import { CommitteecommonService } from "../../shared/services/committeecommon.service";
import { FileServiceService } from "../../shared/services/file-service.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzCascaderOption } from "ng-zorro-antd/cascader";
import { flatten } from "@angular/compiler";
@Component({
  selector: "committee-meeting-view",
  templateUrl: "./meeting-view.component.html",
  styleUrls: ["./meeting-view.component.scss"],
})
export class MeetingViewComponent implements OnInit {
  meetingId: any = null;
  meetingDetails: any = null;
  @Input() isFileView = false;
  @Input() fileMeetingDetails: any;
  @Input() meetingid;
  today: any = new Date();
  user;
  CommitteeMeetingNoticeModel = false;
  meetingNoticeTitle = "";
  isMeetingLetter = false;
  isMeetingNotice = false;
  SupportingDocModel = false;
  supportDocTitle = "";
  viewLink = false;
  editMode = false;
  validateForm: FormGroup;
  typesofVenues: any;
  fileStatus: any;
  fileId: any;
  assignee: any;
  @Output() updatedMeeting = new EventEmitter<any>();
  @Output() updateConsent = new EventEmitter<any>();
  permissions: any = {
    fullEdit: false,
    chairmanEdit: false,
    requestConsent: false,
    endMeeting: false,
  };
  showMeetingPopup = false;
  meetingCompleted = false;
  typesofAgenda: any = [];
  temptypesofAgenda: any = [];
  selectedCommittee: any = [];
  selectedAgendas: any = [];
  buttons: any = {
    staffAllocation: false,
    supprtingDocs: false,
    questionairre: false,
  };
  specialMemberList: any = [];
  viewConsemtMembers = false;
  isRequestConsent = true;
  isConsentRequest = false;
  giveConsentForm: FormGroup;
  sessionTime;
  consentStatus = "";
  markattendence = false;
  listOfDatas: any = [];
  attEdit = false;
  checked = false;
  // for LS Staff
  cascaderValues: string[] | null = null;
  selectedUser: any = null;
  sectionList: any = [];
  designationList: any[];
  userList: any = [];
  selectedLSUsers: any = [];
  selectedDUsers: any = [];
  deptUsername: any = null;
  deptDesignation: any = null;
  deptDepartment: any = null;
  constructor(
    private route: ActivatedRoute,
    private committeeService: CommitteeService,
    private router: Router,
    private notification: NzNotificationService,
    private activeRoute: ActivatedRoute,
    @Inject("authService") private AuthService,
    public common: CommitteecommonService,
    private fileService: FileServiceService,
    private fb: FormBuilder
  ) {
    if (!this.isFileView) {
      this.meetingId = this.route.snapshot.params.id;
    }
    this.user = AuthService.getCurrentUser();
    this.common.setCommitteePermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.formValidation();
    this.formvalidation();
    this.loadPermissions();
    // this.loadAllSections();
    this.loadAllSessionsInvolved();
    this.loadAllDesignations();
    if (this.meetingId && !this.isFileView) {
      this.getMeetingDetails();
    } else if (this.isFileView) {
      this.meetingDetails = this.fileMeetingDetails;
      // if (this.meetingDetails.consents.length > 0) {
      //   this.isRequestConsent = false;
      // }
      this.getFilePool();
      this.setFormValues();
    }
  }

  formValidation(): void {
    this.validateForm = this.fb.group({
      agendaTypeArray: this.fb.array([this.initAgendaArray()]),
      addCommitte: [null],
      meetingTittle: [null, [Validators.required]],
      meetingAgenda: [null, [Validators.required]],
      venueType: [null],
      checked: [false, [Validators.required]],
      sessionType: [null],
      reportDate: [null],
      sessionDate: [null],
      sessionTime: [null],
      endTime: [null],
    });
  }

  initAgendaArray() {
    return this.fb.group({
      agendatype: this.fb.control(null, Validators.required),
      billtype: this.fb.control(null, Validators.required),
      businessListing: this.fb.control([]),
      tempBusinessListing: this.fb.control([]),
      selectedBusiness: this.fb.control([]),
    });
  }

  getMeetingDetails() {
    this.committeeService
      .getMeetingById(this.meetingId)
      .subscribe((res: any) => {
        this.meetingDetails = res;
        this.setFormValues();
        if (this.meetingDetails.fileNumber) {
          this.getFilePool();
        }
        if (
          differenceInCalendarDays(
            parseISO(this.meetingDetails.date),
            this.today
          ) <= 0
        ) {
          this.meetingCompleted = true;
        }
        if (this.meetingDetails.type === "EVIDENCE_TAKING") {
          this.showButtons();
        }
        this.meetingDetails.consents.forEach((element) => {
          element.members.forEach((data) => {
            if (data.member.userId === this.user.userId) {
              this.consentStatus = data.status;
            }
          });
        });
        this.typeAgenda();
        this.typesofVenue();
        this.setFormValues();
      });
  }

  setFormValues() {
    this.validateForm.patchValue({
      meetingAgenda: this.meetingDetails.agendaDescription,
      meetingTittle: this.meetingDetails.title,
      sessionType: this.meetingDetails.occasion,
      venueType: this.meetingDetails.venue
        ? this.meetingDetails.venue.id
        : null,
      checked: this.meetingDetails.isJointMeeting,
    });
    if (this.meetingDetails.reportdate) {
      this.validateForm.patchValue({
        reportDate: parseISO(this.meetingDetails.reportdate),
      });
    }
    if (this.meetingDetails.date) {
      this.validateForm.patchValue({
        sessionDate: parseISO(this.meetingDetails.date),
      });
    }
    if (this.meetingDetails.time) {
      this.validateForm.patchValue({
        sessionTime: parseISO(this.meetingDetails.time),
      });
    }
  }

  getFilePool() {
    this.fileService
      .getFileById(this.meetingDetails.fileId, this.user.userId)
      .subscribe((Response: any) => {
        this.fileStatus = Response.fileResponse.status;
        this.fileId = Response.fileResponse.fileId;
        if (Response.fileResponse) {
          this.setMadatoryValidations(Response.fileResponse);
        }
        this.fileService
          .checkWorkFlowStatus(Response.fileResponse.workflowId)
          .subscribe((Res: any) => {
            const current = Res[Res.length - 1];
            this.assignee = current.assignee;
          });
      });
  }
  setMadatoryValidations(fileResponse) {
    if (
      fileResponse.activeSubTypes &&
      fileResponse.activeSubTypes.includes("COMMITTEE_MEETING")
    ) {
      if (this.permissions.chairmanEdit) {
        this.validateForm
          .get("sessionType")
          .setValidators([Validators.required]);
        // this.validateForm.get('venueType').setValidators([Validators.required]);
        this.validateForm
          .get("sessionTime")
          .setValidators([Validators.required]);
        this.validateForm
          .get("sessionDate")
          .setValidators([Validators.required]);
      }
    } else if (
      fileResponse.activeSubTypes &&
      fileResponse.activeSubTypes.includes("MEETING_DETAIL")
    ) {
      this.validateForm.get("sessionType").setValidators([Validators.required]);
      this.validateForm.get("venueType").setValidators([Validators.required]);
      this.validateForm.get("sessionTime").setValidators([Validators.required]);
      this.validateForm.get("sessionDate").setValidators([Validators.required]);
    }
  }
  goToMinutes() {
    if (this.meetingDetails.fileNumber == null) {
      this.notification.warning(
        "Sorry",
        "Can't do it now ....Please attach Meeting to File!"
      );
    } else if (this.fileStatus !== "APPROVED") {
      this.notification.warning(
        "Warning",
        "Cannot create now as the file is under approval flow"
      );
    } else {
      this.router.navigate(["create-minute"], {
        relativeTo: this.activeRoute.parent,
        state: {
          fileId: this.meetingDetails.fileId,
          fileNumber: this.meetingDetails.fileNumber,
          meetingId: this.meetingId,
          title: this.meetingDetails.title,
          committee: this.meetingDetails.committee.find(
            (x) => x.parentCommittee === true
          ),
          meeting: this.meetingDetails,
        },
      });
    }
  }

  goToMinuteView() {
    this.router.navigate(["minute-view", this.meetingId], {
      relativeTo: this.activeRoute.parent,
    });
  }

  gotoSpecialInvitee(purpose) {
    // if(this.meetingDetails.fileId == "" || this.meetingDetails.fileNumber ==null ){
    //   this.notification.warning("Sorry","Can't do it now ....Please attach Meeting to File!");
    //   return;
    // }
    this.router.navigate([
      "/business-dashboard/committee/invitee",
      purpose,
      this.meetingId,
    ]);
  }
  gotoStaffAllocation(purpose) {
    if (
      this.meetingDetails.fileId == "" ||
      this.meetingDetails.fileNumber == null
    ) {
      this.notification.warning(
        "Sorry",
        "Can't do it now ....Please attach Meeting to File!"
      );
      return;
    }
    this.router.navigate([
      "/business-dashboard/committee/staff-allocation",
      purpose,
      this.meetingId,
    ]);
  }

  showMinuteButton() {
    if (this.meetingDetails) {
      return (
        differenceInCalendarDays(
          parseISO(this.meetingDetails.date),
          this.today
        ) <= 0
      );
    }
  }
  viewLinks() {
    this.viewLink = !this.viewLink;
  }
  createQuestionnaire() {
    if (
      this.meetingDetails.fileId == "" ||
      this.meetingDetails.fileNumber == null
    ) {
      this.notification.warning(
        "Sorry",
        "Can not done now...Please attach Meeting to File!"
      );
    } else if (this.fileStatus !== "APPROVED") {
      this.notification.success(
        "Warning",
        "Cannot create now as the file is under approval flow"
      );
    } else {
      this.router.navigate(["create-questionnaire"], {
        relativeTo: this.route.parent,
        state: {
          meetingId: this.meetingId,
          title: this.meetingDetails.title,
          date: this.meetingDetails.date,
          fileId: this.meetingDetails.fileId,
          fileNumber: this.meetingDetails.fileNumber,
        },
      });
    }
  }

  showCommitteeMeetingNotice(action) {
    if (this.checkFileStatus()) {
      this.CommitteeMeetingNoticeModel = action;
      this.isMeetingNotice = true;
      this.isMeetingLetter = false;
    }
  }
  showCommitteeMeetingLetter(action) {
    if (this.checkFileStatus()) {
      this.CommitteeMeetingNoticeModel = action;
      this.isMeetingLetter = true;
      this.isMeetingNotice = false;
    }
  }
  createCommitteeMeetingNoticeorLetter(type) {
    this.fileService
      .getFileById(this.meetingDetails.fileId, this.user.userId)
      .subscribe((res: any) => {
        if (res.fileResponse.status == "APPROVED") {
          let body = {
            meetingId: this.meetingId,
            correspondenceId: null,
            title: this.meetingNoticeTitle,
          };

          if (type == "notice") {
            this.committeeService
              .createMeetingNotice(body)
              .subscribe((Response) => {
                this.notification.success("Success", "Success");
                this.showCommitteeMeetingNotice(false);
                this.router.navigate([
                  "business-dashboard/committee/file-view/",
                  this.meetingDetails.fileId,
                ]);
              });
          } else {
            this.committeeService
              .createMeetingLetter(body)
              .subscribe((Response) => {
                this.notification.success("Success", "Success");
                this.showCommitteeMeetingNotice(false);
                this.router.navigate([
                  "business-dashboard/committee/file-view/",
                  this.meetingDetails.fileId,
                ]);
              });
          }
        } else {
          this.notification.warning(
            "Sorry..",
            "Can't do it now ....File is under Flow"
          );
        }
      });
  }
  checkFileStatus() {
    let fileStatus = true;
    if (
      this.meetingDetails.fileId == "" ||
      this.meetingDetails.fileNumber == null
    ) {
      this.notification.warning(
        "Sorry",
        "Can't do it now .....Please attach Meeting to File!"
      );
      fileStatus = false;
    } else {
      fileStatus = true;
    }
    return fileStatus;
  }
  goback() {
    window.history.back();
  }
  viewCommitteeMeetingNoticeorLetter(meetingDetails, category) {
    let corresId;
    let fileId;
    if (category == "letter") {
      corresId = meetingDetails.meetingLetter.correspondenceId;
      fileId = meetingDetails.meetingLetter.fileId;
    } else {
      corresId = meetingDetails.meetingNotice[0].correspondenceId;
      fileId = meetingDetails.meetingNotice[0].fileId;
    }
    if (corresId) {
      this.router.navigate([
        "business-dashboard/correspondence/correspondence",
        "view",
        corresId,
      ]);
    } else {
      this.router.navigate(["business-dashboard/committee/file-view/", fileId]);
    }
  }
  showSupportingDoc(action) {
    if (this.checkFileStatus()) {
      this.SupportingDocModel = action;
    }
  }
  createLetterForSupportDoc() {
    this.fileService
      .getFileById(this.meetingDetails.fileId, this.user.userId)
      .subscribe((res: any) => {
        if (res.fileResponse.status == "APPROVED") {
          let body = {
            meetingId: this.meetingId,
            correspondenceId: null,
            title: this.supportDocTitle,
          };
          this.committeeService
            .createSupportingDoc(body)
            .subscribe((Response) => {
              this.notification.success("Success", "Success");
              this.showCommitteeMeetingNotice(false);
              this.router.navigate([
                "business-dashboard/committee/file-view/",
                this.meetingDetails.fileId,
              ]);
            });
        }
      });
  }
  isMeetingStarted() {
    let started = false;
    let today = new Date();
    const curdate = today.toISOString().split("T")[0];
    const meetigDate = new Date(this.meetingDetails.date)
      .toISOString()
      .split("T")[0];

    const getTime = (time) =>
      new Date(2019, 9, 2, time.substring(0, 2), time.substring(3, 5), 0, 0);
    const curtime =
      this.addZero(today.getHours()) + ":" + this.addZero(today.getMinutes());
    var meetingTime = new Date(this.meetingDetails.time);
    meetingTime.setMinutes(meetingTime.getMinutes() + 10); // 10 minutes added to meeting time

    const meetTime =
      this.addZero(meetingTime.getHours()) +
      ":" +
      this.addZero(meetingTime.getMinutes());

    if (meetigDate <= curdate) {
      if (getTime(curtime) >= getTime(meetTime)) {
        started = true;
      }
    }
    return started;
  }
  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  endMeeting() {
    if (!this.meetingDetails.attendenceMarked) {
      this.notification.warning("Warning", "Please Mark Attendance!");
      return;
    }
    this.validateForm.patchValue({
      endTime: new Date(),
    });
    this.updateMeet();
  }
  gotoBillView(id) {
    // this.router.navigate([
    //   "business-dashboard/bill/add-clauses",id
    // ]);
  }
  createSuggestions(businessId, subagenda) {
    if (this.checkFileStatus()) {
      this.router.navigate(
        ["business-dashboard/committee/add-clauses", businessId],
        {
          state: {
            meetingInfo: this.meetingDetails,
            subagenda: subagenda,
          },
        }
      );
    }
  }

  edit() {
    this.typeAgenda();
    this.typesofVenue();
    this.setFormValues();
    this.editMode = !this.editMode;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  typeAgenda() {
    this.committeeService.agendaType().subscribe((Response) => {
      this.typesofAgenda = Response;
      this.temptypesofAgenda = Response;
      this.setAgendaFormArrayValues();
    });
  }

  typesofVenue() {
    this.committeeService.venueType().subscribe((Response) => {
      this.typesofVenues = Response;
    });
  }

  updateMeet() {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    debugger;
    if (this.validateForm.valid) {
      const busIds = [];
      const committees = [];
      this.meetingDetails.committee.forEach((element) => {
        committees.push({
          id: element.id,
          parentCommittee: element.parentCommittee,
          operationType: "",
          metCommitteeId: element.metCommitteeId,
        });
      });
      const subAgendaArray = [];
      this.meetingDetails.subAgenda.forEach((x) => {
        const subAgendaBusinessArray = [];
        x.subAgendaBusiness.forEach((y) => {
          subAgendaBusinessArray.push({
            id: y.id,
            businessId: y.businessId,
            businessNumber: y.businessNumber,
            businessTitle: y.businessTitle,
            operationType: "",
            forwardedBusinessId: y.forwardedBusinessId,
          });
          busIds.push(y.id);
        });
        subAgendaArray.push({
          agendaType: {
            id: x.agendaType.id,
          },
          subAgendaBusiness: subAgendaBusinessArray,
          id: x.id,
          operationType: "",
        });
      });
      const body = {
        agendaDescription: this.validateForm.value.meetingAgenda,
        committee: committees,
        date: this.validateForm.value.sessionDate,
        id: this.meetingDetails.id,
        isJointMeeting: this.validateForm.value.checked,
        occasion: this.validateForm.value.sessionType,
        reportdate: this.validateForm.value.reportDate,
        subAgenda: subAgendaArray,
        time: this.validateForm.value.sessionTime,
        title: this.validateForm.value.meetingTittle,
        venue: {
          id: this.validateForm.value.venueType,
        },
        endTime: this.validateForm.value.endTime,
      };

      this.committeeService.updateMeeting(body).subscribe((Response) => {
        this.notification.create(
          "success",
          "Success",
          "Meeting Updated Successfully!"
        );
        this.editMode = false;
        if (this.isFileView) {
          this.updatedMeeting.emit();
        } else {
          this.getMeetingDetails();
        }
      });
    } else {
      this.notification.create(
        "warning",
        "Warning",
        "Please fill in the required fields!"
      );
    }
  }

  viewQuestionnaire(id) {
    this.router.navigate([
      "business-dashboard/committee/questionnaire-view/",
      id,
    ]);
  }

  loadPermissions() {
    if (this.common.doIHaveAnAccess("MEETING_FULL_EDIT", "UPDATE")) {
      this.permissions.fullEdit = true;
    }
    if (this.common.doIHaveAnAccess("MEETING_CHAIRMAN_EDIT", "UPDATE")) {
      this.permissions.chairmanEdit = true;
    }
    if (this.common.doIHaveAnAccess("REQUEST_CONSENT", "CREATE")) {
      this.permissions.requestConsent = true;
    }
    if (this.common.doIHaveAnAccess("END_MEETING", "UPDATE")) {
      this.permissions.endMeeting = true;
    }
  }

  creatFollowUpMeeting() {
    if (this.fileStatus !== "APPROVED") {
      this.notification.success(
        "Warning",
        "Cannot create now as the file is under approval flow"
      );
    } else {
      this.showMeetingPopup = true;
    }
  }

  closeMeetingPopup() {
    this.showMeetingPopup = false;
  }

  resubmitFile(id, activesubtype) {
    const fileReqbody = {
      meetingId: id,
      fileForm: {
        activeSubTypes: [activesubtype],
        fileId: this.meetingDetails.fileId,
        subtype: "COMMITTEE_MEETING",
        type: "COMMITTEE_MEETING",
        userId: this.user.userId,
      },
    };
    this.fileService.reSubmitFile(fileReqbody).subscribe((Res: any) => {
      this.notification.success("Success", "Attached to File Successfully");
      this.router.navigate([
        "business-dashboard/committee/file-view/",
        this.meetingDetails.fileId,
      ]);
    });
  }

  get formArr() {
    return this.validateForm.get("agendaTypeArray") as FormArray;
  }

  addAgendaType() {
    this.formArr.push(this.initAgendaArray());
  }

  filterBills(i) {
    if (
      this.formArr.controls[i].value.selectedBusiness.length > 0 &&
      this.formArr.controls[i].value.selectedBusiness[0].joinCommittes.length >
        0
    ) {
      this.validateForm.patchValue({
        checked: true,
      });
    } else {
      this.validateForm.patchValue({
        checked: false,
      });
    }
    this.selectedCommittee = [];
    if (this.formArr.controls[i].value.selectedBusiness.length > 0) {
      this.selectedCommittee.push(
        this.formArr.controls[i].value.selectedBusiness[0].parentCommittee
      );
      if (
        this.formArr.controls[i].value.selectedBusiness[0].joinCommittes
          .length > 0
      ) {
        this.formArr.controls[
          i
        ].value.selectedBusiness[0].joinCommittes.forEach((element) => {
          this.selectedCommittee.push(element);
        });
      }
    }

    this.formArr.controls[i].get("billtype").reset();
    this.getListOfBusiness(
      this.formArr.controls[i].value.agendatype,
      this.selectedCommittee.map((x) => x.id),
      i
    );
  }

  setAgendaFormArrayValues() {
    this.meetingDetails.subAgenda.forEach((x, i) => {
      if (i > 0) {
        this.addAgendaType();
      }
      this.formArr.controls[i].patchValue({
        agendatype: x.agendaType.id,
      });
      x.subAgendaBusiness.forEach((y) => {
        this.formArr.controls[i].value.selectedBusiness.push({
          refernceTitle: y.businessTitle,
          parentCommitteeId: this.meetingDetails.committee.find(
            (a) => a.parentCommittee === true
          ).id,
          parentCommittee: this.meetingDetails.committee.find(
            (a) => a.parentCommittee === true
          ),
          joinCommittes: this.meetingDetails.committee.filter(
            (a) => a.parentCommittee === false
          ),
          refrenceId: y.businessId,
          refrenceNumber: y.businessNumber,
          id: y.forwardedBusiness.id,
          operationType: "",
          existing: true,
        });
      });
      if (this.formArr.controls[i].value.selectedBusiness.length > 0) {
        this.formArr.controls[i].get("billtype").clearValidators();
      }
      this.filterBills(i);
    });
    this.filterAgendaType();
  }

  getListOfBusiness(agendaId, committeeId, i) {
    this.formArr.controls[i].value.businessListing = this.formArr.controls[
      i
    ].value.tempBusinessListing = [];
    const body = {
      agendaIds: [agendaId],
      committeeIds: committeeId,
      status: ["ASSIGEND"],
    };
    this.committeeService.getAllBusiness(body).subscribe((res: any) => {
      this.formArr.controls[i].value.businessListing = res;
      this.formArr.controls[i].value.tempBusinessListing =
        this.formArr.controls[i].value.businessListing;
      if (
        this.formArr.controls[i].value.selectedBusiness &&
        this.formArr.controls[i].value.selectedBusiness.length > 0
      ) {
        const tempIds = this.formArr.controls[i].value.selectedBusiness.map(
          (x) => x.id
        );
        const parentCommittee = this.selectedCommittee[0].id;
        let jointIds = [];
        this.selectedCommittee.forEach((element, index) => {
          if (index > 0) {
            jointIds.push(element.id);
          }
        });
        this.formArr.controls[i].value.businessListing = this.formArr.controls[
          i
        ].value.tempBusinessListing.filter((element) => {
          const a = element.joinCommittes.map((x) => x.id).sort();
          jointIds = jointIds.sort();
          let temp;
          if (JSON.stringify(a) === JSON.stringify(jointIds)) {
            temp = true;
          } else {
            temp = false;
          }
          if (
            !tempIds.includes(element.id) &&
            element.parentCommitteeId === parentCommittee &&
            temp
          ) {
            return true;
          } else {
            return false;
          }
        });
      }
    });
  }

  filterAgendaType() {
    this.selectedAgendas = [];
    this.validateForm.value.agendaTypeArray.forEach((x) => {
      if (x.agendatype) {
        this.selectedAgendas.push(x.agendatype);
      }
    });
  }

  removeAgendaType(i) {
    this.formArr.removeAt(i);
  }

  addBill(i) {
    this.formArr.controls[i].value.selectedBusiness.push(
      this.formArr.controls[i].value.billtype
    );
    this.filterBills(i);
    this.formArr.controls[i].get("billtype").clearValidators();
  }

  removeBill(id, i) {
    const removedBill = this.formArr.controls[i].value.selectedBusiness.find(
      (element) => element.id === id
    );
    if (removedBill.existing) {
      this.formArr.controls[i].value.selectedBusiness.find(
        (element) => element.id === id
      ).operationType = "DELETE";
    } else {
      this.formArr.controls[i].value.selectedBusiness.splice(
        this.formArr.controls[i].value.selectedBusiness.indexOf(removedBill),
        1
      );
    }
    if (
      this.formArr.controls[i].value.selectedBusiness.length === 0 ||
      !this.formArr.controls[i].value.selectedBusiness
        .map((x) => x.operationType)
        .includes("")
    ) {
      this.formArr.controls[i]
        .get("billtype")
        .setValidators([Validators.required]);
    }
    this.filterBills(i);
  }

  showButtons() {
    if (
      this.meetingDetails.staffAllocationId &&
      !this.meetingDetails.supportingDocumentLetter
    ) {
      this.buttons.supprtingDocs = true;
    }
    if (this.meetingDetails.supportingDocumentLetter) {
      this.buttons.questionairre = true;
    }
    // this.buttons.questionairre = true;
  }

  showConsentPopup() {
    this.getSpecialMemberInMeeting();
  }
  handlePreviewCancel() {
    this.viewConsemtMembers = false;
  }
  getSpecialMemberInMeeting() {
    this.committeeService
      .getSpecialMemberInMeeting(this.meetingid)
      .subscribe((Res) => {
        this.specialMemberList = Res;
        if (Res) {
          this.viewConsemtMembers = true;
        }
      });
  }
  requestConsent() {
    this.committeeService
      .requestConsent(this.meetingid, this.specialMemberList)
      .subscribe((res) => {
        if (res) {
          this.notification.create(
            "Success",
            "Success",
            "Consent Requested Seccessfully"
          );
          this.viewConsemtMembers = false;
          this.updatedMeeting.emit(this.fileId);
          this.updateConsent.emit(this.meetingDetails);
          // if(this.meetingDetails.consents.length > 0){
          //   this.isRequestConsent= false;
          // }
        }
      });
  }

  giveConsentPopup() {
    if (this.meetingDetails.date) {
      this.giveConsentForm.patchValue({
        consentDate: parseISO(this.meetingDetails.date),
      });
    }
    if (this.meetingDetails.time) {
      this.giveConsentForm.patchValue({
        consentTime: parseISO(this.meetingDetails.time),
      });
    }
    this.isConsentRequest = true;
  }
  cancelConsent() {
    this.isConsentRequest = false;
  }
  giveConsent() {
    if (this.giveConsentForm.valid) {
      let body = {
        date: this.giveConsentForm.value.consentDate,
        time: this.giveConsentForm.value.consentTime,
      };
      this.committeeService
        .giveConsent(this.meetingId, body)
        .subscribe((Res) => {
          if (Res) {
            this.notification.create(
              "success",
              "Success",
              "Consent Send succesfully"
            );
            this.isConsentRequest = false;
            this.getMeetingDetails();
          }
        });
    }
  }
  formvalidation() {
    this.giveConsentForm = this.fb.group({
      consentDate: [null, [Validators.required]],
      consentTime: [null, [Validators.required]],
    });
  }

  showAttendenceModal() {
    if (!this.meetingDetails.attendenceMarked) {
      if (this.fileStatus !== "APPROVED") {
        this.notification.success(
          "Warning",
          "Cannot create now as the file is under approval flow"
        );
      } else {
        this.populateAttendenceData();
        this.markattendence = !this.markattendence;
      }
    } else {
      this.getAttendence();
      this.markattendence = !this.markattendence;
    }
  }

  handleCancel() {}

  handleOk(isEdit) {
    if (this.checkSelected()) {
      const llistodDatas = this.listOfDatas;
      const selectedLegSecU = this.selectedLSUsers.map((m) => {
        llistodDatas.push({
          id: null,
          meetingId: null,
          userId: m.userId,
          userName: m.userName,
          firstName: null,
          lastName: null,
          present: true,
          distance: null,
          status: null,
          userRole: m.userRole,
          group: m.group,
          designation: m.designation,
        });
      });

      this.selectedDUsers.map((m) => {
        llistodDatas.push(m);
      });

      this.committeeService
        .markAttendence(llistodDatas, this.meetingId)
        .subscribe((res: any) => {
          this.notification.success(
            "Success",
            "Attendence Marked Successfully"
          );
          if (!isEdit) {
            this.resubmitFile(this.meetingId, "MEETING_ATTENDANCE");
            this.getMeetingDetails();
            this.markattendence = !this.markattendence;
          } else {
            this.attEdit = false;
            this.getAttendence();
          }
        });
    } else {
      this.notification.warning("Warning", "Please select at least one person");
    }
  }

  populateAttendenceData() {
    this.committeeService
      .populateMembersInMeeting(this.meetingId)
      .subscribe((res: any) => {
        this.listOfDatas = res;
        this.listOfDatas.forEach((element) => {
          element.present = false;
        });
      });
  }

  getAttendence() {
    this.committeeService
      .getAttendence(this.meetingId)
      .subscribe((res: any) => {
        this.listOfDatas = res;
        this.checked = this.listOfDatas.every((item) => item.present === true);
        this.selectedLSUsers = res.filter((f) => f.userRole === "SECTION");
        this.selectedDUsers = res.filter((f) => f.userRole === "DEPARTMENT");
      });
  }

  editAttendence() {
    this.attEdit = true;
  }

  cancelEditAttendence() {
    this.attEdit = false;
    this.getAttendence();
  }

  checkSelected() {
    if (this.listOfDatas.find((x) => x.present === true)) {
      return true;
    } else {
      return false;
    }
  }

  checkAllRows() {
    if (this.checked) {
      this.listOfDatas.forEach((item) => (item.present = true));
    } else {
      this.listOfDatas.forEach((item) => (item.present = false));
    }
  }
  loadAllSessionsInvolved() {
    this.committeeService
      .getAllSectionInvolved(this.meetingId)
      .subscribe((res) => {
        this.sectionList = res;
      });
  }
  // loadAllSections() {
  //   this.common.getAllSections().subscribe((res) => {
  //     this.sectionList = res;
  //   });
  // }
  loadAllDesignations() {
    this.common.getDesignation().subscribe((res) => {
      this.designationList = res.filter((f) => f.klaDesignationId < 8);
    });
  }
  onChanges(values: string[]): void {
    this.selectedUser = null;
    this.userList = [];

    if (values[1]) {
      let kladesignationSelected = this.designationList.find(
        (d) => d.klaDesignationId === parseInt(values[2])
      );
      let data = {
        klaDesignatoinId: values[1][0],
        kladesignationCode: values[1][1],
        klaSectionId: values[0].toString(),
      };
      this.common.getAllNonMemberUsers(data).subscribe((res) => {
        res.map((item) => {
          this.userList.push({
            userId: item.userId,
            userName: item.details.fullName,
            userRole: "SECTION",
            group: item.roles[0].displayRoleName,
            designation: values[1][1],
          });
        });
      });
    }
  }
  /** load data async execute by `nzLoadData` method (Cascader)*/
  loadData = (node: NzCascaderOption, index: number): PromiseLike<void> => {
    this.selectedUser = null;

    this.userList = [];
    return new Promise((resolve) => {
      // setTimeout(() => {
      if (index < 0) {
        let result = this.sectionList.map((m) => ({
          value: m.klaSectionId,
          label: m.klaSectionName,
        }));

        node.children = result;
      } else if (index == 0) {
        let result = this.designationList.map((m) => ({
          value: [m.klaDesignationId, m.code],
          label: m.klaDesignationName,
          isLeaf: true,
        }));
        node.children = result;
      }

      resolve();
      // }, 1000);
    });
  };
  selectUser(Id) {
    if (Id) {
      let usr = this.userList.find((d) => d.userId === parseInt(Id));

      if (
        !this.selectedLSUsers.some((code) => code.userId === parseInt(Id)) &&
        usr
      ) {
        this.selectedLSUsers.push(usr);
      }
    }
  }
  handleSelectedUserClose(id) {
    this.selectedLSUsers = this.selectedLSUsers.filter((d) => d.userId !== id);
    this.selectedUser = null;
  }
  selectDeptUser() {
    this.selectedDUsers.push({
      id: null,
      meetingId: null,
      userId: null,
      userName: this.deptUsername,
      firstName: null,
      lastName: null,
      present: true,
      distance: null,
      status: null,
      userRole: "DEPARTMENT",
      group: this.deptDepartment,
      designation: this.deptDesignation,
    });
    this.deptUsername = "";
    this.deptDepartment = "";
    this.deptDesignation = "";
  }
  removeDeptUser(dat) {
    this.selectedDUsers = this.selectedDUsers.filter((d) => d !== dat);
  }
}
