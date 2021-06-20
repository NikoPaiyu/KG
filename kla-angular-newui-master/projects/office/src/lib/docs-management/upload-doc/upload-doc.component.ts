import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, FormArray } from "@angular/forms";
// import { DocumentsService } from "../shared/services/documents.service";
import { UploadChangeParam, NzNotificationService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
// import { CommonService } from "../shared/services/common.service";
import differenceInCalendarDays from "date-fns/fp/differenceInCalendarDays";
import { CommonService } from "../../shared/services/common.service";
import { DocsManagementService } from "../../shared/services/docs-management.service";

@Component({
  selector: 'office-upload-doc',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.css']
})
export class UploadDocComponent implements OnInit {
  documentUploadForm: FormGroup;
  assemblyList: any = [];
  sessionList: any = [];
  klasessionList;
  departmentIdList;
  ministerDeptList;
  uploadURL = this.docService.uploadUrl();
  coveringDocFileList = [];
  additionalDocumentFileList = [];
  additionalDocument: any = [];
  coveringLetterDocument: any = [];
  docType = ["SRO", "ORDINANCE", "REPORT"];
  docTypeList:any = [];
  currentNumber = 0;
  removedDocumentIds: Array<number> = [];
  receviedFrom = ["Chief Secretary", "Add. Chief  Secretary", "Special Secretary", "Principal Secretary", "Secretary",
                  'Secretary-LAW Department'];
  today: any = new Date();
  subjectList: any = [];
  updateRes: any = [];
  isCplSection = false;
  officeDocTypes :any =[];
  urlparams;
  updateMode = false;
  isSubmit = false;
  assemblySession: any;
  constructor(
    private fb: FormBuilder,
    private docService: DocsManagementService,
    private notification: NzNotificationService,
    private router: Router,
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {
    this.urlparams = this.router.getCurrentNavigation().extras.state;
    if(this.urlparams){
      this.isCplSection = this.urlparams.isCplSection;
    }
    if (this.route.snapshot.params.id) {
      this.updateMode = true;
    }
    // this.currentAssemblyAndSession();
    this.getAssemblySession()
    this.createForm();
    this.getKlaSessionList();
    this.setOfficeSectionUpload()
  }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      // this.setValueForUpdate(this.route.snapshot.params.id);
    } else {
      this.getAllDepartment(null);
    }
  }

  getAssemblySession() {
    this.commonService.getAllAssemblyandSession().subscribe((Response:any)=> {
      if(Response){
        this.assemblySession = Response.assemblySession;
        this.assemblySession.forEach(element => {
          element.session.push({
            id: 0,
            sessionId: 'No Session',
          });
        });
        this.assemblyList = Response.assembly;
        this.assemblyList.push({
        id: 0,
        assemblyId: 'No Assembly',
      });
        this.getSessionList();
      }
    });
  }
  getSessionList() {
    if(this.documentUploadForm.controls.sessionId) {
      this.documentUploadForm.controls.sessionId.reset();
    }
    if(this.documentUploadForm.value.assemblyId === 0 && !(this.assemblySession.find(x=> x.id === this.documentUploadForm.value.assemblyId))){
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    } else{
      if(this.documentUploadForm.value.assemblyId && this.assemblySession.find(x=> x.id === this.documentUploadForm.value.assemblyId))
      this.sessionList = this.assemblySession.find(x => x.id === this.documentUploadForm.value.assemblyId).session;
    }
  }
  createForm() {
    this.documentUploadForm = this.fb.group({
      assemblyId: [0],
      sessionId: [0],
      type: [null, Validators.required],
      title: [null, Validators.required],
      sectionId: [null, Validators.required],
      portfolioId: [null],
      subjectId: [null, Validators.required],
      departmentId: [null, Validators.required],
    fromWhom: [null, Validators.required],
    receivedDate: [null, Validators.required],
    attachments: [null]
    });
  }

  currentAssemblyAndSession() {
    this.commonService.getCurrentAssemblyAndSession().subscribe((Res: any) => {
      this.getAssemblyList(Res);
      // this.getSessionList(Res);
    });
  }

  getAssemblyList(activeSession) {
    this.docService.getAllAssembly().subscribe((Response: any) => {
      this.assemblyList = Response.filter(
        (x) => x.id >= activeSession.assemblyId
      );
      this.assemblyList.push({
        id: 0,
        assemblyId: "No Assembly",
      });
    });
  }

  // getSessionList(activeSession) {
  //   this.docService.getAllSession().subscribe((Response: any) => {
  //     this.sessionList = Response.filter(
  //       (x) => x.id >= activeSession.sessionId
  //     );
  //     this.sessionList.push({
  //       id: 0,
  //       sessionId: "No Session",
  //     });
  //   });
  // }

  getKlaSessionList() {
    this.commonService.getKlaSections().subscribe((res: any) => {
      //this filter is temporary solution bcz only we have cpl login
      this.klasessionList = res;
      this.klasessionList.forEach(sect => {
        sect.disable = false;
      });
      let cplSection = res.find(
          (element) => element.klaSectionName == "CPL" );
      
      if (!this.route.snapshot.params.id) {
        // this.documentUploadForm.patchValue({
        //   sectionId: cplSection.klaSectionId
        // });
        // this.isCplSection = true;
      } else{
        if(!this.isCplSection && this.updateMode){
          this.klasessionList.forEach(sect => {
            (sect.klaSectionName == "CPL" )?
              sect.disable = true: sect.disable = false
          });
        }
      }
      if (this.updateMode) {
        this.setValueForUpdate(this.route.snapshot.params.id);
      }
    });
  }

  // getAllPortfolios() {
  //   this.docService.getAllPortfolios().subscribe((Res) => {
  //     this.minPortfoliosList = Res;
  //   });
  // }

  getAllDepartment(id) {
    this.docService.getAllSubjects().subscribe((Res) => {
      this.departmentIdList = Res;
      if (id) {
        const temp = this.departmentIdList.find(element => element.id === id);
        if (temp) {
          this.documentUploadForm.patchValue({
            departmentId: temp
          });
          this.getAllSubjects(this.updateRes.departmentId, this.updateRes.subjectId);
        }
      }
    });
  }
  getMinisterDepartments(ministerPortfolioId) {
    this.docService
      .getMinisterDepartments(ministerPortfolioId)
      .subscribe((Res) => {
        this.ministerDeptList = Res;
      });
  }

  setValueForUpdate(id) {
    if(this.isCplSection){
    this.docService.getDocumentDetailsById(id).subscribe((res: any) => {
      if (res) {
        this.updateRes = res;
        this.getAllDepartment(res.departmentId);
        this.documentUploadForm.patchValue({
            assemblyId: res.assemblyId,
            sessionId: res.sessionId,
            type: res.type,
            title: res.title,
            sectionId: res.sectionId,
            portfolioId: res.portfolioId,
            receivedDate: res.receivedDate,
            fromWhom: res.fromWhom
          });
        this.currentNumber = res.currentNumber;
        this.additionalDocument = res.attachments.filter(
          (element) => element.type == "OTHERS"
        );
        this.coveringLetterDocument = res.attachments.filter(
          (element) => element.type == "COVERING_LETTER"
        );
        //set documents for upload controls
        const additionalDocuments: any = [];
        const coveringLetterDocuments: any = [];
        res.attachments.forEach((element, index) => {
          if (element.type == "COVERING_LETTER") {
            coveringLetterDocuments.push({
              uid: index + 1,
              url: element.documentUrl,
              id: element.id,
              name: element.title,
              status: "done",
              response: { body: element.documentUrl },
            });
          } else if (element.type == "OTHERS") {
            additionalDocuments.push({
              uid: index + 1,
              url: element.documentUrl,
              id: element.id,
              name: element.title,
              status: "done",
              response: { body: element.documentUrl },
            });
          }
        });
        this.coveringDocFileList = coveringLetterDocuments;
        this.additionalDocumentFileList = additionalDocuments;
      }
    });
  }
  else{
    this.setValueForUpdateExceptCPL(id);
  }
  this.addValidators(this.documentUploadForm);
  this.removeValidators(this.documentUploadForm); 
  }
  setValueForUpdateExceptCPL(id){
    this.docService.getDocByIdexceptCPL(id).subscribe((res: any) => {
      if (res) {
        this.updateRes = res;
        this.currentNumber = res.id;
        this.documentUploadForm.patchValue({
          assemblyId: res.assemblyId,
          sessionId: res.sessionId,
          sectionId: res.sectionId,
          docReceivedDate: res.receivedDate,
          docReceivedFrom: res.receivedFrom,
          docTitle: res.title,
          // fromWhom: res.fromWhom,
          docTypeId: res.typeId
        });
        this.setAttchmentsFormarray(res);
      }
    });
  }
  setAttchmentsFormarray(res){
    let index;
    const controls = this.documentUploadForm.controls.docattachments as FormArray;
    res.attachments.forEach((docc) => {
      controls.push(
        this.fb.group({
        id:[docc.id],
        title :[docc.title,Validators.compose([Validators.required])],
        documentUrl: [docc.documentUrl,Validators.compose([Validators.required])],
        typeId: [docc.typeId, Validators.compose([Validators.required])],
        uploadFileList :[[
        {
          id: docc.id ? docc.id : null,
          title:docc.title,
          documentUrl: docc.documentUrl,
          type: "ATTACHMENT",
          status: "done",
          response: { body: docc.documentUrl },
          name: docc.documentUrl
        },
        ]],
        showUploadList : {
          showPreviewIcon: true,
          showRemoveIcon: true,
          hidePreviewIconInNonImage: true,
        },
        operationType :['']
      })
      );
    });
  }

  submitForm(isSave) {
    this.isSubmit = true;
    if ((this.documentUploadForm.value.assemblyId === null && this.documentUploadForm.value.sessionId === null) ||
    (this.documentUploadForm.value.assemblyId === null && this.documentUploadForm.value.sessionId === 0) ||
    (this.documentUploadForm.value.assemblyId === 0 && this.documentUploadForm.value.sessionId === null)) {
      this.documentUploadForm.controls.assemblyId.setValue(0);
      this.documentUploadForm.controls.sessionId.setValue(0);
    } else if ((this.documentUploadForm.value.assemblyId === 0 || this.documentUploadForm.value.assemblyId === null) &&
        this.documentUploadForm.value.sessionId !== null
        && this.documentUploadForm.value.sessionId !== 0) {
      this.documentUploadForm.controls.assemblyId.reset();
      this.documentUploadForm.get('assemblyId').setValidators([Validators.required]);
      // tslint:disable-next-line:forin
      for (const i in this.documentUploadForm.controls) {
        this.documentUploadForm.controls[i].markAsDirty();
        this.documentUploadForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.documentUploadForm.controls.assemblyId !== null && this.documentUploadForm.value.sessionId === null) {
      this.documentUploadForm.controls.sessionId.setValue(0);
    }
    // else if ((this.documentUploadForm.value.assemblyId === 0 || this.documentUploadForm.value.assemblyId === null) &&
    //     this.documentUploadForm.value.sessionId !== null
    //     && this.documentUploadForm.value.sessionId !== 0) {
    //   this.documentUploadForm.controls.assemblyId.reset();
    //   this.documentUploadForm.get('assemblyId').setValidators([Validators.required]);
    //   // tslint:disable-next-line:forin
    //   for (const i in this.documentUploadForm.controls) {
    //     this.documentUploadForm.controls[i].markAsDirty();
    //     this.documentUploadForm.controls[i].updateValueAndValidity();
    //   }
    // } else if ((this.documentUploadForm.value.sessionId === 0 ||  this.documentUploadForm.value.sessionId === null)
    //     && this.documentUploadForm.value.assemblyId !== null
    //     && this.documentUploadForm.value.assemblyId !== 0) {
    //   this.documentUploadForm.controls.sessionId.reset();
    //   this.documentUploadForm.get('sessionId').setValidators([Validators.required]);
    //   // tslint:disable-next-line:forin
    //   for (const i in this.documentUploadForm.controls) {
    //     this.documentUploadForm.controls[i].markAsDirty();
    //     this.documentUploadForm.controls[i].updateValueAndValidity();
    //   }
    // }
    if (
      this.documentUploadForm.valid &&
      this.coveringDocFileList.length > 0 &&
      this.additionalDocumentFileList.length > 0 && this.isCplSection
    ) {
      const temp = this.documentUploadForm.value.departmentId;
      const tempSub = this.documentUploadForm.value.subjectId;
      this.documentUploadForm.patchValue({
      departmentId: temp.id,
      portfolioId: tempSub.portfolioId,
      subjectId: tempSub.id
      });
      this.documentUploadForm.value.documentUrl = null;
      this.documentUploadForm.value.attachments = [
        ...this.additionalDocument,
        ...this.coveringLetterDocument,
      ];
      this.docService
        .docUpload(this.documentUploadForm.value)
        .subscribe((Res: any) => {
          if (isSave) {
            this.notification.success(
              "success",
              "Document Saved Successfully!"
            );
            this.onBackClick();
          } else {
            this.submitDocument(Res.id);
          }
        });
    } else if( this.documentUploadForm.valid && !this.isCplSection ){
       let reqBody = this.buildRequestBody();
       this.docService
        .docUploadExceptCpl(reqBody)
        .subscribe((Res: any) => {
          if (isSave) {
            this.notification.success(
              "success",
              "Document Submitted Successfully!"
            );
            this.onBackClick();
          } else {
            this.submitDocumentExceptCpl(Res.id);
          }
        });
    }
    else {
      for (const i in this.documentUploadForm.controls) {
        this.documentUploadForm.controls[i].markAsDirty();
        this.documentUploadForm.controls[i].updateValueAndValidity();
        if (i === "docattachments" && !this.isCplSection) {
          const control = this.documentUploadForm.get("docattachments") as FormArray;
          for (const j in control.controls) {
            const controlTwo = control.controls[j] as FormGroup;
            for (const k in controlTwo.controls) {
              controlTwo.controls[k].markAsDirty();
              controlTwo.controls[k].updateValueAndValidity();
            }
          }
        }
      }
      if (
        (this.coveringDocFileList.length == 0 ||
        this.additionalDocumentFileList.length == 0) && this.isCplSection
      ) {
        this.notification.warning("Info", "Please Upload Required Document..");
      }
    }
  }

  submitDocument(docId) {
    const body = {
      id: docId,
    };
    this.docService.officeSectionSubmit(body).subscribe((Res) => {
      this.notification.create(
        "success",
        "Success",
        "Document Submitted Successfully!"
      );
      this.router.navigate(["business-dashboard/office/docslist"]);
    });
  }
  submitDocumentExceptCpl(docId){
    this.docService.submitDocumentExceptCpl(docId).subscribe((Res) => {
      this.notification.create( 
        "success",
        "Success",
        "Document Submitted Successfully!"
      );
      this.router.navigate(["business-dashboard/office/docslist"]);
    });
  }
  updateForm() {
    this.isSubmit = true;
    if (
      this.documentUploadForm.valid &&
      this.coveringDocFileList.length > 0 &&
      this.additionalDocumentFileList.length > 0 && this.isCplSection
    ) {
      if (this.removedDocumentIds.length > 0) {
        this.docService
          .deleteAllAttachmentById(
            this.route.snapshot.params.id,
            this.removedDocumentIds
          )
          .subscribe((res) => {
            this.updateDocument();
          });
      } else {
        this.updateDocument();
      }
    }else if(this.documentUploadForm.valid && !this.isCplSection){
      this.updateDocumentExceptCPL();
    }
     else {
      for (const i in this.documentUploadForm.controls) {
        this.documentUploadForm.controls[i].markAsDirty();
        this.documentUploadForm.controls[i].updateValueAndValidity();
        if (i === "docattachments" && !this.isCplSection) {
          const control = this.documentUploadForm.get("docattachments") as FormArray;
          for (const j in control.controls) {
            const controlTwo = control.controls[j] as FormGroup;
            for (const k in controlTwo.controls) {
              controlTwo.controls[k].markAsDirty();
              controlTwo.controls[k].updateValueAndValidity();
            }
          }
        }
      }
      if (
        ( this.coveringDocFileList.length == 0 ||
        this.additionalDocumentFileList.length == 0 ) && this.isCplSection
      ) {
        this.notification.warning("Info", "Please Upload Required Document..");
      }
    }
  }
  updateDocument() {
    const temp = this.documentUploadForm.value.departmentId;
    const tempSub = this.documentUploadForm.value.subjectId;
    this.documentUploadForm.patchValue({
    departmentId: temp.id,
    portfolioId: tempSub.portfolioId,
    subjectId: tempSub.id
    });
    this.documentUploadForm.value.createdDate = "";
    this.documentUploadForm.value.updatedDate = "";
    this.documentUploadForm.value.createdBy = null;
    this.documentUploadForm.value.id = this.route.snapshot.params.id;
    (this.documentUploadForm.value.documentUrl = null),
      (this.documentUploadForm.value.status = "SAVED");
    this.documentUploadForm.value.currentNumber = this.currentNumber;
    this.documentUploadForm.value.workflowId = null;
    this.documentUploadForm.value.attachments = [
      ...this.additionalDocument,
      ...this.coveringLetterDocument,
    ];

    this.docService
      .updateOfficeSectionDocument(this.documentUploadForm.value)
      .subscribe((res) => {
        this.notification.success("Success", "Updated Successfully..");
        this.onBackClick();
      });
  }
  updateDocumentExceptCPL(){
    let reqBody = this.buildRequestBody();
    this.docService
        .updateDocExceptCpl(reqBody)
        .subscribe((Res: any) => {
          if (Res) {
            this.notification.success(
              "success",
              "Document Updated Successfully!"
            );
            this.onBackClick();
          } 
        });
  }

  uploadCoverLetter(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.coveringLetterDocument = [];
    if (info.file.response) {
      for (const file of fileLists) {
        file.url = file.response.body;
        this.coveringLetterDocument.push({
          id: file.id ? file.id : null,
          title: file.name,
          documentUrl: file.response.body,
          type: "COVERING_LETTER",
        });
      }
      if (info.file.status == "removed" && info.file.id > 0) {
        this.removedDocumentIds.push(info.file.id);
      }
    }
  }

  uploadAdditionalDocument(info: UploadChangeParam): void {
    const fileLists = [...info.fileList];
    this.additionalDocument = [];
    if (info.file.response) {
      for (const file of fileLists) {
        file.url = file.response.body;
        this.additionalDocument.push({
          id: file.id ? file.id : null,
          title: file.name,
          documentUrl: file.response.body,
          type: "OTHERS",
        });
      }
      if (info.file.status == "removed" && info.file.id > 0) {
        this.removedDocumentIds.push(info.file.id);
      }
    }
  }
  onBackClick() {
      this.router.navigate(["business-dashboard/office/docslist"]);
  }
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and todaya
    return differenceInCalendarDays(current, this.today) < 0;
  }

  getAllSubjects(dept, subjectId) {
    if (dept) {
      let temp;
      if (typeof dept == 'object') {
        temp = dept.id;
      } else {
        temp = dept;
      }
      this.documentUploadForm.patchValue({
        subjectId: null
      });
      this.docService.getAllSubjectsByDepartmentId(temp).subscribe((Res: any) => {
        this.subjectList = Res;
        if (subjectId) {
          const tempSub = this.subjectList.find(element => element.id == subjectId);
          if (tempSub) {
             this.documentUploadForm.patchValue({
             subjectId: tempSub
          });
        }
        }
      });
    }
  }

  onDocTypeChange(event) {
    if (event === 'ORDINANCE') {
      this.documentUploadForm.patchValue({
        fromWhom: 'Secretary-LAW Department'
      });
    } else {
      this.documentUploadForm.patchValue({
        fromWhom: null
      });
    }
  }
  setOfficeSectionUpload(){
    this.getOfficeDocTypes();
    this.addOfficeSectionForm();
    if(!this.route.snapshot.params.id){
      this.addDocAttchments(); 
    }
    // this.addDocumentsKeys(); // not required as of now passing an empty array only
  }
  onChangeKLAsection(sectionId) {
    let selectedSection = null;
    if (this.klasessionList) {
      selectedSection = this.klasessionList.find(element => element.klaSectionId == sectionId);
    }
    if (selectedSection && selectedSection.klaSectionName == 'CPL') {
      this.isCplSection = true;
    } else {
      this.isCplSection = false;
      this.getdocTypeList();
    }
    this.addValidators(this.documentUploadForm);
    this.removeValidators(this.documentUploadForm);
  }
  addValidators(form: FormGroup) {
    let controls =[];
    if(!this.isCplSection){
      controls= ['docTypeId','docReceivedFrom','docReceivedDate','docTitle','docattachments'];
      }  
      else{
       controls= ['type','title','sectionId','subjectId','departmentId','fromWhom','receivedDate'];
      }
    for (const k in controls) {
      form.get(controls[k]).setValidators(Validators.required);
      form.get(controls[k]).updateValueAndValidity();
      if(controls[k] == 'docattachments'){
        const control = this.documentUploadForm.get("docattachments") as FormArray;
        for (const j in control.controls) {
          const controlTwo = control.controls[j] as FormGroup;
          for (const h in controlTwo.controls) {
            if(h!="operationType"){
            controlTwo.get(h).setValidators(Validators.required);
            controlTwo.get(h).updateValueAndValidity();
            }
          }


        }
    }
    }
  }
  removeValidators(form: FormGroup) {
    let controls = []
    if(this.isCplSection){
      controls = ['docTypeId','docReceivedFrom','docReceivedDate','docTitle','docattachments'] 
    }else{
      controls= ['type','title','sectionId','subjectId','departmentId','fromWhom','receivedDate'];
    }
    for (const k in controls) {
      form.get(controls[k]).clearValidators();
      form.get(controls[k]).updateValueAndValidity();
      if(controls[k] == 'docattachments'){
          const control = this.documentUploadForm.get("docattachments") as FormArray;
          for (const j in control.controls) {
            const controlTwo = control.controls[j] as FormGroup;
            for (const h in controlTwo.controls) {
              controlTwo.get(h).clearValidators();
              controlTwo.get(h).updateValueAndValidity();
            }
          }
      }
    }
     
  }    
  addOfficeSectionForm(){
    // this.documentUploadForm.addControl('doctypeId',this.fb.control(null, [Validators.required]) );
    // this.documentUploadForm.addControl('docSectionId',this.fb.control(null, [Validators.required]) );
    this.documentUploadForm.addControl('docReceivedFrom',this.fb.control(null, [Validators.required]) );
    this.documentUploadForm.addControl('docReceivedDate',this.fb.control(null, [Validators.required]) );
    this.documentUploadForm.addControl('docTypeId',this.fb.control(null, [Validators.required]) );
    this.documentUploadForm.addControl('docTitle',this.fb.control(null, [Validators.required]) );
    this.documentUploadForm.addControl('docattachments',this.fb.array([]));
    this.documentUploadForm.addControl('documentKey',this.fb.array([]));
  }
  addDocAttchments() {
    const controls = this.documentUploadForm.controls.docattachments as FormArray;
    controls.push(
      this.fb.group({
      title :[null,Validators.compose([Validators.required])],
      documentUrl: [null,Validators.compose([Validators.required])],
      typeId: [null, Validators.compose([Validators.required])],
      uploadFileList :[[]],
      operationType:[''],
      showUploadList : {
        showPreviewIcon: true,
        showRemoveIcon: true,
        hidePreviewIconInNonImage: true,
      },
     
    })
    );
 
  }

  handleUploadFileChange(info: any,index) {
    let doccontrols = this.documentUploadForm.get("docattachments") as FormArray;
    const formgrp = doccontrols.controls[index] as FormGroup;
   
    if (info.file.response && info.fileList.length > 0) {
      formgrp.controls.documentUrl.setValue(info.file.response.body)
    } else {
      formgrp.controls.documentUrl.setValue(null)
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
   
    let files = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
    if(files){
      formgrp.controls.uploadFileList.setValue(files)
    }
  }
 
  addDocumentsKeys() {
    const controls = this.documentUploadForm.controls.documentKey as FormArray;
    controls.push(
      this.fb.group({
      key :['test'],
      value: ['test'],
      type: ['Date'],
    })
    );
 
  }
  getOfficeDocTypes(){
    // this.officeDocTypes =[
    //   {name :"Main Document" , id: 1 },
    //   {name: "Covering Letter", id: 2},
    //   {name: "Additional Documents", id: 3}
    // ];
    this.docService.getOfficeDocTypes().subscribe((res: any) => {
    this.officeDocTypes = res;
    });
  }

  get attchmentControls() {
    const controls = this.documentUploadForm.get('docattachments') as FormArray;
    return controls;
  }
  deleteAttachment(index){
    let doccontrols = this.documentUploadForm.get("docattachments") as FormArray;
    const formgrp = doccontrols.controls[index] as FormGroup;
    
    let currentDocArray = doccontrols.value.filter(element => element.operationType == '')
    let Count = currentDocArray.length;
    if (Count === 1) {
      this.notification.warning("Sorry", "Atleast one document is required");
      return;
    }
    if (this.updateMode && this.updateRes.attachments.map(x => x.documentUrl).includes(formgrp.value.documentUrl)) {
      formgrp.controls.operationType.setValue('DELETE');
    } else {
      doccontrols.removeAt(index);
    }
  }
  buildRequestBody(){
    let reqBody ={
        id:this.route.snapshot.params.id ? this.route.snapshot.params.id :null,
        assemblyId:this.documentUploadForm.value.assemblyId,
        sessionId:this.documentUploadForm.value.sessionId,
        typeId:this.documentUploadForm.value.docTypeId,
        sectionId:this.documentUploadForm.value.sectionId,
        receivedFrom:this.documentUploadForm.value.docReceivedFrom,
        title:this.documentUploadForm.value.docTitle,
        receivedDate:this.documentUploadForm.value.docReceivedDate,
        attachments:this.documentUploadForm.value.docattachments,
        documentKey:this.documentUploadForm.value.documentKey,

    }
    return reqBody;
  }
  cancelDelete(){}
  cAnswer(d) {
    const controls = d.get("uploadFileList") as FormArray;
    return controls;
  }
  getdocTypeList() {
    this.docService.getdocTypeList().subscribe(res => {
      this.docTypeList = res;
    });
  }

  returnAttachTypeList(index) {
    const doccontrols = this.documentUploadForm.get('docattachments') as FormArray;
    const formgrp = doccontrols.controls[index] as FormGroup;
    const docArray = doccontrols.value.map(x => x.typeId);
    return this.officeDocTypes.filter(y => y.code === 'ADDITIONAL_DOCUMENT' || y.id === formgrp.value.typeId
    || !docArray.includes(y.id));
  }

}
