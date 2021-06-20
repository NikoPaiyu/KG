import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  Injectable,
  Inject,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { BillcommonService } from "../../services/billcommon.service";
import { UploadFile, NzNotificationService } from "ng-zorro-antd";
import { Router } from "@angular/router";
import { BillManagementService } from "../../services/bill-management.service";
import { FileServiceService } from '../../services/file-service.service';
@Component({
  selector: "lib-createbill-metaform",
  templateUrl: "./createbill-metaform.component.html",
  styleUrls: ["./createbill-metaform.component.css"],
})
@Injectable({
  providedIn: "root",
})
export class CreatebillMetaformComponent implements OnInit {
  @Output() showCreate = new EventEmitter<any>();
  @Input() billId;
  @Input() isBillRef;
  @Input() viewOnly;
  lateDocSubmission;
  createButtonLabel = "Create Bill";
  onCreate= false;
  billLanguages = [];
  ministers = [];
  subjects:any =[];
  departments = [];
  actReferences = [];
  oldActReferences = [];
  listOfoldActReferences = [];
  ordinanceReferences = [];
  oldOrdinanaceReferences = [];
  listOfOldOrdiReferences = [];
  billTypes = [];
  articles = [];
  billForm: FormGroup;
  disbleOldOrdiRef = true;
  OrdinancefileList = [];
  govRecFileList = [];
  ordinanceValidator = true;
  govRecValidator = true;
  uploadOrdinanaceURL = this.billService.uploadUrl();
  uploadGovRecURL = this.billService.uploadUrl();
  beforeUpload = (info: any): boolean => {
    if(info.type.includes('pdf')){
      return true;
    } else{ 
      this.notification.warning('Warning', 'Please Upload PDF Files!');
      return false; 
    }
  };
  showActRef = false;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  showUploadGovRecList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  billData;
  oldOrdinanceRefFlag = false;
  natureofBill = "Government";
  purpose="";
  user;
  allowBillUpdate = false;
  isLoading = true;
  constructor(
    private fb: FormBuilder,
    private billService: BillcommonService,
    private notification: NzNotificationService,
    private router: Router,
    private billManagement: BillManagementService,
    @Inject("authService") private AuthService,
    private file: FileServiceService
  ) {
    this.user = AuthService.getCurrentUser();
    this.getMinisters();
    this.getBillTypes();
    this.getActReferences();
    this.getOldActReferences();
    this.getBillLanguages();
    this.getOrdinanceReferences();
    this.user = AuthService.getCurrentUser();
  }

  ngOnInit() {
    this.billFormValidation();
    if (this.billId) {
      this.createButtonLabel = "Update bill";
      this.getBillDetils(this.billId);
    }
  }
  billFormValidation() {
    this.billForm = this.fb.group({
      title: [null, Validators.required],
      type: [null, Validators.required],
      natureOfBill: ["GOVERNMENT",Validators.required],
      language: [null, Validators.required],
      actReference: [null],
      // oldactReference: [null],
      oldactReference : this.fb.array([]),
      ordinance: [null],
      ordinanceFile: [null],
      ordinanceReference: [null],
      oldOrdinanceReference: [null],
      ministerId: [null, Validators.required],
      departmentId: [null, Validators.required],
      subjectId:[null, Validators.required],
      govrecommendation: [null],
      govrecommendationFile: [null],
      article: [null],
      status: ["SAVED"],
    });
  }
  //////////////////////////////// get metadatas methods starts here /////////////////////////
  getBillTypes() {
    this.billService
      .getBillTypes()
      .subscribe((arg: any) => {
        this.billTypes = arg
        if(this.user && this.user.correspondenceCode.code == "FINANCE"){ // for Approriation bill from fdc login
          this.billTypes = this.billTypes.filter(x=> x.code == 'AP_BUDGET' || x.code == 'AP_VOA' || x.code == 'AP_SDG' || x.code == 'FINANCE_BILL');
        }
      });
  }
  getActReferences() {
    // this.actReferences = ["ACT234", "ACT900", "ACT678"];
    this.billService.getAllActreferences()
      .subscribe((arg: any) => this.actReferences = arg);
  }
  getOrdinanceReferences() {
    this.ordinanceReferences = [
      {
        label: "Old Ordinance Reference",
        type: "old",
      },
      {
        label: "ORDINANCE #234",
        type: "new",
      },
      {
        label: "ORDINANCE 99000 #234",
        type: "new",
      },
    ];
  }

