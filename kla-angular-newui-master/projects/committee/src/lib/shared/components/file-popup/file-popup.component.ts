import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { forkJoin } from "rxjs";
import { CommitteeService } from "../../services/committee.service";
import { CommitteecommonService } from "../../services/committeecommon.service";
import { FileServiceService } from "../../services/file-service.service";

@Component({
  selector: "committee-file-popup",
  templateUrl: "./file-popup.component.html",
  styleUrls: ["./file-popup.component.css"],
})
export class FilePopupComponent implements OnInit {
  @Input() committeeId;
  @Input() subagenda;
  @Output() showCreateModal = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<any>();
  @Input() purpose = "";
  advancedFiltersFlag = true;
  user: any;
  type = "COMMITTEE";
  attachtoFileTab = true;
  createFileTab = true;
  constructor(
    private fb: FormBuilder,
    @Inject("authService") private AuthService,
    private router: Router,
    public common: CommitteecommonService,
    private service: FileServiceService,
    private notification: NzNotificationService,
    private committeeService: CommitteeService
  ) {
    this.user = AuthService.getCurrentUser();
  }
  attachFileForm: FormGroup = this.fb.group({
    fileId: ["", Validators.required],
    fileNo: [""],
    subject: [""],
    searchParamForFiles: [""],
  });
  listOfData: any = [];
  listOfAllData: any = [];
  // createFileForm: FormGroup = this.fb.group({
  //   assemblyId: [1, Validators.required],
  //   sessionId: [3, Validators.required],
  //   currentNumber: ['', Validators.required],
  //   backFileReference: [''],
  //   subject: ["", Validators.required],
  //   type: ["NOTICE", Validators.required],
  //   priority: ["NORMAL", Validators.required],
  //   description: ["", Validators.required],
  //   userId: [this.AuthService.getCurrentUser().userId, Validators.required]
  // });
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  assemblySessionObj = {
    assembly: [],
    session: [],
    currentAssembly: "",
    currentSession: "",
    currentAssemblyLbl: "",
  };
  fileList = [];
  @Input() meetingFile = false;
  isSpecialInviteeCreated = false;
  specialInviteeId = null;

  ngOnInit() {
    if (this.user.userId) {
      this.getAssemblySession();
    }
    if (this.purpose == "meetingReport") {
      this.attachtoFileTab = false;
      this.createFileTab = true;
    }
    if (this.meetingFile) {
      this.getMeetingById();
    }
    this.getCurrentAssemblySession();
    // console.log(this.listOfData);
  }

  getMeetingById() {
    this.committeeService
      .getMeetingById(this.committeeId)
      .subscribe((res: any) => {
        if (res.specialInvite) {
          this.isSpecialInviteeCreated = true;
          this.specialInviteeId = res.specialInvite.id;
        }
      });
  }

