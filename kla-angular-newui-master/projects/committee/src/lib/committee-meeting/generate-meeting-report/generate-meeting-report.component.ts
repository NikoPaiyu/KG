import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommitteeService } from '../../shared/services/committee.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'committee-generate-meeting-report',
  templateUrl: './generate-meeting-report.component.html',
  styleUrls: ['./generate-meeting-report.component.css'],
})
export class GenerateMeetingReportComponent implements OnInit {
  showpreview = false;
  reportForm: FormGroup;
  @Output() cancelReportGen = new EventEmitter<any>();
  @Input() meetingInfo;
  @Input() subagenda;
  @Input() reportDto;
  constructor(private fb: FormBuilder,
    private committeeService: CommitteeService,private router: Router,
    private notification: NzNotificationService,private activeRoute: ActivatedRoute) {}
  editMode = false;
  canIedit = false;
  ngOnInit() {
    this.setReportForm();
    this.setHeader();
  }
  editDescription(){
    this.editMode = true;
  }
  cancelReport() {
    this.cancelReportGen.emit(false);
  }
  setHeader(){
    if(this.reportDto.description.length == 0 ){
      this.editMode = true;
    }
    this.reportForm.patchValue({
      header : this.subagenda.businessTitle
    })
    if(this.reportDto && this.reportDto.description.length != 0){
      const controls = this.reportForm.controls.descriptions as FormArray;
      this.reportDto.description.forEach(element => {
        controls.push(
          this.fb.group({
            description: [element, Validators.compose([Validators.required])],
          })
        );
      });
    }else{
      this.addnewDescription();
    }
  }
  saveDescription() {
    if (this.reportForm.valid) {
    let description = [];
    this.reportForm.value.descriptions.forEach(element => {
      description.push(element.description);
    });
    
    let req={
        description : description,
        fileId: 0,
        // fileNumber: "string",
        heading:this.reportForm.value.header,
        id: 0,
        forwardedBusinessId: this.subagenda.forwardedBusiness.id
      }
    this.committeeService.generateCommiteeMeetingReport(req).subscribe((res: any) => {
      console.log(res);
      this.notification.success("Success","Success")
      this.cancelReport();
    });
    } else {
      // tslint:disable-next-line: forin
      for (const i in this.reportForm.controls) {
        this.reportForm.controls[i].markAsDirty();
        this.reportForm.controls[i].updateValueAndValidity();
        if (i === 'descriptions') {
          const control = this.reportForm.get('descriptions') as FormArray;
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
  }
  cancelPreview(event) {
    this.showpreview = event;
  }
  setReportForm() {
    this.reportForm = this.fb.group({
      header: [null, Validators.required],
      descriptions: this.fb.array([]),
    });
  }
  addnewDescription() {
    const descontrol = this.reportForm.controls.descriptions as FormArray;
    descontrol.push(
      this.fb.group({
        description: [null, Validators.compose([Validators.required])],
      })
    );
  }
  get clause() {
    const controls = this.reportForm.get('descriptions') as FormArray;
    return controls;
  }
  deleteDescription(i){
    let controls = this.reportForm.get("descriptions") as FormArray;
    let Count = controls.length;
    if (Count === 1) {
      this.notification.warning("Sorry", "Descriptions Cannot Be Empty");
      return;
    }
    controls.removeAt(i);
  }
  cancelDelete(){}
}
