import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { FileServiceService } from "../../shared/services/file-service.service";
import { ObituaryService } from "../../shared/services/obituary.service";
import { TablescommonService } from "../../shared/services/tablescommon.service";
import { ObituaryGistComponent } from "../obituary-gist/obituary-gist.component";
import { ObituaryNoteComponent } from "../obituary-note/obituary-note.component";
import { SupportingDocComponent } from "../supporting-doc/supporting-doc.component";

import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

@Component({
  selector: "tables-create-obituary-address",
  templateUrl: "./create-obituary-address.component.html",
  styleUrls: ["./create-obituary-address.component.css"],
})
export class CreateObituaryAddressComponent implements OnInit {
  @ViewChild(SupportingDocComponent, { static: false })
  docs: SupportingDocComponent;
  @ViewChild(ObituaryGistComponent, { static: false })
  gist: ObituaryGistComponent;
  @ViewChild(ObituaryNoteComponent, { static: false })
  note: ObituaryNoteComponent;

  fgObituary: FormGroup;
  filePopup = false;
  obituaryId = null;
  assemblies = [];
  sessions = [];
  user;
  dateList = [];
  disabledCosDates: any;
  obituaryDetails;
  fileStatus = null;
  currentAssignee = false;
  oldObituaryDetails;
  assemblyId: any;
  sessionId: any;
  assemblySession: any;
  assemblyList: any;
  sessionList: { id: number; sessionId: string; }[];
  constructor(
    private obituary: ObituaryService,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private common: TablescommonService,
    private fileService: FileServiceService,
    @Inject("authService") private AuthService,
    private router: Router
  ) {
    this.user = AuthService.getCurrentUser();
  }

  ngOnInit() {
    this.obituaryId = this.route.snapshot.params.id;
    if (this.obituaryId) {
      this.getObituaryById(this.obituaryId);
    }
    this.initForm();
    this.getAssemblySession(this.obituaryId);
  }
  // getAssemblySession(obituaryId) {
  //   this.common.getAllAssembly().subscribe((assembly) => {
  //     this.common.getAllSession().subscribe((session) => {
  //       this.common.getCurrentAssemblyAndSession().subscribe((active) => {
  //         this.assemblies = assembly;
  //         this.sessions = session;
  //         if (!obituaryId) {
  //           this.fgObituary
  //             .get("assemblyId")
  //             .setValue((active as any).assemblyId);
  //           this.fgObituary
  //             .get("sessionId")
  //             .setValue((active as any).sessionId);
  //           this.getDateList();
  //         }
  //       });
  //     });
  //   });
  // }


  // get assembly and session list
  getAssemblySession(obituaryId) {
    this.common.getAllAssemblyandSession().subscribe((Response:any)=> {
      if(Response){
        this.assemblySession = Response.assemblySession;
        this.assemblyId = Response.activeAssemblySession.assemblyId;
        this.assemblyList = Response.assembly;
        this.assemblyList.push({
          id: 0,
          assemblyId: 'No Assembly',
        });
        this.getSessionList();
        this.sessionId = Response.activeAssemblySession.sessionId;
        if (!obituaryId) {
          this.fgObituary.get("assemblyId").setValue(this.assemblyId);
          this.fgObituary.get("sessionId").setValue(this.sessionId);
          this.getDateList();
        }
      }
    });
  }

  // get session for assembly
  getSessionList() {
    this.fgObituary.controls.sessionId.reset();
    if (this.fgObituary.value.assemblyId === 0 || !(this.fgObituary.value.assemblyId && this.assemblySession.find(x=> x.id === this.fgObituary.value.assemblyId))) {
      this.sessionList = [{
        id: 0,
        sessionId: 'No Session',
      }];
    } else {
      if(this.fgObituary.value.assemblyId && this.assemblySession.find(x=> x.id === this.fgObituary.value.assemblyId)){
        this.sessionList = this.assemblySession.find(x => x.id === this.fgObituary.value.assemblyId).session;
      }
    }
  }