  getAssemblySession() {
    forkJoin(
      this.common.getAllAssembly(),
      this.common.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblySessionObj.assembly = assembly as Array<any>;

      this.assemblySessionObj.session = session as Array<any>;

      this.getAllFiles();
    });
  }
  getCurrentAssemblySession() {
    this.common.getCurrentAssemblyAndSession().subscribe((res: any) => {
      this.assemblySessionObj.currentAssembly = res.assemblyId;
      this.assemblySessionObj.currentAssemblyLbl = res.assemblyValue;
      this.assemblySessionObj.currentSession = res.sessionId;
    });
  }
  onSearchFilesForAttach() {
    let searchParam = this.attachFileForm.value.searchParamForFiles;
    if (searchParam) {
      this.listOfData = this.listOfAllData.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(searchParam.toLowerCase())) ||
          (element.subject &&
            element.subject.toLowerCase().includes(searchParam.toLowerCase()))
      );
      this.listOfData = this.advancedFilter(this.listOfData);
    } else {
      this.listOfData = this.advancedFilter(this.listOfAllData);
    }
  }
  advancedFilter(list) {
    if (this.attachFileForm.value.fileNo) {
      list = list.filter(
        (element) =>
          element.fileNumber &&
          element.fileNumber
            .toLowerCase()
            .includes(this.attachFileForm.value.fileNo.toLowerCase())
      );
    }
    if (this.attachFileForm.value.subject) {
      list = list.filter(
        (element) =>
          element.subject &&
          element.subject
            .toLowerCase()
            .includes(this.attachFileForm.value.subject.toLowerCase())
      );
    }
    return list;
  }

  onAdvancedFilterclick() {
    this.advancedFiltersFlag = false;
  }
  // createFile() {

  // }
  handlePreviewCancel() {
    this.closePopup.emit();
  }

  createFile() {
    let body = this.buildReqBodyforFile();
    // const body = {
    //   meetingId: this.committeeId,
    //   fileForm: {
    //     assemblyId: this.assemblySessionObj.currentAssembly,
    //     currentNumber: null,
    //     description: this.file.description,
    //     sessionId: this.assemblySessionObj.currentSession,
    //     status: "saved",
    //     subject: this.file.subject,
    //     activeSubTypes: ["COMMITTEE_MEETING"],
    //     subtype: "COMMITTEE_MEETING",
    //     subTypes:["COMMITTEE_MEETING"],
    //     type: "COMMITTEE_MEETING",
    //     userId: this.user.userId,
    //     priority: this.file.priority,
    //     activesubtype : "COMMITEE_MEETING"
    //   },
    // };
    this.service.createFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "File Created with file number :" + Res.fileResponse.fileNumber
      );
      this.showCreateModal.emit(false);
      this.file = {
        subject: "",
        priority: null,
        description: "",
      };
      setTimeout(() => {
        this.router.navigate([
          "business-dashboard/committee/file-view",
          Res.fileResponse.fileId,
        ]);
      }, 1500);
    });
  }
  buildReqBodyforFile() {
    let body;
    if (this.purpose == "meetingReport") {
      body = {
        forwardbusinessId: this.subagenda.forwardedBusiness.id,
        fileForm: {
          assemblyId: this.assemblySessionObj.currentAssembly,
          currentNumber: null,
          description: this.file.description,
          sessionId: this.assemblySessionObj.currentSession,
          status: "saved",
          subject: this.file.subject,
          activeSubTypes: ["MEETING_REPORT"],
          subtype: "MEETING_REPORT",
          subTypes: ["MEETING_REPORT"],
          type: "COMMITTEE_MEETING",
          userId: this.user.userId,
          priority: this.file.priority,
          activesubtype: "MEETING_REPORT",
        },
      };
    } else {
      let activeSubtypes = [];
      if (this.isSpecialInviteeCreated) {
        activeSubtypes = ["COMMITTEE_MEETING", "MEETING_SPECIAL_INVITE"];
      } else {
        activeSubtypes = ["COMMITTEE_MEETING"];
      }
      body = {
        meetingId: this.committeeId,
        meetingSpecialInviteId: this.specialInviteeId,
        fileForm: {
          assemblyId: this.assemblySessionObj.currentAssembly,
          currentNumber: null,
          description: this.file.description,
          sessionId: this.assemblySessionObj.currentSession,
          status: "saved",
          subject: this.file.subject,
          activeSubTypes: activeSubtypes,
          subtype: "COMMITTEE_MEETING",
          subTypes: ["COMMITTEE_MEETING"],
          type: "COMMITTEE_MEETING",
          userId: this.user.userId,
          priority: this.file.priority,
          activesubtype: "COMMITEE_MEETING",
        },
      };
    }
    return body;
  }
  getAllFiles() {
    const body = {
      assemblyId: this.assemblySessionObj.currentAssembly,
      sessionId: this.assemblySessionObj.currentSession,
      status: "APPROVED",
      subtype: null,
      type: this.type,
      userId: this.user.userId,
    };
    this.service.getAllFiles(body).subscribe((Res: any) => {
      this.listOfData = this.listOfAllData = Res;
      console.log(this.listOfData);
      this.onSearchFilesForAttach();
    });
  }
  attachToFile() {
    const body = {
      meetingId: this.committeeId,
      fileForm: {
        fileId: this.attachFileForm.value.fileId,
        userId: this.user.userId,
        activeSubTypes: ["COMMITTEE_MEETING"],
        subtype: "COMMITTEE_MEETING",
        subTypes: ["COMMITTEE_MEETING"],
        type: "COMMITTEE_MEETING",
        activesubtype: "COMMITEE_MEETING",
      },
    };
    this.service.attachToFile(body).subscribe((Res: any) => {
      this.notification.success(
        "Success",
        "Meeting Attached To File Successfully"
      );
      this.showCreateModal.emit(false);
      this.attachFileForm.reset();
      setTimeout(() => {
        this.router.navigate([
          "business-dashboard/committee/file-view",
          Res.fileResponse.fileId,
        ]);
      }, 1500);
      // this.router.navigate(['business-dashboard/bill/file-view/', 'bulletins', this.resubmitFileDetails.fileId]);
    });
  }
}
