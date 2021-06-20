import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { NzNotificationService } from "ng-zorro-antd";
import { GenericfileService } from "../../../shared/services/genericfile.service";

@Component({
  selector: "generic-file-Tab-info",
  templateUrl: "./file-Tab-info.component.html",
  styleUrls: ["./file-Tab-info.component.css"],
})
export class FileTabInfoComponent implements OnInit {
  @Input() fileDetails;
  currentPoolUser: any;
  assignee: any;
  stepStatusDetail: any = [];
  isEditPrio: boolean;
  priority;
  @Output() getGenericFileByFileId = new EventEmitter<any>();
  user: any = null;
  workflowId: any = null;

  constructor(
    private file: GenericfileService,
    private notify: NzNotificationService,
    private router: Router,
    @Inject('authService') private AuthService,
  ) {
    this.user = AuthService.getCurrentUser();
  }

  ngOnInit() {
    this.workflowId = this.fileDetails.workflowId
    this.getWorkflowStatus();
  }
  returnOwner(status) {
    if (status && status.owner) {
      if (status.owner.includes("_")) {
        return status.owner.split("_").join(" ").toLowerCase();
      } else {
        return status.owner
          .split(/(?=[A-Z])/)
          .join(" ")
          .toLowerCase();
      }
    } else if (status && !status.owner) {
      if (status.taskDefinitionKeyName.includes("_")) {
        return status.taskDefinitionKeyName.split("_").join(" ").toLowerCase();
      } else {
        return status.taskDefinitionKeyName
          .split(/(?=[A-Z])/)
          .join(" ")
          .toLowerCase();
      }
    }
  }
  getStatusByReason(reason) {
    if (reason === "completed") {
      return "finish";
    }
    if (reason === "in progress") {
      return "wait";
    }
  }
  getWorkflowStatus() {
    this.file
      .checkWorkFlowStatus(this.workflowId)
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
  editFile() {
    this.isEditPrio = true;
  }
  onCancel() {
    this.isEditPrio = false;
  }
  updateFile() {
    const fileResponse = this.fileDetails;
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
    this.file.updateFile(fileResponse.fileId, body).subscribe((Res) => {
      this.getGenericFileByFileId.emit();
    });
  }

  viewFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }
}
