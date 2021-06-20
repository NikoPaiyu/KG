import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { BillViewService } from '../shared/bill-view.service';

@Component({
  selector: 'budget-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.css']
})
export class BillViewComponent implements OnInit {
  isPublicOpinion = false;
  isReferToCommittee = false;
  openionDate;
  selectedCommittie;
  isVisible = false;
  isConfirmLoading = false;
  noticeType = null;
  isGmVisible = false;
  radioValue = 'A';
  showBillDetails = true;
  billReferences = [];
  billTypes = [];
  departments = [];
  billLanguages = [];
  ministers = [];
  generalAmendment;
  scheduleDetails = {
    disableObjection: true,
    disableGeneralAmd1: true,
    disableGeneralAmd2: true,
    disableCluseByClause: true,
    disableOrdinance: true
  };
  billDetails = {
    id: null,
    ministerId: null,
    assemblyId:null,
    sessionId:null,
    blocks: [],
    errata: [],
    governerRecommendation: '',
    governerRecommendationUrl: "",
    minister: '',
    department: '',
    subject:'',
    language: '',
    billReference: '',
    type: '',
    ordinanceDisapproved: null,
    objectedByMe: null,
    motion: null,
    generalAmendmentRaised: null,
    status: null,
    fileId :null,
    fileNumber: null,
    ordinance: false,
    referenceAct: [],
    ordinanceNumber: null,
    statementOnRule: "",
    billNumber: null,
    oldReferenceAct: [],
    natureOfBill: "",
    schedulDtoForm: {
      billIntroduction: null,
      generalAmendmentI: null,
      generalAmendmentII: null,
      status:null
    },
    versionMap: null,
    committeReportId : null,
    committeReportStatus: null,
    stage: null,
    billTranslation : []
  };
  billId = 0;
  fullScreenMode = false;
  infoModelVisible = false;
  ebitBillDetailsModel = false;
  languageList = ['ENGLISH', 'MALAYALAM'];
  defaultLanguage = 'MALAYALAM';
  currentUser;
  editable = false;
  rbsPermission = {
    create: false,
    update: false,
    addResponse: false,
    objectionToIntro: false,
    generalAmendment: false,
    ordinanceDisapproval: false,
    reSubmitFile: false,
    finalizeVetting : false
  };
  fileCreateModel = false;
  file = {
    subject: '',
    priority: null,
    description: '',
  };
  tabIndex = 0;
  tempTabIndex = 0;
  applyErrata = false;
  memberDetail;
  memberList = [];
  assemblies:any=[];
  sessions:any = [];
  maxNumber;
  maxValue;
  today = new Date();
  viewReport = {
    showpopUp : false,
  }
  translation = {
    showpopUp : false,
    transData:null
  }
  showAddMem: boolean = false;
  membersList: any;
  selectedMember: any;
  listOfMembers: any;
  filteredMembers: any;
  committeeType: any;

  constructor(
    private route: ActivatedRoute,
    private billService: BillViewService,
    private router: Router,
    private notification: NzNotificationService,
    @Inject('authService') private AuthService,
    // private commonService: BillcommonService,
  ) {
    this.billId = this.route.snapshot.params.id;
    this.currentUser = AuthService.getCurrentUser();
    // this.commonService.setBillPermissions(this.currentUser.rbsPermissions);
    this.settabIndexData();
  }

