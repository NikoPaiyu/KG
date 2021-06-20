import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';
import { CalenderofsittingService } from '../shared/services/calenderofsitting.service';
import { formatDate } from '@angular/common';
import { differenceInCalendarDays } from 'date-fns';
import {
  calendarOfDay,
  businessDetails,
} from '../shared/models/cobmodel';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
@Component({
  selector: 'app-add-calender',
  templateUrl: './add-calender.component.html',
  styleUrls: ['./add-calender.component.scss'],
})
export class AddCalenderComponent implements OnInit {
  @ViewChild('fullcalendar', { static: true })
  fullcalendar: FullCalendarComponent;
  isVisibleData = false;
  // restrict select yesterday
  today = new Date();
  select;
  // end
  selectedValue = new Date();
  calendarPlugins = [dayGridPlugin, interactionPlugin];

  public popoverTitle = 'Delete Confirmation';
  public popoverMessage = 'Are You Sure?';
  tempCos = {
    calendarOfDaysList: [],
  };
  calendarDaysId = null;
  assemblyList;
  calendarSittingId;
  sessionList;
  businessgroupList;
  dateFormat = 'dd / MM / yyyy';
  cosDetailsList = [];
  calendarGroupId = null;
  updateList: any[] = [];
  CobSaveModel = {};
  calendarOfDays: calendarOfDay[] = [];
  savCosModel = {};
  objbusinessDetails: businessDetails[] = [];
  public businessDetails = [];
  public businessDetails1 = [];
  showDeleteBtn = false;
  saveBtnText = 'Submit calender of sittings';
  dateRange = [];
  lobBusinessGroupId;
  flag = false;
  calenderflag = false;
  cosDetailsLists;
  listDataMap;
  userid;
  calenderOfDaysId;
  calendarBusinessGroupsId;
  isVisible = false;
  isOkLoading = false;
  validateForm: FormGroup;
  businessDetailsData = [];
  isOthers: boolean;
  dataBasedOnData: any;
  returnUrl = null;

