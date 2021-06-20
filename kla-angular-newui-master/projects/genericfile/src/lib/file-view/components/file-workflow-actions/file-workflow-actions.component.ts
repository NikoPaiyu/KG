import { Inject, Input } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd";
import { NzCascaderOption } from "ng-zorro-antd/cascader";
import { GenericfileService } from "../../../shared/services/genericfile.service";
import { GenericfilesCommonService } from "../../../shared/services/genericfiles-common.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
const secOrDpt = [
  {
    value: "section",
    label: "Section",
  },
  {
    value: "department",
    label: "Department",
  },
];
@Component({
  selector: "generic-file-workflow-actions",
  templateUrl: "./file-workflow-actions.component.html",
  styleUrls: ["./file-workflow-actions.component.css"],
})
export class FileWorkflowActionsComponent implements OnInit {
  @Input() fileDetails;
  latestNote: any;
  returnEnable: boolean = true;
  departmentOrSection: string = "S";
  forwardOrReturn: string = "FORWARD";
  forwardOrReturnShow: boolean = false;
  approveShow: boolean = false;
  deptOrSecList: any = [];
  designationList: any[];
  deparmentOrSectionList: any = [];
  selectedDepartmentORSection: any = null;
  selectedDepartmentORSectionPH: string = "Select Section";
  userList: any = [];
  loginedUser: any;
  selectedUser: any = null;
  showActionSection: boolean = false;
  options = [
    {
      value: 0,
      label: "Section",
      children: [],
    },
    {
      value: 1,
      label: "SectiDepartmenton",
      children: [],
    },
  ];
  values: string[] | null = null;
  cascaderValues: string[] | null = null;
  sectionList: any = [];

  constructor(
    private notification: NzNotificationService,
    private common: GenericfilesCommonService,
    private file: GenericfileService,
    private router: Router,
    @Inject("authService") private AuthService
  ) {
    this.loginedUser = AuthService.getCurrentUser();
  }

  ngOnInit() {
    this.showActionSection = true;
    this.fileDetails.user.userId !== this.loginedUser.userId &&
    this.fileDetails.currentAssignee
      ? (this.approveShow = true)
      : (this.approveShow = false);

    this.common.getDesignation().subscribe((res) => {
      this.designationList = res;
    });
    this.common.getAllSections().subscribe((res) => {
      this.options[0].children = res.map((r) => {
        return {
          value: r.klaSectionId,
          label: r.klaSectionName,
          children: [],
        };
      });
    });
    this.loadAllSections();
  }
  loadAllSections() {
    this.common.getAllSections().subscribe((res) => {
      this.sectionList = res;
    });
  }
  GoBack() {
    window.history.back();
  }
  ForwardOrReturnEnable(Id) {
    // if (this.fileDetails.status === "APPROVED") {
    this.selectedUser = Id;
    this.forwardOrReturnShow = true;
    // }
  }
  ForwardFile(fileId) {
    this.latestNote = this.fileDetails.notes[this.fileDetails.notes.length - 1];
    if (
      this.latestNote &&
      this.latestNote.user.userId === this.loginedUser.userId
    ) {
      const body: any = {
        processInstanceId: this.fileDetails.workflowId,
        action: "FORWARD",
        groupId: "",
        fromGroup: this.loginedUser.fullName,
        skipped: false,
        assignee: this.selectedUser,
        remark: "",
      };
      this.file.forwardFile(fileId, body).subscribe((res) => {
        this.fileDetails = res;
        this.router.navigate(["business-dashboard/generic-file/list"]);
        //this.forwardOrReturnShow = false;
      });
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }
  markAsApproved(fileId) {
    const body: any = {
      fileId: this.fileDetails.Id,
      approvedById: this.loginedUser.userId,
      ratification: false,
      fromGroup: this.loginedUser.fullName,
    };
    this.file.approveFile(fileId, body).subscribe((res) => {
      this.fileDetails = res;
      this.router.navigate(["business-dashboard/generic-file/list"]);
    });
  }

  ApproveFile(fileId) {
    this.latestNote = this.fileDetails.notes[this.fileDetails.notes.length - 1];
    if (
      this.latestNote &&
      this.latestNote.user.userId === this.loginedUser.userId
    ) {
      this.markAsApproved(fileId);
    } else {
      this.addNote();
    }
  }

  addNote() {
    const reqBody = {
      noteId: null,
      fileId: this.fileDetails.fileId,
      note: "File Approved.",
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: false,
      userId: this.loginedUser.userId,
    };
    this.file.createNote(reqBody).subscribe((data: any) => {
      this.fileDetails.notes = data;
      this.latestNote = this.fileDetails.notes[
        this.fileDetails.notes.length - 1
      ];
      this.markAsApproved(this.fileDetails.fileId);
    });
  }
  onChanges(values: string[]): void {
    this.forwardOrReturnShow = false;
    this.selectedUser = null;
    this.userList = [];
    if (values[2]) {
      let kladesignationSelected = this.designationList.find(
        (d) => d.klaDesignationId === parseInt(values[2])
      );
      let data = {
        klaDesignatoinId: values[2][0],
        kladesignationCode: values[2][1],
        klaSectionId: values[1].toString(),
      };
      this.common.getAllNonMemberUsers(data).subscribe((res) => {
        res.map((item) => {
          item.userId !== this.loginedUser.userId
            ? this.userList.push({
                value: item.userId,
                label: item.details.fullName,
              })
            : "";
        });
      });
    }
  }
  /** load data async execute by `nzLoadData` method (Cascader)*/
  loadData = (node: NzCascaderOption, index: number): PromiseLike<void> => {
    this.selectedUser = null;
    this.forwardOrReturnShow = false;
    this.userList = [];
    return new Promise((resolve) => {
      // setTimeout(() => {
      if (index < 0) {
        // if index less than 0 it is root node
        node.children = secOrDpt;
      } else if (index == 0) {
        if (node.value === "section") {
          let result = this.sectionList.map((m) => ({
            value: m.klaSectionId,
            label: m.klaSectionName,
          }));

          node.children = result;
        } else if (node.value === "department") {
          node.children = [];
        }
      } else if (index == 1) {
        if (node.parent.value === "section") {
          let result = this.designationList.map((m) => ({
            value: [m.klaDesignationId, m.code],
            label: m.klaDesignationName,
            isLeaf: true,
          }));
          node.children = result;
        }
      }

      resolve();
      // }, 1000);
    });
  };
}