  ngOnInit() {
    this.getAssemblySession();
    if (this.billId) {
      this.getBill(this.billId);
    }
    this.getAllMembers();
  }
  settabIndexData() {
    if (
      this.router.getCurrentNavigation() &&
      this.router.getCurrentNavigation().extras &&
      this.router.getCurrentNavigation().extras.state
    ) {
      this.tempTabIndex = this.router.getCurrentNavigation().extras.state.tabIndex;
    }
  }
  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 3000);
  }

 
  getInfo() {
    this.showBillDetails = true;
  }
  // get bill details by id
  getBill(billId) {
    this.billService.getBillByBillId(billId).subscribe((res) => {
      this.billDetails = res as any;
      if( this.billDetails.motion && this.billDetails.motion.committeeType === 'SELECT_COMMITTEE') {
        this.committeeType = 'Select Committee'
      }
      this.showBillDetails = true;
      if (this.billDetails.motion) {
        if( this.billDetails.motion.committeeType === 'SELECT_COMMITTEE') {
          this.committeeType = 'Select Committee'
        }
        const committie = this.billDetails.motion.committeeType;
        if (committie === 'SELECT_COMMITTEE') {
          this.selectedCommittie = 'SUBJECT_COMMITTEE';
        } else {
          this.selectedCommittie = 'SELECT_COMMITTEE';
        }
      }
      if( this.billDetails.motion && this.billDetails.motion.user) {
        this.membersList = this.billDetails.motion.user;
        this.selectedMember = this.billDetails.motion.userId;
      }
      if (this.billDetails.errata.length > 0) {
        this.billDetails.errata.forEach(element => {
          if (element.status == 'APPROVED') {
            this.applyErrata = true;
          }
        });
      }
      // this.processNoticeRestrictions(this.billDetails.schedulDtoForm);
      this.tabIndex = this.tempTabIndex;
      this.setBillTranslations();
    });
  }
  log(){
   // this.ngOnInit();
    //this.processNoticeRestrictions(this.billDetails.schedulDtoForm)
  }
  getBillsList() {
    this.router.navigate(['business-dashboard/bill/bill-content']);
  }
  geterratumList() {
    this.router.navigate(['business-dashboard/bill/eratum-view']);
  }

  // to edit bill detials
  editBillDetails() {
    this.ebitBillDetailsModel = true;
  }

  // submit bill
  // submitBill() {
  //   const body = {
  //     id: [this.billId],
  //     actionTaken: this.currentUser.userId,
  //   };
  //   this.billService.submitBill(body).subscribe((res) => {
  //     this.notification.success('Success', 'Succesfully submitted..');
  //     this.router.navigate(['/business-dashboard/bill/bills']);
  //   });
  // }

  // // approve and send bill
  // approveAndSendBill() {
  //   const body = {
  //     id: [this.billId],
  //     actionTaken: this.currentUser.userId,
  //   };
  //   this.billService.approveAndSendBill(body).subscribe((res) => {
  //     this.notification.success('Success', 'Approve and send successfully..');
  //     this.router.navigate(['business-dashboard/bill/bills']);
  //   });
  // }

  // fullscreen mode
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }

  // back
  backToList() {
    // this.router.navigate(['business-dashboard/bill/bills']);
    window.history.back();
  }

  // show preview methods
  preview() {
    this.infoModelVisible = true;
  }

  // hide preview modal
  handlePreviewCancel() {
    this.infoModelVisible = false;
    this.ebitBillDetailsModel = false;
  }

  // function will call after block created succes
  afterBlockCreate() {
    this.getBill(this.billId);
  }
 
  isMLA() {
    return this.AuthService.getCurrentUser().authorities.includes('MLA');
  }

  isApprover() {
    return (
      !this.rbsPermission.create &&
      this.currentUser.authorities.includes('Department')
    );
  }

  isAssistant() {
    return this.currentUser.authorities.includes('assistant');
  }

  isCreator() {
    return (
      this.rbsPermission.create &&
      this.currentUser.authorities.includes('Department')
    );
  }

  showcreateFileModal() {
    this.fileCreateModel = true;
  }

  closeFileModal() {
    this.fileCreateModel = false;
  }

  // getRbsPermissionsinList() {
  //   if (this.commonService.doIHaveAnAccess('BILLS', 'CREATE')) {
  //     this.rbsPermission.create = true;
  //   }
  //   if (this.commonService.doIHaveAnAccess('BILLS', 'UPDATE')) {
  //     this.rbsPermission.update = true;
  //   }
  //   if (this.commonService.doIHaveAnAccess('GENERAL_AMENDMENT_1', 'CREATE')) {
  //     this.rbsPermission.generalAmendment = true;
  //   }
  //   if (this.commonService.doIHaveAnAccess('BILL_OBJECTION', 'CREATE')) {
  //     this.rbsPermission.objectionToIntro = true;
  //   }
  //   if (this.commonService.doIHaveAnAccess('ORDINANCE_DISAPPROVAL', 'CREATE')) {
  //     this.rbsPermission.ordinanceDisapproval = true;
  //   }
  //   if (this.commonService.doIHaveAnAccess('ADD_RESPONSE', 'READ')) {
  //     this.rbsPermission.addResponse = true;
  //   }
  //   if (this.commonService.doIHaveAnAccess('FILE_RESUBMIT', 'READ')) {
  //     this.rbsPermission.reSubmitFile = true;
  //   }
  //   if (this.commonService.doIHaveAnAccess('VETTING', 'APPROVE')) {
  //     this.rbsPermission.finalizeVetting = true;
  //   }
  // }

  // create File
  // createFile() {
  //   const body = {
  //     billId: this.billId,
  //     fileForm: {
  //       assemblyId: this.billDetails.assemblyId? this.billDetails.assemblyId : this.maxNumber,
  //       currentNumber: null,
  //       description: this.file.description,
  //       sessionId: this.billDetails.sessionId? this.billDetails.sessionId : 0,
  //       status: 'saved',
  //       subject: this.file.subject,
  //       activeSubTypes: ['BILL'],
  //       subtype: 'BILL',
  //       type: 'BILL',
  //       userId: this.currentUser.userId,
  //       priority: this.file.priority,
  //     },
  //     priorityMasterId: 0,
  //   };
  //   let reqBody = {
  //     id: [this.billId],
  //     actionTaken: this.currentUser.userId,
  //   };
  //   this.billService.submitByAssistant(reqBody).subscribe((res: any) => {
  //     this.billService.createFile(body).subscribe((Res: any) => {
  //       this.notification.success(
  //         'Success',
  //         'File Created with fileNumber ' + Res.fileResponse.fileNumber
  //       );
  //       this.router.navigate([
  //         'business-dashboard/bill/file-view', 'bill',
  //         Res.fileResponse.fileId,
  //       ]);
  //     });
  //   });
  // }

  // editBillContent() {
  //   if (this.billId) {
  //     this.router.navigate([
  //       'business-dashboard/bill/create-bill',
  //       this.billId,
  //     ]);
  //   }
  // }
  // isPPO() {
  //   return this.AuthService.getCurrentUser().authorities.includes("ppo") || this.AuthService.getCurrentUser().authorities.includes("parliamentaryPartySecretary");
  // }
  // clauseByClauseAmendments() {
  //   let path = "../bill/create-clause-by-clause";
  //   this.router.navigate([path, this.billId], {
  //     relativeTo: this.route.parent,
  //   });
  // }

  // // after close errata
  // afterCloseErrata() {
  //   if (this.billId) {
  //     this.getBill(this.billId);
  //   }
  // }
  // getMemberList(noticeType) {
  //   if (this.isPPO()) {
  //     this.notice.getMemberByPpo(this.billDetails.id, noticeType).subscribe(data => {
  //       this.memberList = data;
  //     });
  //   }
  // }
  // getMemberId() {
  //   if (this.isPPO()) {
  //     return this.memberDetail;
  //   } else {
  //     return this.AuthService.getCurrentUser().userId;
  //   }
  // }

  getAssemblySession() {
    // forkJoin(
    //   this.commonService.getAllAssembly(),
    //   this.commonService.getAllSession()
    // ).subscribe(([assembly, session]) => {
    //   this.assemblies = assembly as Array<any>;
    //   const res = this.assemblies.map((x) => x.id);
    //   this.maxNumber = Math.max.apply(null, res);
    //   this.sessions = session as Array<any>;
    //   const result = this.sessions.map((x) => x.id);
    //   this.maxValue = Math.max.apply(null, result);

    // });
  }
  
  viewCommitteeReport(){
    this.viewReport.showpopUp= true;
  }
  cancelReportPreview(event){
    this.viewReport.showpopUp = false;
  }
  finalizeVetting() {
    // this.billService.finalizeVetting(this.billId).subscribe(data => {
    //   this.notification.success('Success', 'Bill Vetting completed successfully');
    //   this.backToList();
    // });
  }
  setBillTranslations(){
    // let languages = ["ENGLISH","MALAYALAM","TAMIL","KANNADA"]
    let languages = ["ENGLISH","MALAYALAM"]
    let currentLang = (this.billDetails.language == 'ENG') ? "ENGLISH":"MALAYALAM";
    languages = this.arraySplice(languages,currentLang);
    if(this.billDetails.billTranslation.length == 0){
      languages.forEach(element => {
        let obj = {
          language:element,
          documentUrl : null,
          title:null,
          status:"SAVED"
        }
        this.billDetails.billTranslation.push(obj);
      });
    }else{
      this.billDetails.billTranslation.forEach(element => {
        if(languages.includes(element.language)){
          languages = this.arraySplice(languages,element.language);
        }
      })
      languages.forEach(lang => {
        let obj = {
          language:lang,
          documentUrl : null,
          title:null,
          status:"SAVED"
        }
        this.billDetails.billTranslation.push(obj);
      });
    }
  }
  arraySplice(mainArray,element){
    const index = mainArray.indexOf(element);
    if (index > -1) {
      mainArray.splice(index, 1);
    }
    return mainArray;
  }
  showTranslate(trans){
     this.translation.transData = trans
     this.translation.showpopUp = true;
  }
  cancelTranslation(){
    if (this.billId) {
      this.getBill(this.billId);
    }
    this.translation.showpopUp = false;
    this.translation.transData = null;
  }
  canIViewTranslation(){
    let canIview = false;
    if(this.isApprover()){
      let savedItems = this.billDetails.billTranslation.filter(
        x=>x.status!='SAVED'
      )
      if(savedItems.length !== 0){
        canIview = true;
      }else{
        if(this.billDetails.status && (this.billDetails.status === "SUBMITTED" 
            || this.billDetails.status === "APPROVED" || this.billDetails.status === "WAITING_FOR_SUBMISSION") ){
          canIview = true;
          if(this.billDetails.schedulDtoForm == null || this.billDetails.schedulDtoForm.billIntroduction == null){
            canIview = true;
          }else{
            if(this.billDetails.schedulDtoForm.billIntroduction &&
              differenceInCalendarDays(new Date(this.billDetails.schedulDtoForm.billIntroduction), new Date()) < 0){
              canIview = false;
            }
          }
        }else{
          canIview = false
        }
      }  
    }else{
      this.billDetails.billTranslation = this.billDetails.billTranslation.filter(
        x=>x.status!='SAVED'
      )
      if(this.billDetails.billTranslation.length !== 0){
        canIview = true;
      }
    }
    return canIview
  }
  addedMembers(billId) {
    this.getBill(billId);
  }
  showAddMember() {
    this.showAddMem = true;
  }
  getAllMembers() {
    // this.billService.getAllMembersList().subscribe((data) => {
    //   this.listOfMembers = data as any;
    //   this.filteredMembers = this.listOfMembers.filter(element => element.details.id !== 105)
    // });
  }
  addMember() {
    // const body ={
    //   billId: this.billDetails.id,
    //   memberIds: this.selectedMember
    // }
    // this.billService.addMembers(body).subscribe(res=> {
    //   if(res){
    //     this.getBill(this.billDetails.id);
    //   }
    // });
    this.showAddMem = false;
  }
  cancel() {
    this.showAddMem = false;
  }
  isMinister() {
    return this.currentUser.authorities.includes("minister");
  }
  canIAddMembersinMinisterMotion(){ 
    let caniAdd = false;
    if (
      this.billDetails.ministerId &&
      this.billDetails.ministerId == this.currentUser.userId &&
      this.billDetails.schedulDtoForm &&
      this.billDetails.schedulDtoForm.billIntroduction &&
      differenceInCalendarDays(
        new Date(this.billDetails.schedulDtoForm.billIntroduction),
        new Date()
      ) > 0
    ) {
      caniAdd = true;
    } else if (
      this.currentUser &&
      this.currentUser.correspondenceCode.code == "LEGISLATION_SECTION" &&
      this.currentUser.authorities.includes("deputySecretary") &&
      differenceInCalendarDays(
        new Date(this.billDetails.schedulDtoForm.billIntroduction),
        new Date()
      ) == 0
    ) {
      caniAdd = true;
    }
    return caniAdd; 
  }
  canIViewMinisterMotionMembers(){
   
    let canIview = false;
    if (
      this.billDetails.motion &&
      this.billDetails.motion.committeeType === "SELECT_COMMITTEE"
    ) {
      if (
        this.billDetails.ministerId &&
        this.billDetails.ministerId == this.currentUser.userId
      ) {
        canIview = true;
      } else if (
        this.currentUser &&
        this.currentUser.correspondenceCode.code == "LEGISLATION_SECTION"
      ) {
        canIview = true;
      }
    }
    return canIview;
  }
}
