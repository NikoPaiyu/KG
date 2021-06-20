import { Component, Inject, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { UploadChangeParam, NzNotificationService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import { CommonService } from "../../shared/services/common.service";
import { DocsManagementService } from "../../shared/services/docs-management.service";
@Component({
  selector: 'office-uploaded-docview',
  templateUrl: './uploaded-docview.component.html',
  styleUrls: ['./uploaded-docview.component.css']
})
export class UploadedDocviewComponent implements OnInit {
  urlparams;
  isCplSection = true;
  docId;
  docDetails;
  assemblyList: any = [];
  sessionList: any = [];
  maxNumber: any;
  assemblyId: any;
  sessionId: any;
  maxValue: any;
  activeSession: any;
  sectionList= [];
  sectionName = null;
  isPdfVisible: boolean;
  docUrl: string;
  user;
  rbsPermissions= {
    editDoc: false,
    regTableDocs: false
  };

  constructor(
    private fb: FormBuilder,
    private docService: DocsManagementService,
    private notification: NzNotificationService,
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute, @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.getPermissions(this.user.rbsPermissions);
    this.setPermission();
    this.getKlaSectionList();
    this.urlparams = this.router.getCurrentNavigation().extras.state;
    if(this.urlparams){
      this.isCplSection = this.urlparams.isCplSection;
    }
    if (this.route.snapshot.params.id) {
      this.docId = this.route.snapshot.params.id;
    }
   }
   
  ngOnInit() {
    forkJoin(
      this.docService.getAllAssembly(),
      this.docService.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblyList = assembly;
      this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
    
      this.assemblyId = null;
      this.sessionList = session;
      this.sessionList.push({
        id: 0,
        sessionId: 'No Session',
      });
      this.sessionId = null;
      this.getDocInfo();
    });
    
  }
  setPermission(){
    if(this.commonService.doIHaveAnAccessToOfficePermissions('EDIT_DOCUMENT', 'UPDATE')) {
        this.rbsPermissions.editDoc = true;
    }
    if (this.commonService.doIHaveAnAccessToTablePermissions('REGISTER_DOCUMENT', 'READ')) {
      this.rbsPermissions.regTableDocs = true;
    }
  }
  showPdfModal(documentUrl) {
    this.docUrl = documentUrl;
    if (this.docUrl) {
      this.isPdfVisible = true;
    }
  }
  hideModal(){
    this.isPdfVisible = false;
    this.docUrl = '';
  }
  getDocInfo(){
    this.docDetails = null;
    if(this.isCplSection){
      this.docService.getDocumentDetailsById(this.docId).subscribe((res: any) => {
        if(res){
        this.docDetails = res;
        this.setAssemblyandSession();
        this.setSectionName();
        }
      });
     }else{
      this.docService.getDocByIdexceptCPL(this.docId).subscribe((res: any) => {
        this.docDetails = res;
        this.setAssemblyandSession();
        this.setSectionName();
      });
     }
  }
  setAssemblyandSession(){
    this.assemblyId = this.assemblyList.find(x=> x.id == this.docDetails.assemblyId);
    this.sessionId = this.sessionList.find(y=> y.id == this.docDetails.sessionId);
  }
  setSectionName(){
  if(!this.isCplSection){
    let sect = this.sectionList.find(x=>x.klaSectionId == this.docDetails.sectionId );
    this.sectionName = sect.klaSectionName;
  }

  }
  getKlaSectionList() {
    this.commonService.getKlaSections().subscribe((res: any) => {
       this.sectionList =res;
    });
  }
  onBackClick() {
    window.history.back();
}
showEditModal() {
  this.router.navigate(['business-dashboard/office/doc-upload', 'edit',this.docId],
  {
    state: {
      isCplSection : this.isCplSection,
    }  
  }
  );
} 

  registerElectionDoc() {
    this.docService.createElectionDocument(this.docDetails).subscribe((res: any) => {
      this.notification.success(
        'Success',
        'Document Registration Successful'
      );
      this.router.navigate(['business-dashboard/tables/election/view-reg-docs', res.id]);
    });
  }
}