  getDepartments(ministerid) {
    this.billForm.controls["departmentId"].setValue(null);
    this.billForm.controls["subjectId"].setValue(null);
    let minister;
    minister = this.ministers.find((item) => item.ministerId == ministerid);
    // this.billForm.controls["departmentId"].setValue(null);
    if (minister) {
      this.billService
        .getDepartmentsByportfolioId(minister.id)
        .subscribe((arg: any) => (this.departments = arg));
        // this.billForm.patchValue({
        //   departmentId:departmentId
        // })
    }
    else{
      this.departments = [];
    }
  }

  getMinisters() {
    this.billService
      .getMinisters()
      .subscribe((arg: any) => (this.ministers = arg));
  }

  getBillLanguages() {
    this.billLanguages = [
      {
        label: "MALAYALAM",
        value: "MAL",
      },
      {
        label: "ENGLISH",
        value: "ENG",
      },
    ];
  }
  getOldActReferences() {
    this.oldActReferences = this.listOfoldActReferences = [
      "435/2016",
      "777/2019",
      "666/2020",
    ];
    // this.billService.getOldActRefernces()
    //   .subscribe((arg: any) => this.oldActReferences = this.listOfoldActReferences = arg)
    // }
  }
 
  //////////////////////////////// get metadatas methods ends here /////////////////////////
  addnewOldRef() {
    const descontrol = this.billForm.controls.oldactReference as FormArray;
    descontrol.push(
      this.fb.group({
        oldRef: [null, Validators.compose([Validators.required])],
      })
    );
    this.billForm.get("actReference")!.clearValidators();
    this.billForm.get("actReference")!.updateValueAndValidity();
  }
  deleteOldRef(i){
    let controls = this.billForm.get("oldactReference") as FormArray;
    controls.removeAt(i);
    if(this.showActRef && controls.length == 0 ){
      this.billForm
     .get("actReference")!
     .setValidators(Validators.required); 
      this.billForm.get("actReference")!.updateValueAndValidity();
    }
  }
  get oldRef() {
    const controls = this.billForm.get('oldactReference') as FormArray;
    return controls;
  }
  cancelBill() {
    this.billForm.reset();
    this.onCreate= false;
    this.showCreate.emit(false);
  }