  calendarEvents: any = [];
  tempCalendarEvents: any = [];
  parsedSessionId: any;
  parsedAssemblyId: any;
  disabledDate = (current: Date): boolean => {
    this.dateRange = this.dateRange.sort();
    const minData = this.dateRange[0];
    const maxData = this.dateRange[this.dateRange.length - 1];
    if (minData) {
      const mindate = new Date(minData);
      const date = new Date(maxData);
      const month = mindate.getMonth();
      const minoneDayBackwardCheck =
        differenceInCalendarDays(current, mindate) === -1;
      const maxoneDayForwardCheck =
        differenceInCalendarDays(current, date) === 1;
      const weekendcheck = !(current.getDay() === 0 || current.getDay() === 6);
      const dateExists = !this.dateRange.find(
        (x) => new Date(current) === new Date(x)
      );
      const missingDay =
        current.getTime() > mindate.getTime() &&
        current.getTime() < date.getTime() &&
        !dateExists;
      return !(
        (minoneDayBackwardCheck &&
          current.getMonth() === month &&
          weekendcheck) ||
        (maxoneDayForwardCheck && current.getMonth() === month && weekendcheck)
      );
    }
    return differenceInCalendarDays(current, this.today) < 0;
  }
  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }
  handleDateClick(detail) {
    console.log(detail);
  }

  constructor(
    private route: ActivatedRoute,
    public cobservice: CalenderofsittingService,
    public fb: FormBuilder,
    private notify: NotificationCustomService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cobservice
      .getCOSPermissions(this.auth.getCurrentUser().userId)
      .subscribe();
    const details = this.route.snapshot.params.details;
    if (details) {
      const data = JSON.parse(atob(details));
      if (data) {
        (this.parsedAssemblyId = data.assemblyId),
          (this.parsedSessionId = data.sessionId);
        this.returnUrl = data.returnUrl;
      }
    }
    this.getAssemblySessionDetails();
    this.getBusinessgroup();
    this.userid = this.auth.getCurrentUser().userId;

    this.validateForm = this.fb.group({
      calendarOfSittingId: [null],
      assembly: [null, [Validators.required]],
      sessionId: [null, [Validators.required]],
      dates: [null],
      radioValue: [null, [Validators.required]],
      selectedValue: [null],
      calenderOfDaysId: [null],
      agenda: this.fb.array([this.addAgendaFormGroup()]),
    });

    this.validateForm.get('assembly').valueChanges.subscribe(data => {
      const assemblyDetails = this.assemblyList.find(x => x.id === data);
      if (assemblyDetails) {
        this.sessionList = assemblyDetails.session;
        this.validateForm.get('sessionId').setValue(null);
        this.validateForm.get('sessionId').setErrors(null);
      }
    });

    if (this.parsedAssemblyId && this.parsedSessionId) {
      this.validateForm.get('assembly').setValue(this.parsedAssemblyId);
      this.validateForm.get('sessionId').setValue(this.parsedSessionId);
      this.validateForm.updateValueAndValidity();
      this.getCODDataList();
    }
  }
  backtoFile() {
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    }
  }

  showModal(result): void {
    (this.validateForm.get('agenda') as FormArray).clear();
    this.getBusinessByDate(result);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.clearVariables();
  }

  getControls() {
    this.validateForm.get('agenda').updateValueAndValidity();
    const data = (this.validateForm.get('agenda') as FormArray).controls;
    return data;
  }

  addAgendaClick() {
    (this.validateForm.get('agenda') as FormArray).push(
      this.addAgendaFormGroup()
    );
    this.isOthers = false;
  }

  addAgendaFormGroup(): FormGroup {
    return this.fb.group(
      {
        calendarBusinessGroupsId: [null],
        preTitleEng: [null],
        preTitleMal: [null],
        lobBusinessGroupId: [null, [Validators.required]],
        descriptionMal: [null],
        descriptionEng: [null],
        lobBusinessGroupName: [null],
        lobBusinessDescriptionMal: [null],
      },
      {
        validators: this.agendaValidator,
      }
    );
  }

  agendaValidator(group: FormGroup) {
    if (group.get('lobBusinessGroupId').value == 3) {
      if (group.get('descriptionMal').disabled) {
        group.get('descriptionMal').enable();
        group.get('descriptionEng').enable();
      }
      group.get('descriptionMal').setValidators([Validators.required]);
      group.get('descriptionEng').setValidators([Validators.required]);
    } else {
      if (group.get('descriptionMal').enabled) {
        group.get('descriptionMal').disable();
        group.get('descriptionEng').disable();
      }
      if (group.get('descriptionMal').value) {
        group.get('descriptionMal').setValue('');
      }
      if (group.get('descriptionEng').value) {
        group.get('descriptionEng').setValue('');
      }
    }
  }
  removeAgendaButtonClick(agendaGroupIndex: number): void {
    if (agendaGroupIndex > 0) {
      (this.validateForm.get('agenda') as FormArray).removeAt(agendaGroupIndex);
    }
    if (agendaGroupIndex === 0) {
      (this.validateForm.get('agenda') as FormArray).reset();
    }
  }

  submitForm(): void {
    if (this.validateForm.valid && this.dateRange.length > 0) {
      this.businessDetailsData = this.validateForm.value.agenda;
      this.businessDetailsData.forEach((element) => {
        this.businessDetails.push({
          preTitleEng: element.preTitleEng,
          preTitleMal: element.preTitleMal,
          calendarBusinessGroupsId: null,
          lobBusinessGroupId: element.lobBusinessGroupId,
          descriptionMal: element.descriptionEng,
          descriptionEng: element.descriptionMal,
        });
      });
      const data = {
        calendarOfSittingId: this.validateForm.value.calendarOfSittingId,
        questionDay: this.validateForm.value.radioValue,
        dateList: this.dateRange,
        assemblyId: this.validateForm.value.assembly,
        sessionId: this.validateForm.value.sessionId,
        businessDetails: this.validateForm.value.agenda,
        calenderOfDaysId: this.validateForm.value.calenderOfDaysId,
      };
      if (this.validateForm.value.calenderOfDaysId == null) {
        this.crdateCos(data);
      } else {
        this.updateCos(data);
      }
    } else {
      // tslint:disable-next-line: forin
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }
  crdateCos(data) {
    // console.log(this.validateForm.value.radioValue);
    this.cobservice.creatCos(data).subscribe((res: any) => {
      if (res) {
        this.cosDetailsList = res;
        this.clearVariables();
        this.isVisible = false;
        this.notify.showSuccess('Success', 'Successfully Added');
        this.getCODDataList();
        (this.validateForm.get('agenda') as FormArray).clear();
        (this.validateForm.get('agenda') as FormArray).reset();
        this.validateForm.get('');
      } else {
        this.notify.showError('Error', 'Something Went Wrong...');
      }
      (this.validateForm.get('agenda') as FormArray).clear();
    });
  }
  updateCos(data) {
    this.cobservice.updateCos(data).subscribe((res: any) => {
      if (res) {
        this.cosDetailsList = res;
        this.clearVariables();
        setTimeout(() => {
          this.isVisible = false;
        }, 3000);
        this.getCODDataList();
        this.notify.showSuccess('Success', 'Updated Successfully');
      } else {
        this.notify.showError('Error', 'Something Went Wrong...');
      }
      (this.validateForm.get('agenda') as FormArray).clear();
    });
    this.isVisible = false;
    this.getCODDataList();
  }

  calenderOnChange(result: Date): void {
    if (result != null) {
      console.log(result);
      const CurrentDate = formatDate(result, 'yyyy-MM-dd', 'en-US', '+0530');
      if (this.dateRange.indexOf(CurrentDate) < 0) {
        this.dateRange.push(CurrentDate);
      }
      this.validateForm.controls.dates.reset();
    }
  }
  selectDate(result): void {
    if (
      this.validateForm.get('assembly').value &&
      this.validateForm.get('sessionId').value
    ) {
      this.dateRange = [];
      if (result && result.dateStr) {
        this.showModal(result.dateStr);
        if (this.dateRange.indexOf(result.dateStr) < 0) {
          this.dateRange.push(result.dateStr);
        }
      }
    } else {
      this.notify.showError('Error', 'Please select Assembly and Session');
    }
  }
  getBusinessByDate(currentDate: string) {
    const assemblyId = this.validateForm.get('assembly').value;
    const sessionId = this.validateForm.get('sessionId').value;
    if (this.cobservice.doIHaveAnAccess('FILE', 'READ')) {
      if (assemblyId && sessionId) {
        this.validateForm.get('agenda').reset();
        this.cobservice
          .getBusinessByDate(currentDate, assemblyId, sessionId)
          .subscribe(
            (res) => {
              this.isVisible = true;
              this.dataBasedOnData = res;
              this.calendarDaysId = this.dataBasedOnData.calenderOfDaysId;
              if (this.dataBasedOnData) {
                if (
                  this.dataBasedOnData.businessDetails &&
                  this.dataBasedOnData.businessDetails.length > 0
                ) {
                  (this.validateForm.get('agenda') as FormArray).clear();
                  // tslint:disable-next-line: no-shadowed-variable
                  const businessDetails = this.dataBasedOnData.businessDetails;
                  if (businessDetails && businessDetails.length > 0) {
                    businessDetails.forEach((el) => {
                      const group = this.addAgendaFormGroup();
                      group.setValue(el);
                      (this.validateForm.get('agenda') as FormArray).push(
                        group
                      );
                    });
                  }
                  this.validateForm.get('agenda').updateValueAndValidity();
                } else {
                  (this.validateForm.get('agenda') as FormArray).clear();
                  const group = this.addAgendaFormGroup();
                  (this.validateForm.get('agenda') as FormArray).push(group);
                }
                if (
                  this.dataBasedOnData.dateList &&
                  this.dataBasedOnData.dateList.length > 0
                ) {
                  this.validateForm
                    .get('selectedValue')
                    .setValue(this.dataBasedOnData.dateList);
                  this.dateRange = this.dataBasedOnData.dateList;
                }
                this.validateForm
                  .get('radioValue')
                  .setValue(this.dataBasedOnData.questionDay);
                this.validateForm
                  .get('calenderOfDaysId')
                  .setValue(this.dataBasedOnData.calenderOfDaysId);
                this.validateForm
                  .get('calendarOfSittingId')
                  .setValue(this.dataBasedOnData.calendarOfSittingId);
              }
            },
            (error) => {
              this.isVisible = false;
              this.notify.showError(
                'Error',
                'cannot add business in this date'
              );
            }
          );
      } else {
        this.notify.showError('Error', 'select session and assembly first');
      }
    }
  }
  onSplice(index) {
    this.dateRange.splice(index, 1);
    if (this.updateList.length !== 0) {
      this.updateList.splice(index, 1);
    }
  }
  getAllAssembly() {
    this.cobservice.getAllAssembly().subscribe((res) => {
      this.assemblyList = res;
    });
  }

  getAllSessionList() {
    this.cobservice.getAllSession().subscribe((res) => {
      this.sessionList = res;
    });
  }
  getAssemblySessionDetails() {
    this.cobservice.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.assemblyList = this.assemblyList.filter(x => x.assemblyId >=  data.activeAssemblySession.assemblyValue);
    })
  }
  getBusinessgroup() {
    this.cobservice.getBusinessgroup().subscribe((res) => {
      this.businessgroupList = res;
    });
  }

  getCODDataList() {
    const today = new Date();
    this.getCobList(today);
  }

  getCobList(date) {
    const assemblyId = this.validateForm.get('assembly').value;
    const sessionId = this.validateForm.get('sessionId').value;
    if (assemblyId && sessionId) {
      this.cobservice
        .getCobList(assemblyId, sessionId)
        .subscribe((res: any) => {
          this.calendarEvents = res;
          if (this.calendarEvents && this.calendarEvents.length > 0) {
            const startDate = new Date(this.calendarEvents[0].start);
            const data = this.fullcalendar.getApi();
            data.gotoDate(startDate);
          }
          const array = this.calendarEvents.reduce((acc, element) => {
            acc[element.start] = acc[element.start] || [];
            acc[element.start].push(element.title);
            return acc;
          }, {});
          this.tempCalendarEvents = Object.keys(array).map((key) => {
            return { start: key, title: array[key] };
          });
          if (this.calendarEvents && this.calendarEvents.length > 0) {
            this.calendarSittingId = this.calendarEvents[0].calendarOfSittingId;
          }
        });
    }
  }

  changeEvent(event) {
    const date: Date = event.event._instance.range.start;
    if (date) {
      const dates = {
        dateStr: null,
      };
      const dateStr =
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2);
      dates.dateStr = dateStr;
      this.selectDate(dates);
    }
  }
  // file flow
  submitfile() {
    const fileflowdata = {
      calendarSittingId: this.calendarSittingId,
      fileForm: {
        assemblyId: this.validateForm.value.assembly,
        sessionId: this.validateForm.value.sessionId,
        type: 'COS',
        userId: this.userid,
        currentNumber: 0,
        sectionId: 1,
        subject: 'Calendar of Sitting',
        description: 'Calendar of Sitting ',
        subtype: 'COS',
        workflowEngineCode: 'CALENDAR_OF_SITTING_FLOW',
        priority: 'NORMAL',
      },
    };
    this.cobservice.createfileflow(fileflowdata).subscribe((Response) => {
      this.cosDetailsList = Response;
      this.notify.showSuccess(
        'Success',
        'Calendar of sittings submitted successfully'
      );
      this.router.navigate(['/business-dashboard/sitting/cos-list']);
    });
  }
  deleteParticularCosGroup() {
    this.cobservice
      .deleteCosPerticularGroup(
        this.calendarGroupId,
        this.validateForm.value.assembly,
        this.validateForm.value.sessionId
      )
      .subscribe((res: any) => {
        this.cosDetailsList = res;
        this.notify.showSuccess('Success', 'Deleted Succefully');
        this.clearVariables();
      });
  }
  clearVariables() {
    this.dateRange = [];
    this.calendarGroupId = null;
    this.updateList = [];
    this.validateForm.controls.calendarOfSittingId.reset();
    this.validateForm.controls.calenderOfDaysId.reset();
    this.validateForm.controls.dates.reset();
    this.validateForm.controls.radioValue.reset();
    this.validateForm.controls.agenda.reset();
    this.flag = false;
    //  this.saveBtnText = "Save";
    this.showDeleteBtn = false;
  }

  // set body for api create and update
  mapSubmitValue() {
    //   let ObjsaveCosModel = new saveCosModel();
    //   let objbusinessDetails=new businessDetails();
    //   this.calendarOfDays = [];
    //   this.savCosModel = {};
    //   //set data when create
    //   let index = 0;
    //   this.dateRange.forEach(objdates => {
    //     let objcalendarOfDay = new calendarOfDay();
    //     objcalendarOfDay.id =
    //       index < this.updateList.length ? this.updateList[index].id : null;
    //     objcalendarOfDay.date = objdates;
    //   //  objcalendarOfDay.preTitleEng=this.validateForm.value.preTitleEng;
    //  //   objcalendarOfDay.preTitleMal=this.validateForm.value.preTitleMal;
    //     objcalendarOfDay.descriptionEng = this.validateForm.value.agdEng;
    //     objcalendarOfDay.descriptionMal = this.validateForm.value.agdMal;
    //   //  objcalendarOfDay.lobBusinessGroupId=this.validateForm.value.id;
    //     objcalendarOfDay.assemblyId=this.validateForm.value.assemblyId;
    //     objcalendarOfDay.sessionId=this.validateForm.value.sessionId;
    //     this.calendarOfDays.push(objcalendarOfDay);
    //     index += 1;
    //   });
    const businessDetails = {
      sessionId: this.validateForm.value.sessionId,
      assemblyId: this.validateForm.value.assemblyId,
      preTitleEng: this.validateForm.value.preTitleEng,
      preTitleMal: this.validateForm.value.preTitleMal,
      calendarBusinessGroupsId: null,
      lobBusinessGroupId: this.validateForm.value.lobBusinessGroupId,
      descriptionEng: null,
      descriptionMal: null,
    };
    const data = {
      calendarOfSittingId: null,
      calenderOfDaysId: null,
      questionDay: true,
      datelist: this.dateRange,
      descriptionEng: this.validateForm.value.descriptionEng,
      businessDetails,
    };

    //   ObjsaveCosModel.id = this.calendarGroupId;
    //  ObjsaveCosModel.calendarOfDay = this.calendarOfDays;
    // console.log(this.calendarOfDays)
    // ObjsaveCosModel.businessDetail=this.objbusinessDetails;
    // console.log(this.objbusinessDetails)
    // this.savCosModel = ObjsaveCosModel;
    this.submitForm();
  }
  selectgovtBuisness() {
    // if (this.validateForm.value.govtBuisness === '3') {
    //   this.flag = true;
    // } else {
    //   this.flag = false;
    // }

    this.businessDetailsData = this.validateForm.value.agenda;
    const index = this.businessDetailsData.findIndex(
      (element) => element.lobBusinessGroupId === '3'
    );
    if (index > -1) {
      this.isOthers = true;
    } else {
      this.isOthers = false;
    }
    this.validateForm.updateValueAndValidity();
  }
  Add_to_Calender() {
    this.submitForm();
  }
  disableCalendar() {
    return !(
      this.validateForm.controls.assembly.value &&
      this.validateForm.controls.sessionId.value
    );
  }
  deleteBusiness() {
    if (this.calendarDaysId) {
      this.cobservice
        .deleteBusinessById(this.calendarDaysId)
        .subscribe((data) => {
          this.notify.showSuccess('Success', 'business deleted successfully');
          this.isVisible = false;
          this.getCODDataList();
        });
    }
  }
  showModel(): void {
    this.cobservice.getCosById(this.calendarSittingId).subscribe((res) => {
      this.isVisibleData = true;
      this.processCalendarEvent(res);
    });
  }
  processCalendarEvent(data) {
    if (data && data.calendarOfDaysList) {
      this.tempCos = data;
      let firstData = null;
      data.calendarOfDaysList.forEach((element, i) => {
        if (firstData !== new Date(element.dateList[0]).getMonth()) {
          firstData = new Date(element.dateList[0]).getMonth();
          this.tempCos.calendarOfDaysList[i].month = element.dateList[0];
        }
      });
    }
  }
  handleCancelData() {
    this.isVisibleData = false;
  }
  ShowBusiness(item) {
    if (item && item.lobBusinessGroupId === 3) {
      return item.descriptionEng;
    }
    return item.lobBusinessGroupName;
  }
  ShowMalyalamBusiness(item) {
    if (item && item.lobBusinessGroupId === 3) {
      return item.descriptionMal;
    }
    return item.lobBusinessDescriptionMal;
  }

  //  calenderEvent = this.calenderEvent.filter(
  //     (thing, index, self) =>
  //       index ===
  //       self.findIndex((t) => t.title === thing.title)
  //   );
}