  initForm() {
    this.fgObituary = this.fb.group({
      gists: [[]],
      documents: [[]],
      note: [""],
      fileId: [0],
      fileNumber: [""],
      fileSubject: [""],
      id: null,
      isDecicated: [false],
      sessionDate: [null, Validators.required],
      sessionTime: [null],
      assemblyId: [null, Validators.required],
      sessionId: [null, Validators.required],
      status: [""],
      stage: [""],
      isResubmitable: false
    });
  }
  async createObituary() {
    this.docs.updateDocumentList();
    this.gist.updateGist();
    if (this.checkRequiredDetails()) {
      return;
    }
    if (this.fileStatus === 'APPROVED') {
      if (await this.obituary.compareObituary(this.obituaryDetails.obituary)) {
        this.fgObituary.get('isResubmitable').setValue(true);
      }
    }
    this.obituary.createObituary(this.fgObituary.value).subscribe((data) => {
      this.fgObituary.get("id").setValue(data.obituary.id);
      this.setObituaryDetails(data);
      this.notification.success(
        "Success",
        "Obituary address saved successfuly"
      );
    });
  }
  checkRequiredDetails() {
    let check = false;
    const formDetails = this.fgObituary.value;
    if (formDetails.gists.length < 1 && !check) {
      check = true;
      this.notification.error("Error", "at least one gist is required");
    }
    if (formDetails.documents.length < 1 && !check) {
      check = true;
      this.notification.error(
        "Error",
        "at least one support document is required"
      );
    }
    if (formDetails.note.length < 1 && !check) {
      check = true;
      this.notification.error("Error", "note is required");
    }
    return check;
  }
  getObituaryById(obituaryId) {
    this.obituary.getObituaryById(obituaryId).subscribe((data) => {
      this.setObituaryDetails(data);
      this.getFileDetails();
    });
  }
  updateNote(note) {
    this.fgObituary.get("note").setValue(note);
    if (this.obituaryDetails) {
      this.obituaryDetails.obituary.note = note;
    }
  }
  updateDoc(doc) {
    this.fgObituary.get("documents").setValue(doc);
    if (this.obituaryDetails) {
      this.obituaryDetails.obituary.documents = doc;
    }
  }
  updateGist(gist) {
    const gistList = gist;
    for (let i = 0; i < gistList.length; i++) {
      gistList[i] = this.formatGist(gistList[i]);
    }
    this.fgObituary.get("gists").setValue(gistList);
    if (this.obituaryDetails) {
      this.obituaryDetails.obituary.gists = gistList;
    }
  }
  formatGist(data) {
    // if (data.lifeTime && data.lifeTime.length > 1) {
    //   const firstDate = this.datePipe.transform(data.lifeTime[0], 'MM/dd/yyyy');
    //   const secondDate = this.datePipe.transform(data.lifeTime[1], 'MM/dd/yyyy');
    //   data.lifeTime = firstDate + '-' + secondDate;
    // }
    // return data;
    if (data.birthDate && data.deathDate) {
      const firstDate = this.datePipe.transform(data.birthDate, "MM/dd/yyyy");
      const secondDate = this.datePipe.transform(data.deathDate, "MM/dd/yyyy");
      data.lifeTime = firstDate + "-" + secondDate;
    }
    return data;
  }
  setObituaryDetails(data) {
    this.obituaryDetails = data;
    const obituaryDetails = data.obituary;
    this.docs.documentList = obituaryDetails.documents;
    this.gist.gistDetails = obituaryDetails.gists;
    this.gist.obituaryDetails = obituaryDetails;
    this.note.noteContent = obituaryDetails.note;
    this.note.obituaryDetails = obituaryDetails;
    this.fgObituary.get("sessionDate").setValue(obituaryDetails.sessionDate);
    this.fgObituary.get("id").setValue(obituaryDetails.id);
    this.fgObituary.get("fileId").setValue(obituaryDetails.fileId);
    this.fgObituary.get("assemblyId").setValue(obituaryDetails.assemblyId);
    this.fgObituary.get("sessionId").setValue(obituaryDetails.sessionId);
    this.fgObituary.get("status").setValue(obituaryDetails.status);
    this.fgObituary.get("stage").setValue(obituaryDetails.stage);
    this.fgObituary.get("isDecicated").setValue(obituaryDetails.isDecicated);
    this.fgObituary.get("isResubmitable").setValue(obituaryDetails.isResubmitable);
  }
  goBack() {
    window.history.back();
  }

  onCancelFilePopup() {
    this.filePopup = false;
  }
  attachToFile() {
    this.filePopup = true;
  }
  resubmitFile() {
    let body = {
      fileForm: {
        fileId: this.obituaryDetails.obituary.fileId,
        activeSubTypes: ["TABLE_OBITUARY"],
        type: "TABLE",
        userId: this.user.userId,
      },
      obituaryId: this.obituaryDetails.obituary.id,
    };
    this.fileService.reSubmitFile(body).subscribe((Res: any) => {
      this.notification.success("Success", "File Resubmitted Succesfully..");
      this.router.navigate([
        "business-dashboard/tables/file-view",
        Res.fileResponse.fileId,
      ]);
    });
  }
  getDateList() {
    if (
      this.fgObituary.get("assemblyId").value &&
      this.fgObituary.get("sessionId").value
    ) {
      this.dateList = [];
      this.common
        .getDates(
          this.fgObituary.get("assemblyId").value,
          this.fgObituary.get("sessionId").value
        )
        .subscribe((Res: any) => {
          this.dateList = Res;
          this.dateList = this.dateList.filter(
            (x) => differenceInCalendarDays(new Date(x), new Date()) >= 0
          );
          this.disabledCosDates = (current: Date): boolean => {
            return !this.dateList.includes(
              this.datePipe.transform(current, "yyyy-MM-dd")
            );
          };
        });
    }
  }
  setToLob() {
    this.obituary.setToLob(this.obituaryId).subscribe((data) => {
      this.fgObituary.get("stage").setValue("LOB_ADDED");
      this.notification.success("Success", "Added to LOB Succesfully..");
    });
  }
  getFileDetails() {
    if (this.obituaryDetails.obituary.fileId) {
      this.fileService
        .getFileById(this.obituaryDetails.obituary.fileId, this.user.userId)
        .subscribe((Response: any) => {
          if (Response) {
            this.fileStatus = Response.fileResponse.status;
            this.currentAssignee = Response.fileResponse.currentAssignee;
            this.gist.fileStatus = this.fileStatus;
            this.docs.fileStatus = this.fileStatus;
            this.note.fileStatus = this.fileStatus;
            this.gist.currentAssignee = this.currentAssignee;
            this.note.currentAssignee = this.currentAssignee;
            this.docs.currentAssignee = this.currentAssignee;
          }
        });
    }
  }
}
