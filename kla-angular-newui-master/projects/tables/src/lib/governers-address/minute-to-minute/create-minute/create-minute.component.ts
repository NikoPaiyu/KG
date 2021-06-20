import { Component, OnInit, Inject, Input, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { TablescommonService } from '../../../shared/services/tablescommon.service';
import { GovernersAddressService } from '../../../shared/services/governersaddress.service';
import { FileServiceService } from '../../../shared/services/file-service.service';
import { NzModalService, NzModalRef } from "ng-zorro-antd";
import { MinutesPreviewComponent } from "../../../shared/component/minutes-preview/minutes-preview.component";
import { last } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'tables-create-minute',
  templateUrl: './create-minute.component.html',
  styleUrls: ['./create-minute.component.scss']
})
export class CreateMinuteComponent implements OnInit {
  @Input() MinuteId: any;
  // assemblySessionObj = {
  //   assembly: [],
  //   session: [],
  //   currentAssembly: "",
  //   currentSession: "",
  // };
  assemblySessionObj;
  MinuteForm: FormGroup;
  isSubmitted = false;
  isFileView = false;
  GvAddrssList: any[];
  minutData: any[];
  constructor(public common: TablescommonService, private router: Router,
    private fb: FormBuilder, private notification: NzNotificationService,
    private route: ActivatedRoute, private governerAddrss: GovernersAddressService,
    @Inject('authService') public auth,
    private file: FileServiceService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    this.formvalidation();
    this.getGovernersddressList();
    this.route.params.subscribe((params) => {
      this.isFileView = this.MinuteId ? true : false
      if (params["mid"] || this.MinuteId) {
        this.getMinutetoMinutById(params["mid"] ? params["mid"] : this.MinuteId);
      }
      else {
        const descontrol = this.MinuteForm.controls.minutes as FormArray;
        descontrol.push(
          this.fb.group({
            id: [null],
            programName: [null, Validators.compose([Validators.required])],
            order: [null],
          })
        );
      }
    });
  }
  getAssemblySession() {
    this.common.getAllAssemblyandSession().subscribe((res) => {
      if (res) {
        this.assemblySessionObj = res;
        this.getGovernersddressList();
      }
    });
  }
  getGovernersddressList() {
    this.governerAddrss.getGovernerAddrssList('APPROVED').subscribe((res: any) => {
      this.GvAddrssList = res;
    });
  }
  getMinutetoMinutById(Mid) {
    this.governerAddrss.getMinutetominuteById(Mid).subscribe((res: any) => {
      this.minutData = res;
      this.patchValues(res);
    });
  }
  formvalidation() {
    this.MinuteForm = this.fb.group({
      mId: [null],
      footer: [null, [Validators.required]],
      header: [null, [Validators.required]],
      Govaddress: [null],
      minutes: this.fb.array([]),
    });
  }
  patchValues(MData) {
    this.MinuteForm.patchValue({
      mId: MData.id,
      header: MData.header,
      Govaddress: MData.governorsAddressId,
      footer: MData.footer,
    });
    this._setProgramData(MData.minuteToMinuteProgramDTO)
  }
  _setProgramData(minuteToMinuteProgramDTO) {
    if (minuteToMinuteProgramDTO.length !== 0) {
      const controls = this.MinuteForm.controls.minutes as FormArray;
      minuteToMinuteProgramDTO.forEach((x) => {
        controls.push(
          this.fb.group({
            id: x.id,
            programName: [x.programName, Validators.compose([Validators.required])],
            subSubjectId: x.order
          })
        );
      });
    }
  }
  get getMinuteData() {
    this.filterMinutes();
    const controls = this.MinuteForm.get("minutes") as FormArray;
    return controls;
  }
  deleteInvitee(index) {
    let controls = this.MinuteForm.get("minutes") as FormArray;
    let Count = controls.length;
    if (Count === 1) {
      this.notification.warning("Sorry", "Program Name Cannot Be Empty");
      return;
    }
    let control = <FormArray>this.MinuteForm.controls.minutes;
    control.removeAt(index);
  }
  cancelDelete() { }
  addnewMinutes(controls) {
    const inputTypeArray = controls.value.map(x => x);
    const lastItem = inputTypeArray[inputTypeArray.length - 1];
    if (lastItem.programName) {
      const descontrol = this.MinuteForm.controls.minutes as FormArray;
      descontrol.push(
        this.fb.group({
          id: [null],
          programName: [null, Validators.compose([Validators.required])],
          order: [null],
        })
      );
    } else { this.notification.warning("Sorry", "Program Name Cannot Be Empty"); }
  }
  filterMinutes() {
    const controls = this.MinuteForm.get("minutes").value;
    controls.forEach((element, index) => {
      element.order = index + 1;
    });
    if (controls.length > 0) {
      return controls.filter(x => x.programName && x.order);
    }
  }
  saveM2M(type) {
    this.MinuteForm.value.Govaddress = (this.GvAddrssList.length > 0) ? this.GvAddrssList[0].id : '';
    let programs = this.filterMinutes();
    let req = {
      id: (this.MinuteForm.value.mId) ? (this.MinuteForm.value.mId) : null,
      header: this.MinuteForm.value.header,
      footer: this.MinuteForm.value.footer,
      status: (type === 'SAVE') ? 'SAVED' : 'SUBMITTED',
      fileId: this.findFileId(),
      submittedBy: this.auth.getCurrentUser().userId,
      governorsAddressId: this.MinuteForm.value.Govaddress ? this.MinuteForm.value.Govaddress : null,
      minuteToMinuteProgramDTO: programs
    }
    for (const key in this.MinuteForm.controls) {
      this.MinuteForm.controls[key].markAsDirty();
      this.MinuteForm.controls[key].updateValueAndValidity();
    }
    const inputTypeArray = this.MinuteForm.controls.minutes.value.map(x => x);
    const lastItem = inputTypeArray[inputTypeArray.length - 1];
    const control = this.MinuteForm.get('minutes') as FormArray;
    if (control.length === 1 || !lastItem.programName) {
      for (const k in control.controls) {
        control.controls[k].get('programName').markAsDirty();
        control.controls[k].get('programName').updateValueAndValidity();
      }
    }
    if (this.MinuteForm.valid) {
      this.governerAddrss.saveMinutetominute(req).subscribe((res: any) => {
        this.minutData = res;
        this.onBack();
      });
    }
  }
  findFileId() {
    if (!this.MinuteForm.value.Govaddress) {
      return null;
    }
    const selected = this.GvAddrssList.find(element => element.id === this.MinuteForm.value.Govaddress);
    return selected.fileId
  }
  onBack() {
    this.router.navigate(["list-m2m"],
      { relativeTo: this.route.parent });
  }
  showMinutesPreview() {
    this.modalService.create({
      nzContent: MinutesPreviewComponent,
      nzWidth: "800",
      nzFooter: null,
      nzComponentParams: {
        minutesData: this.minutData
      },
    });
  }
  checkinput(index) {
    const data: any = (this.MinuteForm.get("minutes") as FormArray)
      .controls[index];
    if (data.value.programName) {
      return true;
    } else { return false; }
  }
}
