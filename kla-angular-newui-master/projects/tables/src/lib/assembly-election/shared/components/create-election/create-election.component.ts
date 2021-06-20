import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../../../shared/services/tablescommon.service';
import { AssemblyElectionService } from '../../services/assembly-election.service';

@Component({
  selector: 'tables-create-election',
  templateUrl: './create-election.component.html',
  styleUrls: ['./create-election.component.scss']
})
export class CreateElectionComponent implements OnInit {
  @Output() hidePopup = new EventEmitter<any>();
  @Output() electionCreated = new EventEmitter<any>();
  createElectionForm: FormGroup;
  assemblyList: any = null;
  currentAssemblySession: any = null;
  electionType: any = [];
  yearList: any = [];

  constructor(private fb: FormBuilder,
              private commonService: TablescommonService,
              private electionService: AssemblyElectionService,
              private notification: NzNotificationService) { }

  ngOnInit() {
    this.getYearList();
    this.getAssemblyList();
    this.createForm();
  }

  createForm() {
    this.createElectionForm = this.fb.group({
      id: [0],
      assembly: [null, Validators.required],
      assemblyId: [null],
      subject: [null, Validators.required],
      type: [null, Validators.required],
      description: [null, Validators.required],
      year: [null, Validators.required]
    });
  }

  getAssemblyList() {
    this.commonService.getAllAssembly().subscribe((res: any) => {
      this.assemblyList = res;
      this.getCurrentAssemblyAndSession();
    });
  }

  getCurrentAssemblyAndSession() {
    this.commonService.getCurrentAssemblyAndSession().subscribe((res: any) => {
      this.currentAssemblySession = res;
    });
  }

  createElection() {
    // tslint:disable-next-line: forin
    for (const i in this.createElectionForm.controls) {
      this.createElectionForm.controls[i].markAsDirty();
      this.createElectionForm.controls[i].updateValueAndValidity();
    }
    if (this.createElectionForm.valid) {
      if (this.createElectionForm.value.assembly) {
        this.createElectionForm.patchValue({
          assembly: this.createElectionForm.value.assembly.assemblyId,
          assemblyId: this.createElectionForm.value.assembly.id,
          year: this.createElectionForm.value.year
        });
      }
      this.electionService.createAssemblyElection(this.createElectionForm.value).subscribe((res: any) => {
        this.notification.success(
          'Success',
          'Assembly Election Created Successfully!'
        );
        this.electionCreated.emit();
      });
    }
  }

  handleCancel() {
    this.hidePopup.emit();
  }

  getYearList() {
    let currentYear = new Date().getFullYear() + 1;
    let startYear = currentYear - 20;
    while (startYear <= currentYear) {
        // const previousYear = startYear;
        // this.yearList.push(previousYear + '-' + (previousYear + 1));
        // startYear++;
        this.yearList.push(startYear++);
    }
  }
  getElectionType(assembly){
    if(assembly){
    this.electionType = [];
    this.electionService.getElectionTypeByAssemblyId(assembly.id).subscribe((res: any) => {
     this.electionType = res;
    });
   }else{
    this.electionType = [];
   }
  }
}