  createBill() {
    this.onCreate= true;
    if (this.billForm.valid) {
      this.setOrdianceReferenceOnSubmit();
      const body = this.buildPostData(this.billForm.value);
      this.billService.createBill(body).subscribe((response: any) => {
        if(this.createButtonLabel == 'Create Bill'){
          this.notification.create("success", "Success", "Bill created succesfully");
          this.purpose = "create";
        }
        else{
          this.notification.create("success", "Success", "Bill updated succesfully");
        }
        this.OrdinancefileList = [];
        this.govRecFileList = [];
        this.billForm.reset();
        if (this.billId) {
          this.showCreate.emit(false);
        } else if (this.isBillRef) {
          body.id = response.id;
          this.showCreate.emit(body);
        } else {
          this.router.navigate([
            "business-dashboard/bill/create-bill",
            response.id,
          ],
          {
            state : {
              purpose : this.purpose
            }
          }  
          );
        }
      });
    } else {
      this.validateForm();
    }
  }
  buildPostData(billData) {
    let oldactReference = [];
    billData.oldactReference.forEach(element => {
      if(element.oldRef)
      {
        oldactReference.push(element.oldRef);
      }
    });
    const body = {
      id: this.billId ? this.billId : null,
      articalNo: billData.article,
      departmentId: billData.departmentId,
      governerRecommendation: billData.govrecommendation
        ? billData.govrecommendation
        : false,
      governerRecommendationUrl: billData.govrecommendationFile,
      language: billData.language,
      ministerId: billData.ministerId,
      subjectId:billData.subjectId,
      oldOrdinance: this.oldOrdinanceRefFlag,
      oldReferenceAct: oldactReference,
      ordinance: billData.ordinance,
      ordinanceNumber: billData.ordinanceReference
        ? billData.ordinanceReference
        : null,
      referenceAct: billData.actReference,
      statementOnRule: billData.ordinanceFile,
      title: billData.title,
      type: billData.type,
      natureOfBill:billData.natureOfBill
    };
    return body;
  }
  setOrdianceReferenceOnSubmit() {
    if (this.billForm.controls.oldOrdinanceReference.value) {
      this.billForm.controls["ordinanceReference"].setValue(
        this.billForm.controls.oldOrdinanceReference.value
      );
      this.oldOrdinanceRefFlag = true;
    } else {
      if (this.billForm.controls.ordinanceReference.value) {
        this.oldOrdinanceRefFlag = false;
      }
    }
  }
  validateForm() {
    // tslint:disable-next-line: forin
    for (const key in this.billForm.controls) {
      this.billForm.controls[key].markAsDirty();
      this.billForm.controls[key].updateValueAndValidity();
      if (key === 'oldactReference') {
        const control = this.billForm.get('oldactReference') as FormArray;
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
  onKeydown(event) {
     if (this.disbleOldOrdiRef) {
       return false;
     }
     else {
       return true;
     }
  }
  onArticleKeydown(event){
    if (!this.govRecValidator) {
      return true;
    }
    else {
      return false;
    }
  }
  onChangeOrdReference(ordlabel) {
    if (ordlabel) {
      let ord = this.ordinanceReferences.find((x) => x.label === ordlabel);
      if (ord && ord.type == "new") {
        this.disbleOldOrdiRef = true;
        this.billForm.get("oldOrdinanceReference")!.clearValidators();
        this.billForm.get("oldOrdinanceReference")!.markAsPristine();
        this.billForm.controls["oldOrdinanceReference"].setValue(null);
      } else {
        this.disbleOldOrdiRef = false;
        this.billForm
          .get("oldOrdinanceReference")!
          .setValidators(Validators.required);
      }
      this.billForm.get("oldOrdinanceReference")!.updateValueAndValidity();
    }
  }
  onOldRefeChange(value: string) {
    this.oldActReferences = this.listOfoldActReferences.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  onOldOrdiRefChange(value: string) {
    this.oldOrdinanaceReferences = this.listOfOldOrdiReferences.filter(
      (option) => option.toLowerCase().includes(value.toLowerCase())
    );
  }

  ordinanceChange(check) {
    if (!check) {
      this.billForm.get("ordinanceFile")!.clearValidators();
      this.billForm.get("ordinanceFile")!.markAsPristine();
      this.billForm.get("ordinanceReference")!.clearValidators();
      this.billForm.get("ordinanceReference")!.markAsPristine();
      this.billForm.get("oldOrdinanceReference")!.clearValidators();
      this.billForm.controls["ordinanceFile"].setValue(null);
      this.billForm.controls["ordinanceReference"].setValue(null);
      this.ordinanceValidator = true;
      this.disbleOldOrdiRef = true;
    } else {
      this.billForm.controls["ordinanceReference"].setValue(null);
      // this.billForm.get("ordinanceFile")!.setValidators(Validators.required);
      this.billForm
        .get("ordinanceReference")!
        .setValidators(Validators.required);
      this.billForm.get("oldOrdinanceReference")!.clearValidators();
      this.ordinanceValidator = false;
    }
    this.OrdinancefileList = [];
    this.billForm.get("ordinanceFile")!.updateValueAndValidity();
  }
  govRecChange(check) {
    if (!check) {
      this.billForm.get("govrecommendationFile")!.clearValidators();
      this.billForm.controls["govrecommendationFile"].setValue(null);
      this.billForm.get("article")!.clearValidators();
      this.billForm.controls["article"].setValue(null);
      this.govRecValidator = true;
    } else {
      this.billForm
        .get("govrecommendationFile")!
        .setValidators(Validators.required);
      this.billForm
        .get("article")!
        .setValidators(Validators.required);  
      this.govRecValidator = false;
    }
    this.govRecFileList = [];
    this.billForm.get("govrecommendationFile")!.updateValueAndValidity();
    this.billForm.get("article")!.updateValueAndValidity();
  }

  ////////////////////// file upload handling methods starts here /////////////////////

  handleRemoveOrdiFIle = (file: UploadFile) => {
    if (this.viewOnly) {
      return false;
    }
    this.billForm.controls["ordinanceFile"].setValue(null);
    this.ordinanceValidator = false;
    return true;
  };
  handleOrdiFileChange(info: any): void {
    if (info.file.response && info.fileList.length > 0) {
      this.billForm.controls["ordinanceFile"].setValue(info.file.response.body);
    } else {
      this.billForm.controls["ordinanceFile"].setValue(null);
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
    this.OrdinancefileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }

  handleRemoveGovRecFile = (file: UploadFile) => {
    if (this.viewOnly) {
      return false;
    }
    this.billForm.controls["govrecommendationFile"].setValue(null);
    return true;
  };
  handleGovRecFileChange(info: any) {
    if (info.file.response && info.fileList.length > 0) {
      this.billForm.controls["govrecommendationFile"].setValue(
        info.file.response.body
      );
    } else {
      this.billForm.controls["govrecommendationFile"].setValue(null);
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
    this.govRecFileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
  ////////////////////// file upload handling methods ends here /////////////////////

  /////////////////////////  edit bill methods starts here /////////////////////////////
  getBillDetils(billId) {
    if (billId) {
      this.billService.getBillById(billId).subscribe((response) => {
        this.billData = response;
        this.setbillData(this.billData);
        if (this.isLDC() && this.billData.status == 'APPROVED' && this.billData.ordinance && !this.billData.statementOnRule) {
          this.lateDocSubmission = true;
          this.getFileDetails(this.billData.fileId);
        }
      });
    }
  }
  getFileDetails(fileId) {
    const userId = this.user.userId;
    this.file.getFileById(fileId, userId).subscribe(data => {
      this.isLoading = false;
      if ((data as any).fileResponse.status == 'SUBMITTED') {
        this.allowBillUpdate = false;
      } else {
        this.allowBillUpdate = true;
      }
    });
  }
  isLDC() {
    const user = this.AuthService.getCurrentUser();
    if (user) {
      return user.authorities.includes('Department');
    }
    return false;
  }
  setbillData(response) {
    this.billForm.patchValue({
      // id: response.id,
      title: response.blocks[0].content,
      type: response.type,
      ordinance: response.ordinance,
      ordinanceFile: response.statementOnRule,
      actReference: response.referenceAct,
      // oldactReference: response.oldReferenceAct,
      language: response.language,
      ministerId: response.ministerId,
      // departmentId:response.departmentId,
      // subjectId:response.subjectId,
      govrecommendation: response.governerRecommendation,
      govrecommendationFile: response.governerRecommendationUrl,
      article: response.articalNo,
      status: response.status,
      natureOfBill:response.natureOfBill
    });
    this.setOldActRef(response);
    // this.billForm.controls["departmentId"].setValue(response.departmentId);
    // this.billForm.controls["subjectId"].setValue(response.subjectId);
    // this.setDepatmentData(response.ministerId, response.departmentId);
    this.getSubjects(response.departmentId);
    this.getDepartments(response.ministerId);
    this.billForm.patchValue({
      departmentId:response.departmentId,
      subjectId:response.subjectId
    })
    this.setOldOrdinance(response.ordinanceNumber, response.oldOrdinance);
    if (response.statementOnRule) {
      const ordFile = {
        url: response.statementOnRule,
        name: "Ordinance Document",
        status: "done",
        response: { body: response.statementOnRule },
        uid: -1,
      };
      this.OrdinancefileList.push(ordFile);
    }
    if (response.governerRecommendationUrl) {
      const govFile = {
        url: response.governerRecommendationUrl,
        name: "Governer's recommendation Document",
        status: "done",
        response: { body: response.governerRecommendationUrl },
        uid: -1,
      };
      this.govRecFileList.push(govFile);
    }
  }
  setDepatmentData(minId, deptId) {
    if (minId) {
      let minister = this.ministers.find((x) => x.ministerId === minId);
      if (minister) {
        this.billService.getDepartmentsByportfolioId(minister.id).subscribe((arg: any) => {
          this.departments = arg;
          // this.billForm.patchValue({
          //   departmentId: deptId,
          // });
        });
        // this.billForm.patchValue({
        //   departmentId: deptId,
        // });
      }
    }
  }
  setOldOrdinance(OrdinanceRef, refNumber) {
    if (!refNumber) {
      this.billForm.patchValue({
        ordinanceReference: OrdinanceRef,
        oldOrdinanceReference: null,
      });
    } else {
      this.billForm.patchValue({
        ordinanceReference: "Old Ordinance Reference",
        oldOrdinanceReference: OrdinanceRef,
      });
      this.disbleOldOrdiRef = false;
    }
  }
  setOldActRef(response){
    if(response.oldReferenceAct.length != 0){
      const controls = this.billForm.controls.oldactReference as FormArray;
      response.oldReferenceAct.forEach(element => {
        controls.push(
          this.fb.group({
            oldRef: [element, Validators.compose([Validators.required])],
          })
        );
      });
    }
  }
  getSubjects(deptId) {
    this.billForm.controls["subjectId"].setValue(null);
    if (deptId) {
      this.billService
        .getSubjectByDepartmentId(deptId)
        .subscribe((arg: any) => (this.subjects = arg));
        // this.billForm.patchValue({
        //   subjectId : subjectId
        // })
    }
    else{
      this.subjects = [];
    }
  }
  billTypeChange(event){
   if(event && event == 'AMENDING_BILL'){
     this.showActRef = true;
     this.billForm.controls["actReference"].setValue(null);
     this.billForm
     .get("actReference")!
     .setValidators(Validators.required);  
     this.billForm.get("actReference")!.updateValueAndValidity();
   }else{
    this.showActRef = false;
    this.billForm.get("actReference")!.clearValidators();
    const control = <FormArray>this.billForm.controls['oldactReference'];
    for(let i = control.length-1; i >= 0; i--) {
        control.removeAt(i)
    }
   }
  }
  updateAndResubmitFile() {
    const data  = {
      billId: this.billId,
      statementOnRule: this.billForm.get('ordinanceFile').value
    };
    this.billService.uploadStatementOnRule(data).subscribe(data => {
      this.resubmitFile((data as any).billFileId);
    });
  }
  resubmitFile(fileId) {
    const body = {
      billId: this.billId,
      fileForm: {
        fileId,
        billId: this.billId,
        type: 'BILL',
        activeSubTypes: ['BILL']
      }
    };
    if (fileId) {
      this.billManagement.attachBallotingToFile(body).subscribe(data => {
        if (data) {
          this.notification.success('Success', 'Bill Updated Successfully');
        }
      });
    } else {
      this.notification.success('Success', 'Bill Updated Successfully');
    }
    
  }
}
