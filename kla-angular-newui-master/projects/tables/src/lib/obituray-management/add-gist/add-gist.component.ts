import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { differenceInCalendarDays } from "date-fns";
import { NzNotificationService } from "ng-zorro-antd";
import { TablescommonService } from "../../shared/services/tablescommon.service";

@Component({
  selector: "tables-add-gist",
  templateUrl: "./add-gist.component.html",
  styleUrls: ["./add-gist.component.css"],
})
export class AddGistComponent implements OnInit {
  @Output() gistCancel = new EventEmitter<any>();
  @Output() selectedData = new EventEmitter<any>();
  @Input() updateMode = false;
  addGist = false;
  newObituaryForm: FormGroup;
  uploadURL = this.commonService.uploadDocument();
  showUploadDocList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  fileList = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private commonService: TablescommonService
  ) {}

  ngOnInit() {
    this.setForm();
  }
  setForm() {
    this.newObituaryForm = this.fb.group({
      id: [null],
      image: [null, Validators.required],
      // lifeTime: [null, Validators.required],
      birthDate : [null, Validators.required],
      deathDate :[null, Validators.required],
      name: [null, Validators.required],
      obituaryId: [null],
      url: [null],
      bio: [null, Validators.required],
      delete: [false],
      fileName : [null],
    });
  }
  cancelGist() {
    this.gistCancel.emit(false);
    this.updateMode = false;
  }
  addNew() {
    this.addGist = true;
    if (this.newObituaryForm.valid) {
      this.selectedData.emit(this.newObituaryForm.value);
      this.newObituaryForm.reset();
      this.newObituaryForm.get('delete').setValue(false);
      if(this.updateMode){
        this.notification.success("Success","Gist updated successfully");
      }else{
        this.notification.success("Success","Gist added successfully");
      }
      this.fileList = [];
      this.addGist = false;
      this.cancelGist();
    } else {
      for (const key in this.newObituaryForm.controls) {
        this.newObituaryForm.controls[key].markAsDirty();
        this.newObituaryForm.controls[key].updateValueAndValidity();
      }
    }
  }
  handleFileChange(info: any) {
    if (info.file.response && info.fileList.length > 0) {
      this.newObituaryForm.controls["image"].setValue(info.file.response.body);
      this.newObituaryForm.controls["fileName"].setValue(info.file.name);
    } else {
      this.newObituaryForm.controls["image"].setValue(null);
      this.newObituaryForm.controls["fileName"].setValue(null);
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
  onChangeDate(event){

  }
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.newObituaryForm.value.deathDate) {
      return differenceInCalendarDays(startValue, new Date()) >= 0;
    }
    else{
      if(differenceInCalendarDays(startValue, new Date()) >= 0){
        return true;
      }
      else {
        return (startValue > this.newObituaryForm.value.deathDate);
      }
    }
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.newObituaryForm.value.birthDate) {
      return differenceInCalendarDays(endValue, new Date()) >= 0;
    }
    else{
      if(differenceInCalendarDays(endValue, new Date()) >= 0){
        return true;
      }
      else {
        return (endValue <= this.newObituaryForm.value.birthDate);
      }
    }
  };
  disableFutureDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, new Date()) >= 0;
  };
}
