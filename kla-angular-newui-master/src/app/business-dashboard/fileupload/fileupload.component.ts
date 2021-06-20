import { Component, OnInit, ElementRef } from "@angular/core";
import { UploadFile } from "ng-zorro-antd";
import { FileuploadService } from "../fileupload/shared/services/fileupload.service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {
  popoverMessage = "Are You Sure ?";
  validateForm: FormGroup;
  dateFormat = "dd-MM-yyyy";
  FileUploadDetails = [];
  fileList = [];
  public chosenDates = [];
  public chosenFolderNames = [];
  public pickdate;
  public pickFName;
  isEnable: boolean;
  pickedDate: any;
  sFile: any;
  newFName: any;
  changeId: any;
  selectedValue: string = '';
  public checkDate: any;
  isRules: boolean;
  oldData: boolean;
  withFolderId: boolean;
  isUploadClicked: boolean;
  isCover: boolean;

  public listOfFileTypes = [
    { label: "Submission", value: "Sub" },
    { label: "Budget", value: "Budget" },
    { label: "Unstarred Questions", value: "UnStarredQuestions" },
    { label: "Summary", value: "Summary" },
    { label: "Starred Questions", value: "StarredQuestions" },
    { label: "Rules", value: "Rules" },
    { label: "Cover", value: "Cover" },
    { label: "Miscellaneous", value: "Misc" }
  ];

  assemblys: any;
  sessions: any;

  constructor(
    private fileuploadservice: FileuploadService,
    private fb: FormBuilder,
    private notify: NotificationCustomService
  ) { }

  ngOnInit() {
    this.createForm();
    this.isUploadClicked = false;
    this.getAssembly();
    this.getSession();
  }



  selectedOption(result) {
    if (result) {
      if (result == "Cover")
        this.validateForm.controls["pickFName"].reset();
      if (this.validateForm.value.pickdate) {
        this.validateForm.get('pickdate').reset();
      }
      if (this.validateForm.value.pickFName) {
        this.validateForm.get('pickFName').reset();
        this.validateForm.get('pickNewFName').reset();
      }
      this.chosenFolderNames = []
      this.isCover = false;
      this.withFolderId = false;
      this.isRules = false;
      this.oldData = false;
      this.selectedValue = result;
      this.fileList = [];
      this.FileUploadDetails = [];
      if (result == "Rules") {
        this.isRules = true;
      }
      if (result == "Budget" || result == "Summary" || result == "StarredQuestions") {
        this.oldData = true;
        this.getFilesWithoutFolderId(this.selectedValue, this.validateForm.value.pickAssembly, this.validateForm.value.pickSession);
        this.getSavedDates(this.validateForm.value.pickAssembly, this.validateForm.value.pickSession);
      }
      else if (result == "Cover") {
        this.isCover = true;
        this.getSavedDatesofCover(this.validateForm.value.pickAssembly, this.validateForm.value.pickSession);
      }
      else
        this.getSavedDates(this.validateForm.value.pickAssembly, this.validateForm.value.pickSession);
    }
  }

  changeAssembly() {
    this.validateForm.controls["pickdate"].reset();
    this.validateForm.controls["pickFName"].reset();
    this.getSavedDates(this.validateForm.value.pickAssembly, this.validateForm.value.pickSession);
    this.FileUploadDetails = [];
  }

  changeSession() {
    this.validateForm.controls["pickdate"].reset();
    this.validateForm.controls["pickFName"].reset();
    this.getSavedDates(this.validateForm.value.pickAssembly, this.validateForm.value.pickSession);
    this.FileUploadDetails = [];
  }

  newDate(result) {
    if (result) {
      const index = this.chosenDates.findIndex(element => element.id == null);
      if (index > -1) {
        this.chosenDates.pop();
      }
      this.pickdate = formatDate(result, "dd-MM-yyyy", "en-US", "+0530");
      const index1 = this.chosenDates.findIndex(element => element.value === this.pickdate);
      if (index1 == -1) {
        this.chosenDates.push({ label: this.pickdate, value: this.pickdate, id: null });
        this.validateForm.controls["pickdate"].setValue(this.pickdate);
        if (this.isCover) {
          this.newFName = '';
        }
      }
      else {
        this.validateForm.controls["pickdate"].setValue(this.pickdate);
      }
    }
  }


  existingDate(result) {
    if (result) {
      this.validateForm.controls["pickFName"].reset();
      let date = this.chosenDates.find(element => element.value == result);
      if (date && !this.isCover)
        this.getSavedFolderNames(date.label);
      else {
        if (date.id)
          this.getFileUploadDetails(date.id);
        this.validateForm.controls["pickFName"].reset();
        this.newFName = '';
      }
      this.validateForm.controls["pickNewDate"].setValue(null);
      this.FileUploadDetails = [];
    };
  }

  selectedFile(result) {
    if (result && !this.isCover) {
      this.sFile = this.chosenFolderNames.find(element => element.id === result);
      if (this.sFile.id !== "FolderId") {
        this.getFileUploadDetails(this.sFile.id);
        this.newFName = this.sFile.label;
      } else {
        this.newFName = this.sFile.label;
        this.FileUploadDetails = [];
      }
    }
  }

  addFile() {
    if (this.validateForm.value.pickNewFName) {
      const index = this.chosenFolderNames.find(element => element.label.toLowerCase() === this.validateForm.value.pickNewFName.toLowerCase());
      if (index) {
        this.notify.showWarning("Info", "Folder already exists!");
      } else {
        this.pickFName = this.validateForm.value.pickNewFName;
        this.pickedDate = this.validateForm.value.pickdate;
        this.chosenFolderNames.push({ label: this.pickFName, value: this.pickedDate, id: "FolderId" });
      }
      this.validateForm.controls["pickNewFName"].setValue(null);
    }
  }

  getSavedFolderNames(value: any) {
    this.fileuploadservice.getFolderListOnDate(this.selectedValue, value, this.validateForm.value.pickAssembly, this.validateForm.value.pickSession).subscribe((res: any) => {
      this.chosenFolderNames = res;
    })
  }

  createForm() {
    this.validateForm = this.fb.group({
      fileType: ['', [Validators.required]],
      pickdate: [null, [Validators.required]],
      pickNewDate: [null],
      pickFName: [null, [Validators.required]],
      pickNewFName: [null],
      pickAssembly: [null, [Validators.required]],
      pickSession: [null, [Validators.required]]
    });
  }

  getFileUploadDetails(id) {
    this.fileuploadservice.getDocUploadDetails(id).subscribe((res: any) => {
      this.FileUploadDetails = res;
      this.withFolderId = true;
    });
  }

  beforeUpload = (file: UploadFile): boolean => {
    if (file.type == "application/pdf") {
      this.fileList = this.fileList.concat(file);
      return false;
    }
    else {
      this.notify.showWarning("Warning", "Invalid file type");
    }
  };

  getSavedDates(assembly, session) {
    this.fileuploadservice.getDistinctDates(this.selectedValue, assembly, session).subscribe((res: any) => {
      this.chosenDates = res;
    });
  }

  deleteFileUplaod(item) {
    this.fileuploadservice.deleteFileUplaod(item.id).subscribe((res: any) => {
      this.notify.showSuccess("Success", "Deleted SuccessFully");
      this.getFilesWithoutFolderId(this.selectedValue, this.validateForm.value.pickAssembly, this.validateForm.value.pickSession);
    });
  }

  getFilesWithoutFolderId(docType, assemblyId, sessionId) {
    this.fileuploadservice.getUploadDetails(docType, assemblyId, sessionId).subscribe((res: any) => {
      this.FileUploadDetails = res.filter(element => element.fileUrl != null);;
    });
  }

  getSavedDatesofCover(assembly, session) {
    this.fileuploadservice.getDates("Cover", assembly, session).subscribe((res: any) => {
      this.chosenDates = res;
    });
  }


  deleteFileUpload(item) {
    this.fileuploadservice
      .deleteDocFileUpload(item.id)
      .subscribe((res: any) => {
        this.notify.showSuccess("Success", "Deleted Successfully");
        this.getFileUploadDetails(item.folder.id);
      });
  }

  openFilePDF(url): void {
    if (url) {
      window.open(url, "_blank");
    }
  }

  uploadOnClick() {
    this.isUploadClicked = true;
  }

  handleUpload(value: any) {
    if (this.isCover)
      this.validateForm.controls["pickFName"].setValue(" ");
    if (this.isUploadClicked) {
      for (const i in this.validateForm.controls) {
        if (!this.isCover) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
        if (i != 'pickFName' && this.isCover) {
          this.validateForm.controls[i].markAsDirty();
          this.validateForm.controls[i].updateValueAndValidity();
        }
      }
      if (this.fileList.length == 0) {
        console.log('here')
        this.notify.showWarning("Warning", "Please select a file");
      }
    }
    if (this.validateForm.valid && this.selectedValue) {
      let formatedDate = this.validateForm.value.pickdate.split("-").reverse().join("-");
      this.fileuploadservice
        .uploadDocFiles(this.fileList, this.selectedValue, formatedDate, this.newFName, this.validateForm.value.pickAssembly, this.validateForm.value.pickSession)
        .subscribe((res: any) => {
          this.fileuploadservice.getDates(this.selectedValue, this.validateForm.value.pickAssembly, this.validateForm.value.pickSession).subscribe((res: any) => {
            this.chosenDates = res;
            this.notify.showSuccess("Success", "Uploaded Successfully");
            this.fileList = [];
            if (this.isCover) {
              if (this.newFName == "") {
                this.checkDate = res.find(element => element.value == this.validateForm.value.pickdate);
                this.getFileUploadDetails(this.checkDate.id);
              }
            } else {

              if (this.newFName == "") {
                this.checkDate = res.find(element => element.value == formatedDate);
              }
              else {
                this.checkDate = res.find(element => element.label == formatedDate && element.value == this.newFName);
              }
              if (this.checkDate && this.checkDate.id) {
                this.getFileUploadDetails(this.checkDate.id);
                this.changeId = this.chosenFolderNames.findIndex(element => element.label == this.newFName);
                if (this.changeId && !this.isCover)
                  this.chosenFolderNames[this.changeId].id = this.checkDate.id;
              }
            }

            this.FileUploadDetails = [];
            this.getSavedDates(this.validateForm.value.pickAssembly, this.validateForm.value.pickSession);
          });
        });
    }
  }

  getAssembly() {
    this.fileuploadservice
      .getAllAssembly()
      .subscribe((res: any) => {
        this.assemblys = res;
        console.log(this.assemblys);
      });
  }


  getSession() {
    this.fileuploadservice
      .getAllSession()
      .subscribe((res: any) => {
        this.sessions = res;
        console.log(this.sessions);
      });
  }

}
