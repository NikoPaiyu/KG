import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { TablediaryService } from '../../shared/services/tablediary.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { Body } from '@angular/http/src/body';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'tables-file-view-resume',
  templateUrl: './file-view-resume.component.html',
  styleUrls: ['./file-view-resume.component.css']
})
export class FileViewResumeComponent implements OnInit {

  bulletinPart1View = false;
  
user;
  resumeMaster;
  modules: any;
  part1Bulletin: any = [];
  allPart1Bulletin: any = [];
  bulletinData = null
  resumeData = {
    id : null,
    assemblyId: null,
    description: '',
    sessionId: null,
    assemblyValue : null,
    sessionValue : null,
    status :''
  }
  description : any;

  constructor(
    private common :TablescommonService,
    private commonService :TablescommonService,
    private TablediaryService : TablediaryService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    @Inject("authService") private AuthService,
    private sanitizer: DomSanitizer
  ) { 
    this.user = AuthService.getCurrentUser();
    this.commonService.setTablePermissions(this.user.rbsPermissions);
    this.resumeMaster = this.route.snapshot.params.id
  }

  ngOnInit() {
    this.setEditorConfig();
    this.getResumebyId();
  }

  getResumebyId(){
    this.resumeData = null;
    if(this.resumeMaster){
      this.TablediaryService.getResumeById(this.resumeMaster)
      .subscribe((Res: any) => { 
        if(Res){
          this.resumeData = Res;
          this.description = this.resumeData.description;
          this.getTableDiaryBulletinPart1List();
        }else{
         this.notification.create("warning","No Resume is available","")
        }
      });
    }
  }

  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
       
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
      ]
    };
  }
 

 back(){
   window.history.back();
 }
 
 saveResume(){
  if(this.description == null){
    this.notification.create("warning", "Resume Description is needed", "");
    return;
  }
  let body ={
    id : this.resumeMaster,
    sessionId : this.resumeData.sessionId,
    assemblyId : this.resumeData.assemblyId,
    description:this.description
  }
  this.TablediaryService.saveResume(body)
  .subscribe((Res: any) => {
    this.notification.create("success", "Success", "Success");
    this.router.navigate([
      "business-dashboard/tables/resume-list"
    ]);
  });
 }
getTableDiaryBulletinPart1List(){
  let body ={
    assemblyId : this.resumeData.assemblyId,
    sessionId : this.resumeData.sessionId
    
   }
  if (
    this.resumeData.assemblyId &&
    this.resumeData.sessionId
  ){
    this.TablediaryService
      .getPublishedBulletins(
        body
      )
      .subscribe((Res: any) => {
        this.part1Bulletin = this.allPart1Bulletin = Res;
       this.part1Bulletin.forEach(element => {
        element.viewLinks = false;
       });
      }); 
  }
}

gotoView(id){

  this.TablediaryService
      .getBulletinData(id).subscribe((Res: any) => {
         if(Res.data){
          this.bulletinData = this.sanitizer.bypassSecurityTrustHtml(Res.data); ;
         }
         this.bulletinPart1View = true;
      }); 
 }
 cancelBulletin(){
  this.bulletinData = null;
  this.bulletinPart1View = false;
 }
 showLinks(id){
  this.part1Bulletin.forEach((element) => {
    if (element.id === id) {
      element.viewLinks = true;
    } else {
      element.viewLinks = false;
    }
  });
 }
 publishResume(){
  if(this.description == null){
    this.notification.create("warning", "Resume Description is needed", "");
    return;
  }
  this.TablediaryService
  .publishResume(this.resumeMaster).subscribe((Res: any) => {
    this.notification.create("success", "Published Successfully", "Success");
    this.router.navigate([
      "business-dashboard/tables/resume-list"
    ]);
  }); 
 }

}






  
 

  

  







 
  




