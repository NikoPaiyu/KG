import { Component, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import { AddGistComponent } from '../add-gist/add-gist.component';

@Component({
  selector: 'tables-obituary-gist',
  templateUrl: './obituary-gist.component.html',
  styleUrls: ['./obituary-gist.component.css']
})
export class ObituaryGistComponent implements OnInit {
  @Input() gistDetails = [];
  @Input() obituaryDetails;
  @Input() isFileView = false;
  @Output() gistChange = new EventEmitter<any>();
  @Input() fileStatus;
  @Input() currentAssignee = false;
  @ViewChild(AddGistComponent, {static: false}) gistadd: AddGistComponent;
  viewGistModel = false;
  gistViewData = null;
  gistIndex = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
    private fb: FormBuilder, private common: TablescommonService,
  ) { }
  showGistModal = false;
  ngOnInit() {
  }
  shownewGistPopup(){
    this.showGistModal = true;
  }
  cancelGist(event){
    this.showGistModal = event;
  }
  getAddedData(event){
    if (this.gistIndex != null) {
      // const index = this.gistDetails.findIndex(x => x.id == event.id);
      // if (index > -1) {
      //   this.gistDetails[index] = event;
      // }
       this.gistDetails[this.gistIndex] = event;
    } else {
      this.gistDetails.push(event);
    }
    this.gistIndex = null;
  }
  deleteGist(index) {
    let nonDeletedDoc = this.gistDetails.filter((d) => d.delete == false);
    if (nonDeletedDoc.length == 1) {
      this.notification.warning("Sorry", "Gists Cannot Be Empty");
      return;
    }
    if (this.gistDetails[index].id) {
      this.gistDetails[index].delete = true;
      this.notification.success('Success', 'Marked for deletion successfully');
    } else {
      this.gistDetails.splice(index, 1);
      this.notification.success('Success', 'gist deleted successfully');
      this.updateGist();
    }
  }
  updateGist() {
    this.gistChange.emit(this.gistDetails);
  }
  attachCorrespondence(gist) {
    if(this.fileStatus !== 'APPROVED' && !this.anyFamilyLetterDrafted()){
      this.notification.warning(
        "Warning",
        "Can't do it now...as the file is under approval flow"
      );
      return;
    }
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: {
          business: 'TABLE_OBITURY_FAMILY_LETTER',
          type: "TABLE_OBITURY_FAMILY_LETTER",
          fileId: this.obituaryDetails.fileId,
          businessReferId: gist.id,
          businessReferType: "TABLE",
          businessReferSubType: 'TABLE_OBITURY_FAMILY_LETTER',
          businessReferValue: gist.id,
          businessReferNumber: null,
          businessReferName: null,
          fileNumber: this.obituaryDetails.fileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode: null,
          toDisplayName: null,
          toEditable: true,
          toTypable : true
        },
      }
    );
  }
  anyFamilyLetterDrafted(){
    const status = this.gistDetails.map(x => x.letterStatus);
    if (status.includes('DRAFTED')) {
      return true;
    } else {
      return false;
    }
  }
  getToCodes() {
    this.common.getAllCode('').subscribe((codes) => {
      // console.log(codes);
    });
  }
  editGist(gist,index) {
    const gistDetails = gist;
    if (typeof gistDetails.lifeTime === 'string') {
      let dates = gistDetails.lifeTime.split('-');
      dates = dates.map(x => new Date(x));
      gistDetails.lifeTime = dates;
    }
    this.showGistModal = true;
    this.gistadd.updateMode = true;
    this.gistIndex = index;
    this.gistadd.newObituaryForm.patchValue(gistDetails);
    this.gistadd.fileList =[
      {
        uid: -1,
        name: gist.fileName,
        status: 'done',
        url: gist.attachmentUrl
      }
    ];
  }
  getGistDetails() {
    this.gistDetails.forEach((x, i) => {
      if (typeof x.lifeTime === 'string') {
        let dates = x.lifeTime.split('-');
        if (dates && dates.length > 1) {
          dates = dates.map(x => new Date(x));
          this.gistDetails[i].birthDate = dates[0];
          this.gistDetails[i].deathDate = dates[1];
        }
      }
    });
    return this.gistDetails.filter( x => x.delete === false);
  }
  viewGist(gist){
    this.viewGistModel = true;
    this.gistViewData = gist;
  }
  cancelGistView(){
    this.viewGistModel = false;
    this.gistViewData = null;
  }
}

