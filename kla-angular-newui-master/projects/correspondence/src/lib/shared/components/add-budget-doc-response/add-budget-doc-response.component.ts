import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CorrespondenceService } from "../../services/correspondence.service";
import { NzModalService } from 'ng-zorro-antd';
import { NzNotificationService, UploadChangeParam } from 'ng-zorro-antd';
import { differenceInCalendarDays } from 'date-fns';



@Component({
  selector: 'Correspondence-add-budget-doc-response',
  templateUrl: './add-budget-doc-response.component.html',
  styleUrls: ['./add-budget-doc-response.component.scss']
})
export class AddBudgetDocResponseComponent implements OnInit {
  @Input() businessData: FormGroup;
  @Input() isSubmit = false;
  uploadURL = this.correspondenceService.uploadUrl();
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  memberList = [];
  user;
  subjectCommitte = [];
  previewData = [];
  speechfileList = [];
  constructor(
    private fb: FormBuilder,
    @Inject("authService") private auth,
    private correspondenceService: CorrespondenceService,
    private notification: NzNotificationService,
  ) {
    this.user = auth.getCurrentUser();
  }

  ngOnInit() {
    // this.businessData = this.fb.group({
    // });
    this.addDocumentsArray();
    this.businessData.patchValue({
      budgetSpeech: {
        budgetCategory: 'INTERIM'
      }
    });
     console.log(this.businessData);
  }
  addDocumentsArray(){
    const control = this.businessData.controls.documents as FormArray;
    control.push(
      this.fb.group({
        name : [null,[Validators.required]],
        url: [null,[Validators.required]],
        fileList1: [[]],
      })
    );
  }
  get documentsArray() {
    const controls = this.businessData.get("documents") as FormArray;
    return controls;
  }
  handleGovRecFileChange(info: any,index) {
   let controls = this.businessData.get("documents") as FormArray;
    const formgrp = controls.controls[index] as FormGroup;
    if (info.file.response && info.fileList.length > 0) {
      formgrp.controls.url.setValue(info.file.response.body);
    } else {
      formgrp.controls.url.setValue(null);
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
    let filearray = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
    if(filearray){
      formgrp.controls.fileList1.setValue(filearray);
    }
  }
  handleFileChange(info: any) {
    if (info.file.response && info.fileList.length > 0) {
      this.businessData.patchValue({
        budgetSpeech: {
          url: info.file.response.body
        }
      });
    } else {
      this.businessData.patchValue({
        budgetSpeech: {
          url: null
        }
      });
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
    this.speechfileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
  deleteAttachment(index){
    let doccontrols = this.businessData.get("documents") as FormArray;
    const formgrp = doccontrols.controls[index] as FormGroup;
    if (doccontrols.length === 1) {
      this.notification.warning("Sorry", "Atleast one document is required");
      return;
    }else {
      doccontrols.removeAt(index);
    }
  }
  cancelDelete(){}
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current,new Date()) < 0;
  };
  checkFromDateValidity(event){
    if(event){
    let validFrom = this.businessData.value.validFrom;
    let validTo = this.businessData.value.validTo; 
    let budgetCategory =  this.businessData.value.budgetSpeech.budgetCategory; 
    if(validTo && budgetCategory!== null){
      console.log(this.monthDiff(event,validTo));
      if(budgetCategory == 'COMPLETE' && this.monthDiff(event,validTo) != 12 ){
        this.notification.warning("Sorry", "From Date and To Date should have 12 months difference!");
        this.businessData.get("validFrom").setValue(null);
        return;
      }else if(budgetCategory == 'INTERIM' && this.monthDiff(event,validTo) > 12 ){
        this.notification.warning("Sorry", "From Date and To Date should have less 12 months difference!");
        this.businessData.get("validFrom").setValue(null);
        return;
      }
    }
  }  
  }
  checkToDateValidity(event){
    if(event){
    let validFrom = this.businessData.value.validFrom;
    // let validTo = this.businessData.value.validTo; 
    let budgetCategory =  this.businessData.value.budgetSpeech.budgetCategory; 
    if(validFrom && budgetCategory!== null){
      if(budgetCategory == 'COMPLETE' && this.monthDiff(event,validFrom) != 12 ){
        console.log(this.monthDiff(validFrom,event))
        this.notification.warning("Sorry", "From Date and To Date should have 12 months difference!");
        this.businessData.get("validTo").setValue(null);
        return;
      }else if(budgetCategory == 'INTERIM' && this.monthDiff(validFrom,event) > 12 ){debugger;
        this.notification.warning("Sorry", "From Date and To Date should have less 12 months difference!");
        this.businessData.get("validTo").setValue(null);
        return;
      }
    }
   } 
  }

  monthDiff(d1, d2) {
    // var months=0;
    // months = (d2.getYear() - d1.getYear()) * 12;
    // months -= d1.getMonth();
    // months += d2.getMonth();
    // return months <= 0 ? 0 : months;
    var diff =(d1.getTime() - d2.getTime()) / 1000;
    diff /= (60 * 60 * 24 * 7 * 4);
   return Math.abs(Math.round(diff)) - 1;
  } 
  changeBudgetCategory(){
    this.businessData.get("validTo").setValue(null);
    this.businessData.get("validFrom").setValue(null);
  }
}




