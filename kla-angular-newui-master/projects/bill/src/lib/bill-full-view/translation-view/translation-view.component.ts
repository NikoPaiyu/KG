import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
// import { BillcommonService } from "../../services/billcommon.service";
import { UploadFile, NzNotificationService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BillcommonService } from "../../shared/services/billcommon.service";
import { BillManagementService } from '../../shared/services/bill-management.service';
@Component({
  selector: "lib-translation-view",
  templateUrl: "./translation-view.component.html",
  styleUrls: ["./translation-view.component.css"],
})
export class TranslationViewComponent implements OnInit {
  @Output() cancelTranslation = new EventEmitter<any>();
  @Input() billDetails;
  @Input() isFileView = false;
  @Input() transData;
  @Input() editDetails = false;
  translateForm: FormGroup;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  uploadURL = this.billService.uploadUrl();
  uploadFileList = [];
  onCreate=false;
  isImage= false
  loading = false;
  uploadTab = true;
  user;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private activeRoute: ActivatedRoute,
    private billService: BillcommonService,private billManagemnetService: BillManagementService,
    @Inject("authService") private AuthService,
    private modal: NzModalService
  ) {
    this.user = AuthService.getCurrentUser();
  }

  ngOnInit() {
    console.log(this.transData);
    if(this.transData.documentUrl == null || this.editDetails){
      this.setTranslateForm();
      if (this.editDetails) {
        this.translateForm.patchValue({
          id: this.transData.id,
          billId : this.transData.billId,
          language : this.transData.language,
          title : this.transData.title,
          documentUrl : this.transData.documentUrl,
        });
      }
      this.uploadTab = true;
    }else{
      this.uploadTab = false;
    }
  }
  setTranslateForm() {
    this.translateForm = this.fb.group({
      id: [null],
      billId: [this.billDetails.id],
      language: [this.transData.language],
      title: [null, Validators.required],
      documentUrl: [null, Validators.required],
      fileName: [null]
    });
    if (this.transData.documentUrl) {
      const data = {
        url: this.transData.documentUrl,
        name: this.transData.fileName || this.transData.title,
        status: "done",
        response: { body: this.transData.documentUrl },
        uid: -1,
      };
      this.uploadFileList.push(data);
    }
  }
  canceltranslation() {
    this.translateForm.reset();
    this.transData.url == null;
    this.cancelTranslation.emit(true);
    this.modal.closeAll();
    // this.modalRef.close();
  }
  submitTranslation() {
    this.onCreate = true;
    console.log(this.translateForm.value);
    if(this.translateForm.valid){
      this.billManagemnetService.submitBillTranslationDoc(this.translateForm.value).subscribe((res) => {
        this.notification.success('Success', 'Succesfully submitted..');
        this.cancelTranslation.emit(false);
        this.modal.closeAll();
        // this.modalRef.close();
      });
     }else{
       // tslint:disable-next-line: forin
    for (const key in this.translateForm.controls) {
      this.translateForm.controls[key].markAsDirty();
      this.translateForm.controls[key].updateValueAndValidity();
    }
     }
    
  }
  handleGovRecFileChange(info: any) {
    if (info.file.response && info.fileList.length > 0) {
      this.translateForm.controls["documentUrl"].setValue(
        info.file.response.body
      );
      this.translateForm.get('fileName').setValue(info.file.name);
    } else {
      this.translateForm.controls["documentUrl"].setValue(null);
    }
    let fileList = info.fileList;
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.body;
      }
      return file;
    });
    this.uploadFileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== "success";
      }
      return true;
    });
  }
  downloadTranlatedBill(url){
    var element = document.createElement('a'); 
    element.setAttribute('target', '_blank');
    element.setAttribute('href',url); 
    // element.setAttribute('download', url); 
    element.download = url;
    document.body.appendChild(element); 
    element.click(); 
    document.body.removeChild(element); 
  }
  beforeUpload = (info: any): boolean => {
    if(info.type.includes('doc') || info.type.includes('docx')){
      return true;
    } else{ 
      this.notification.warning('Warning', 'Please Upload doc Files!');
      return false; 
    }
  };
  // afterLoaded(e) {
  //   this.reportParams.showPdf = this.finalUrl ? true : false;
  //   this.loading = this.reportParams.showPdf && this.finalUrl ? false : true;
  // }
}
