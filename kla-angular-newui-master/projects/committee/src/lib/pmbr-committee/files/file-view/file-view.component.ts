import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommitteecommonService } from "../../../shared/services/committeecommon.service";
import { FileServiceService } from "../../../shared/services/file-service.service";

@Component({
  selector: "committee-file-view",
  templateUrl: "./file-view.component.html",
  styleUrls: ["./file-view.component.css"],
})
export class FileViewComponent implements OnInit {
  fileId: any;
  fileDetails: any;
  fileResponse: any;
  tabParams = {};
  currentPoolUser: any;
  allWorkflowUsers: any = [];
  stepStatusDetail: any = [];
  selectedMeetingDetails: any;
  assignee: any;
  currentUser: any;
  logDetails: any;
  isEditPrio: boolean;
  priority;

  constructor(
    private route: ActivatedRoute,
    @Inject("authService") private auth,
    private file: FileServiceService,
    public common: CommitteecommonService
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      this.getFileByFileId(this.fileId);
    });
  }

  getFileByFileId(fileId) {
    this.file
      .getFileById(fileId, this.currentUser.userId)
      .subscribe((Response) => {
        if (Response) {
          this.fileDetails = Response;
          this.fileResponse = this.fileDetails.fileResponse;
          this.logDetails = this.fileDetails.fileResponse.logs;
          this.getWorkflowStatus();
          this.getWorkflowUsers(this.fileResponse);
        }
      });
  }

  setTabfilters() {
    this.tabParams = {
      CurrentTab: false,
      showIndex: 0,
    };
  }

  showCurrentTab(key) {
    this.tabParams["showIndex"] = 1;
    // this.tabParams['showVersionEdit'] = canEdit;
    this.tabParams["CurrentTab"] = key;
  }

  _canshowCommiteeButtons() {
    if (
      this.fileDetails &&
      this.currentPoolUser &&
      this.allWorkflowUsers.length > 0
    ) {
      return true;
    }
    return false;
  }

  getWorkflowStatus() {
    this.file
      .checkWorkFlowStatus(this.fileDetails.fileResponse.workflowId)
      .subscribe((Res) => {
        if (Res) {
          this.stepStatusDetail = Res;
          const current = this.stepStatusDetail[
            this.stepStatusDetail.length - 1
          ];
          this.currentPoolUser = current.owner;
          this.assignee = Number(current.assignee);
        }
      });
  }

  getWorkflowUsers(notesinfo) {
    if (notesinfo.status !== "APPROVED") {
      this.file
        .getWorkflowActionUsers(notesinfo.workflowId, notesinfo.fileId)
        .subscribe((Res: any) => {
          Res.forEach((x, index) => {
            if (
              x.code == "PMBR_COMMITTEE_CHAIRMAN" &&
              this.fileDetails.chairman
            ) {
              if (x.userId == this.fileDetails.chairman.memberId) {
                this.allWorkflowUsers.push(x);
              }
            } else {
              this.allWorkflowUsers.push(x);
            }
          });
        });
    }
  }

  getFile(event) {
    this.getFileByFileId(event);
  }

  getStatusByReason(reason) {
    if (reason) {
      if (reason === "completed") {
        return "finish";
      }
      if (reason === "in progress") {
        return "wait";
      }
    }
  }
  editFile() {
    this.isEditPrio = true;
  }
  updateFile() {
    const fileResponse = this.fileDetails.fileResponse;
    const body = {
      assemblyId: fileResponse.assemblyId,
      assigedTo: fileResponse.assigedTo,
      createdDate: fileResponse.createdDate,
      currentNumber: fileResponse.currentNumber,
      description: fileResponse.description,
      fileId: fileResponse.fileId,
      fileNumber: fileResponse.fileNumber,
      priority: this.priority,
      sectionId: fileResponse.sectionId,
      sessionId: fileResponse.sessionId,
      status: fileResponse.status,
      subject: fileResponse.subject,
      subType: fileResponse.subtype,
      type: fileResponse.type,
      userId: fileResponse.userId,
      workflowId: fileResponse.workflowId,
    };
    this.isEditPrio = false;
    this.file.updateFile(this.fileId, body).subscribe((Res) => {
      this.getFileByFileId(this.fileId);
    });
  }
  cancel() {}
}
