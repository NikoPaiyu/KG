import { Component, OnInit, Inject } from "@angular/core";
import { MentionOnSearchTypes } from "ng-zorro-antd/mention";
import { FilesService } from "../shared/services/files.service";
import { CommonService } from "../shared/services/common.service";
import { ActivatedRoute, Data, Router } from "@angular/router";
import { DocumentsService } from "../shared/services/documents.service";
import { CplFile } from "../shared/models/create-file";
import { NzNotificationService } from "ng-zorro-antd";
import { element } from "protractor";
import * as jsPdf from "jspdf";
import "jspdf-autotable";
import { ViewChild, ElementRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { DynamicFormComponent } from "../shared/components/dynamic-form/dynamic-form.component";
import { DatePipe } from "@angular/common";
import { CurrespondenceService } from "../shared/services/currespondence.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "cpl-file-workflow",
  templateUrl: "./file-workflow.component.html",
  styleUrls: ["./file-workflow.component.scss"],
  providers: [DatePipe],
})
// tslint:disable-next-line: align
export class FileWorkflowComponent implements OnInit {
  @ViewChild("htmlData", { static: false }) htmlData: ElementRef;
  isconfidential = false;
  printable = false;
  currentCplDocumentID: any;
  templateList: any = [];
  templateId = 1;
  templateText = "";
  notes: any;
  inputValue: string = "";
  suggestions: string[] = [];
  fileId = null;
  fileLogs: any = [];
  yellow: any = false;
  update = false;
  updateBody: any;
  updateId: any;
  user: any;
  fileDocsArray: any;
  isAttachVisible = false;
  isfileVisible = false;
  selectedRole: any = null;
  referenceBusiness: any = [];
  forwarded: any;
  stepStatus: any = [];
  searchDoc: any;
  listOfDoc: any = [];
  checked;
  indeterminate;
  setOfCheckedId = new Set<any>();
  listOfCurrentPageData: any = [];
  DocList: any = [];
  fromGroup: any;
  cplButtons: any = this.getCPLButtons();
  tabs: any = [];
  isPdfVisible = false;
  docUrl: any = "";
  attachment: any;
  extraTabs: any = [];
  filteredDocList: any = [];
  portfolioId: any;
  list: any;
  docType: any;
  popConfirm = false;
  portId: any;
  latestNote: any = null;
  enableAttach = true;
  currentPoolUser: any = null;
  currentPool: any = null;
  counter = Array;
  currentVersion;
  id = this.tabs.typeReference;
  versionArray;
  quickOptions = [
    { label: "Can be admitted", disallowStatus: false },
    { label: "Can be disallowed as per rule", disallowStatus: true },
    { label: "Not allowed as per rule", disallowStatus: true },
  ];
  selectedTags = [];
  currentRuleStatement = "";
  disallowStatus = false;
  checkedRule: any;
  forward = false;
  approve = false;
  edit = false;
  return = false;
  currentTabIndex = 0;
  workFlowUsers: any;
  currentUserActionRow: any;
  forwardAssignee: any;
  forwardReturnBtn = 'noticeprocessing.noticeprocess.forward';
  forwardText = 'Forward';
  forwardAssigneeGroup: any;
  currentFileDocumentId = null;
  currentActionName = null;
  filteredDocs: any;
  amendmentModal: any = false;
  searchAmendment: any = "";
  filteredAmendList: any = [];
  tempAmendmentList: any;
  unifyDate: any = false;
  unifyModal: any = false;
  dateList: any = [];
  layingDate: any = null;
  assemblyId: any;
  sessionId: any;
  updateModal: boolean;
  statusArray: any = [
    "Lodged",
    "Parked",
    "Closed in Rt series",
    "Archived",
    "SUBMITTED",
  ];
  updatedStatus: any = null;
  pullButton = false;
  pullGroup: any;
  canPull = false;
  priorityModal = false;
  filePriority: any = null;
  ratificationStatus: any;
  sectionRole: any;
  disabledCosDates: any;
  reason = "";
  pullModal = false;
  filterStatus: any;
  ratificationApprove = false;
  ratification = false;
  ministerDepartmentId: any;
  skip = false;
  showSkipModal = false;
  fromPool: any;
  correspondenceData: any;
  letterModal = false;
  letterTableData: any;
  urlData: any;
  nothingToView = false;
  speakerNoteUrl: any = null;
  viewSpeakerNote = false;
  urlParams: any;
  assignee: any;
  forwardActionRow: any = null;
  listPdfUrl: any = null;

  constructor(
    private fileService: FilesService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private docService: DocumentsService,
    private router: Router,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    private correspondenceService: CurrespondenceService,
    @Inject("authService") private AuthService,
    public translate: TranslateService,
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.getCPLPermissions(this.user.rbsPermissions);
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    if (!this.user.authorities.includes("assistant")) {
      this.quickOptions.push({
        label: "Agreed to previous note",
        disallowStatus: true,
      });
    }
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      this.getFileById(this.fileId);
    });
    this.yellow = "false";
    this.getFromGroup();
    setTimeout(() => {
      this.loadCPLButtons();
    }, 300);
  }

  getFileById(fileId) {
    this.fileService.getDocumentsByFileId(fileId).subscribe((Res) => {
      this.fileDocsArray = Res;
      this.getCorrespondenceFile();
      this.filterStatus = this.fileDocsArray.fileResponse.status;
      this.assemblyId = this.fileDocsArray.fileResponse.assemblyId;
      this.sessionId = this.fileDocsArray.fileResponse.sessionId;
      this.filePriority = this.fileDocsArray.fileResponse.priority;
      this.fileLogs = this.fileDocsArray.fileResponse.logs;
      if (this.fileDocsArray.fileResponse.ratification.length !== 0) {
        const temp = this.fileDocsArray.fileResponse.ratification.filter(
          (x) => x.sectionRole === this.sectionRole
        );
        if (temp.length !== 0) {
          this.ratificationStatus = temp[0].status;
        }
      }
      if (this.fileDocsArray.cplList) {
        this.currentVersion = this.fileDocsArray.cplList.latestList.currentVersion;
        this.versionClick(this.currentVersion);
      }
      if (this.fileDocsArray.fileResponse) {
        this.notes = this.fileDocsArray.fileResponse.notes;
        this.latestNote = this.notes[this.notes.length - 1];
        this.getWorkflowStatus();
        this.tabContents();
        if (this.fileDocsArray.fileResponse.status !== "APPROVED" && this.fileDocsArray.fileResponse.status !== "CLOSED") {
          this.getWorkFLowUsers();
        }
        this.loadCPLButtons();
        if (this.cplButtons.Approve) {
          this.quickOptions.push({
            label: "Approved and circulation need to be done",
            disallowStatus: true,
          });
        }
        if (this.fileDocsArray.fileResponse.status !== "APPROVED") {
          if (this.cplButtons.Approve) {
            this.approve = true;
          }
          if (this.cplButtons.Forward) {
            this.forward = true;
          }
          if (
            this.cplButtons.Edit &&
            this.fileDocsArray.type !== "LIST" &&
            this.fileDocsArray.type !== "AMENDMENT" &&
            this.fileDocsArray.type !== "CORRECTED" &&
            this.fileDocsArray.type !== "WITHDRAW"
          ) {
            this.edit = true;
          }
          if (this.cplButtons.Return) {
            this.return = true;
          }
        }
      }
    });
  }
  //function to load version details by version
  versionClick(version) {
    if (version === null) {
      this.currentVersion = null;
      this.versionArray = this.fileDocsArray.cplList.latestList;
    } else {
      this.versionArray = this.fileDocsArray.cplList.versionMap[version];
    }
    let serialNum = 0;
    this.versionArray.documentsByPortfolioDtos.forEach((x, index) => {
      if (index === 0 || (index > 0 && x.minister !== this.versionArray.documentsByPortfolioDtos[index - 1].minister)) {
        x.serialNumber = this.romanize(++serialNum);
      } else {
        x.serialNumber = '';
      }
    });
  }

  getLogs(fileId) {
    this.fileService.getAllLogs(fileId).subscribe((Res) => {
      this.fileLogs = Res;
    });
  }

  addNote() {
    const current = this.stepStatus[this.stepStatus.length - 1];
    if (!this.update) {
      const body = {
        fileId: this.fileId,
        note: this.inputValue,
        referenceBusiness: [0],
        referenceRules: [0],
        temporary: this.yellow,
        userId: this.user.userId,
      };
      let add = false;
      if (this.latestNote) {
        if (this.latestNote.user.userId !== this.user.userId) {
          add = true;
        } else {
          add = false;
        }
      } else {
        add = true;
      }
      if (this.inputValue.charAt(0) !== " " && add) {
        this.fileService.addNote(body).subscribe((Res) => {
          this.notes = Res;
          this.latestNote = this.notes[this.notes.length - 1];
          this.getLogs(this.fileId);
          this.inputValue = null;
          this.currentRuleStatement = null;
          this.notification.create(
            "success",
            "Success",
            "Note added successfully!"
          );
        });
      } else if (this.inputValue.charAt(0) === " ") {
        this.notification.create(
          "warning",
          "Warning",
          "First Character Should Not Be Space!"
        );
      } else if (!add) {
        this.notification.create(
          "warning",
          "Warning",
          "You can add only one note!"
        );
      }
    }
    if (this.update) {
      this.updateBody = {
        fileId: this.fileId,
        note: this.inputValue,
        noteId: this.updateId,
        referenceBusiness: [0],
        referenceRules: [0],
        temporary: this.yellow,
        userId: this.user.userId,
      };
      if (this.inputValue.charAt(0) !== " ") {
        this.fileService.updateNote(this.updateBody).subscribe((Res) => {
          this.notes = Res;
          this.latestNote = this.notes[this.notes.length - 1];
          this.getLogs(this.fileId);
          this.inputValue = null;
          this.update = false;
          this.currentRuleStatement = null;
          this.notification.create(
            "success",
            "Success",
            "Note updated successfully!"
          );
        });
      } else {
        this.notification.create(
          "warning",
          "Warning",
          "First Character Should Not Be Space!"
        );
      }
    }
  }

  closeTab(tab) {
    if (
      this.fileDocsArray.type != "LIST" &&
      this.fileDocsArray.type != "AMENDMENT"
    ) {
      this.tabs.forEach((element) => {
        if (element.id == this.currentCplDocumentID) {
          element.currespondenceSend = false;
        }
      });
    }
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    this.currentTabIndex = 0;
  }

  cancelEdit() {
    this.inputValue = null;
    this.yellow = "false";
    this.update = false;
  }

  editNote(nId, note, temp) {
    this.update = true;
    this.yellow = temp;
    this.inputValue = note;
    this.updateId = nId;
  }

  convertNote(nId) {
    const body = {
      noteId: nId,
      userId: this.user.userId,
    };
    this.fileService.convertNote(this.fileId, body).subscribe((Res) => {
      this.getFileById(this.fileId);
      this.notification.create(
        "success",
        "Success",
        "Note converted to normal note successfully!"
      );
    });
  }

  deleteNote(nId) {
    const body = {
      fileId: this.fileId,
      noteId: nId,
      userId: this.user.userId,
    };
    this.fileService.deleteNoteById(body).subscribe((Res) => {
      this.notes = Res;
      this.latestNote = this.notes[this.notes.length - 1];
      this.getLogs(this.fileId);
      this.notification.create(
        "success",
        "Success",
        "Note deleted successfully!"
      );
    });
  }

  CheckforRules(checked: boolean, tag, index: number) {
    this.currentRuleStatement = tag.label;
    this.addQuickOption(checked, tag.label, index);
  }

  addQuickOption(checked: boolean, tag: string, index) {
    this.inputValue = tag;
  }

  handleCancel() {
    this.isAttachVisible = false;
    this.isfileVisible = false;
    this.amendmentModal = false;
    this.unifyModal = false;
    this.updateModal = false;
    this.updatedStatus = null;
    this.templateId = null;
    this.searchDoc = null;
    this.priorityModal = false;
    this.pullModal = false;
    this.showSkipModal = false;
    this.reason = "";
    this.letterModal = false;
    this.filteredDocList = this.filteredDocs;
  }

  showAttachModal(): void {
    this.isAttachVisible = true;
    this.getDoCList();
  }

  requestForDelayStatement(data) {
    if (this.correspondenceData.businessMap && this.correspondenceData.businessMap.size > 0 &&
      this.correspondenceData.businessMap[data.id].find(letter =>
      letter.businessCode === 'DELAY_STATEMENT')) {
        this.notification.create('warning', 'Warning', 'Delay Statement Already Requested!');
    } else {
      this.commonService.getSubjectById(data.ministerDepartmentId).subscribe((Res: any) => {
        this.router.navigate(["business-dashboard/correspondence/select-template"], {
          state: {
            business: "DELAY_STATEMENT",
            type: "CPL_SECTION",
            fileId: data.fileId,
            businessReferId: data.id,
            businessReferType: data.type,
            businessReferSubType: data.subType,
            businessReferNumber: data.typeNumber,
            fileNumber: data.regFileNumber,
            departmentId: data.ministerDepartmentId,
            masterLetter: null,
            refrenceLetter: null,
            toCode: Res.code,
            toDisplayName: Res.departmentName
          },
        });
      });
    }
  }

  fileInfo() {
    this.isfileVisible = true;
  }

  cancel() {}

  getFromGroup() {
    if (this.user.authorities.includes("assistant")) {
      this.fromGroup = "Assistant";
      this.sectionRole = "CPL_ASSISTANT";
    } else if (this.user.authorities.includes("sectionOfficer")) {
      this.fromGroup = "Section Officer";
      this.sectionRole = "CPL_SECTION_OFFICER";
    } else if (this.user.authorities.includes("underSecretary")) {
      this.fromGroup = "Under Secretary";
      this.sectionRole = "CPL_UNDER_SECRETARY";
    } else if (this.user.authorities.includes("deputySecretary")) {
      this.fromGroup = "Deputy Secretary";
      this.sectionRole = "CPL_DEPUTY_SECRETARY";
    } else if (this.user.authorities.includes("jointSecretary")) {
      this.fromGroup = "Joint Secretary";
      this.sectionRole = "CPL_JOINT_SECRETARY";
    } else if (this.user.authorities.includes("additionalSecretary")) {
      this.fromGroup = "Additional Secretary";
      this.sectionRole = "CPL_ADDITIONAL_SECRETARY";
    } else if (this.user.authorities.includes("secretary")) {
      this.fromGroup = "Secretary";
      this.sectionRole = "SECRETARY";
    } else if (this.user.authorities.includes("specialSecretary")) {
      this.fromGroup = "Special Secretary";
      this.sectionRole = "CPL_SPECIAL_SECRETARY";
    } else if (this.user.authorities.includes("speaker")) {
      this.fromGroup = "Speaker";
      this.sectionRole = "SPEAKER";
    }
  }

  getPullGroup() {
    const current = this.stepStatus[this.stepStatus.length - 1];
    if (current) {
    if (current.owner === "CPL_ASSISTANT") {
      this.fromPool = "Assistant";
    } else if (current.owner === "CPL_SECTION_OFFICER") {
      this.fromPool = "Section Officer";
    } else if (current.owner === "CPL_UNDER_SECRETARY") {
      this.fromPool = "Under Secretary";
    } else if (current.owner === "CPL_DEPUTY_SECRETARY") {
      this.fromPool = "Deputy Secretary";
    } else if (current.owner === "CPL_JOINT_SECRETARY") {
      this.fromPool = "Joint Secretary";
    } else if (current.owner === 'CPL_ADDITIONAL_SECRETARY') {
      this.fromPool = "Additional Secretary";
    } else if (current.owner === "SECRETARY") {
      this.fromPool = "Secretary";
    } else if (current.owner === 'CPL_SPECIAL_SECRETARY') {
      this.fromPool = "Special Secretary";
    } else if (current.owner === "SPEAKER") {
      this.fromPool = "Speaker";
    }
   }
  }

  forwardFile(fileId) {
    if (this.forwardActionRow > 9 && !this.fileDocsArray.delayStatementRecived) {
      this.notification.create('warning',
      'Warning',
      'Cannot forward to ' + this.forwardAssigneeGroup.toLowerCase() + ' without delay statement!');
    } else {
      const current = this.stepStatus[this.stepStatus.length - 1];
      if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
          this.popConfirm = true;
          if (this.skip) {
            this.showSkipModal = true;
          } else {
            const body = {
              processInstanceId: this.fileDocsArray.fileResponse.workflowId,
              action: "FORWARD",
              groupId: this.forwardAssigneeGroup,
              fromGroup: this.fromGroup,
              assignee: this.forwardAssignee,
              remark: this.reason,
              skipped: this.showSkipModal
            };
            this.fileService.forwardFile(body, fileId).subscribe((Res) => {
            this.notification.create(
              "success",
              "Success",
              "File " + this.forwardText + "ed Successfully!"
            );
            this.showSkipModal = false;
            this.selectedRole = null;
            this.router.navigate(["business-dashboard/cpl/files"]);
          });
         }
        } else {
          this.notification.create("warning", "Warning", "Please Add Note!");
        }
    }
  }

  pullFile() {
      this.getPullGroup();
      const current = this.stepStatus[this.stepStatus.length - 1];
      const fromRow = this.workFlowUsers.find(
        (user) => user.code === current.owner
      );
      const groupRow = this.workFlowUsers.find(
        (user) => user.code === this.currentPool
      );
      const body = {
          processInstanceId: this.fileDocsArray.fileResponse.workflowId,
          action: 'FORWARD',
          groupId: this.currentPool,
          fromGroup: this.pullGroup,
          assignee: this.user.userId,
          remark: this.reason
        };
      if (fromRow && groupRow && (groupRow.actionRow > fromRow.actionRow)) {
            this.fileService.pullFile(body, this.fileId).subscribe((Res) => {
              this.pullModal = false;
              this.notification.create(
                "success",
                "Success",
                "File pulled Successfully!"
              );
              this.getWorkflowStatus();
              this.getLogs(this.fileId);
            });
        } else {
              this.notification.create("warning", "Warning", "You cannot pull from higher authority!");
        }
  }

  pullOrNot() {
    this.getPullGroup();
    const current = this.stepStatus[this.stepStatus.length - 1];
    const fromRow = this.workFlowUsers.find(
      (user) => user.code === current.owner
    );
    const groupRow = this.workFlowUsers.find(
      (user) => user.code === this.currentPool
    );
    if (fromRow && groupRow && groupRow.actionRow > fromRow.actionRow) {
      this.canPull = true;
    } else {
      this.canPull = false;
    }
  }

  approveFile(fileId) {
  if (this.fileDocsArray.delayStatementRecived) {
    if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
      this.markAsApprroved(fileId);
    } else {
      let noteContent: any = "";
      if (this.fileDocsArray.type === "LIST") {
        noteContent =
          "List approved and circulation need to be done with laying date " +
          this.datepipe.transform(
            this.fileDocsArray.cplList.latestList.layingDate,
            "dd-MM-yyyy"
          );
      } else if (this.fileDocsArray.type === "AMENDMENT") {
        if (this.unifyDate && this.layingDate !== null) {
          noteContent =
            "Approved for the consideration of amendments with laying date " +
            this.datepipe.transform(this.layingDate, "dd-MM-yyyy");
        }
        noteContent = "Approved for the consideration of amendments";
      } else if (this.ratification) {
        noteContent = this.fileDocsArray.type + " File Approved Subjected to Ratification";
      } else {
        noteContent = this.fileDocsArray.type + " file approved";
      }
      const body = {
        fileId: this.fileId,
        note: noteContent,
        referenceBusiness: [0],
        referenceRules: [0],
        temporary: false,
        userId: this.user.userId,
      };
      this.fileService.addNote(body).subscribe((Res) => {
        this.notes = Res;
        this.latestNote = this.notes[this.notes.length - 1];
        this.getLogs(this.fileId);
        this.inputValue = null;
        this.currentRuleStatement = null;
        this.markAsApprroved(fileId);
      });
    }
  } else {
    this.notification.create(
      'warning',
      'Warning',
      'Delay statement not recieved! Please request for delay statement.'
    );
  }
  }

  markAsApprroved(fileId) {
    this.popConfirm = true;
    const body = {
      fromGroup: this.fromGroup,
      approvedById: this.user.userId,
      ratification: this.ratification,
    };
    if (this.fileDocsArray.type === "LIST") {
      this.onApproveDocListPDF(fileId);
    } else if (this.fileDocsArray.type === "AMENDMENT") {
      this.onApproveAmendmentListPDF(fileId);
    } else {
      const body = {
        fromGroup: this.fromGroup,
        approvedById: this.user.userId,
        ratification: this.ratification,
      };
      this.fileService.approveFile(body, fileId).subscribe((Res) => {
        this.getFileById(this.fileId);
        this.selectedRole = null;
        this.notification.create(
          "success",
          "Success",
          "File approved Successfully!"
        );
      });
    }
  }

  returnFile(fileId) {
    if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
      const body = {
        fromGroup: this.fromGroup,
        previousUser: true,
      };
      this.fileService.returnFile(body, fileId).subscribe((Res) => {
        // this.getFileById(this.fileId);
        // this.getWorkflowStatus();
        this.selectedRole = null;
        this.notification.create(
          "success",
          "Success",
          "File returned Successfully!"
        );
        this.router.navigate(["business-dashboard/cpl/files"]);
      });
    } else {
      this.notification.create("warning", "Warning", "Please Add Note!");
    }
  }

  getWorkflowStatus() {
    let tempId;
    if (this.fileDocsArray.fileResponse.status === 'CLOSURE_PENDING') {
      tempId = this.fileDocsArray.fileResponse.fileClosureId;
    } else {
      tempId = this.fileDocsArray.fileResponse.workflowId;
    }
    this.fileService
      .checkWorkFlowStatus(tempId)
      .subscribe((Res) => {
        this.stepStatus = Res;
        const current = this.stepStatus[this.stepStatus.length - 1];
        this.currentPoolUser = current.owner;
        this.assignee = parseInt(current.assignee, 10);
        this.getCurrentPool();
        if (this.fileDocsArray.fileResponse.status !== "APPROVED" && this.fileDocsArray.fileResponse.status !== "CLOSED") {
          this.getWorkFLowUsers();
        }
      });
  }

  getWorkFLowUsers() {
    let tempId;
    if (this.fileDocsArray.fileResponse.status === 'CLOSURE_PENDING') {
      tempId = this.fileDocsArray.fileResponse.fileClosureId;
    } else {
      tempId = this.fileDocsArray.fileResponse.workflowId;
    }
    this.fileService
      .getWorkflowActionUsers(
        tempId,
        this.fileDocsArray.fileResponse.fileId
      )
      .subscribe((Res) => {
        this.workFlowUsers = Res;
        for (var user of this.workFlowUsers) {
          if (this.currentPoolUser === user.code) {
            this.currentUserActionRow = user.actionRow;
            break;
          }
        }
        this.pullOrNot();
      });
  }

  getCurrentPool() {
    if (this.user.authorities.includes("assistant")) {
      this.currentPool = "CPL_ASSISTANT";
      this.pullGroup = "Assisstant";
      this.currentActionName = "Assistant";
    } else if (this.user.authorities.includes("sectionOfficer")) {
      this.currentPool = "CPL_SECTION_OFFICER";
      this.pullGroup = "Section Officer";
      this.currentActionName = "SectionOfficer";
    } else if (this.user.authorities.includes("underSecretary")) {
      this.currentPool = "CPL_UNDER_SECRETARY";
      this.pullGroup = "Under Secretary";
      this.currentActionName = "UnderSecretary";
    } else if (this.user.authorities.includes("deputySecretary")) {
      this.currentPool = "CPL_DEPUTY_SECRETARY";
      this.pullGroup = "Deputy Secretary";
      this.currentActionName = "DeputySecretary";
    } else if (this.user.authorities.includes("jointSecretary")) {
      this.currentPool = "CPL_JOINT_SECRETARY";
      this.pullGroup = "Joint Secretary";
      this.currentActionName = "JS/AS/SS";
    } else if (this.user.authorities.includes("additionalSecretary")) {
      this.currentPool = "CPL_JOINT_SECRETARY";
      this.pullGroup = "Additional Secretary";
      this.currentActionName = "JS/AS/SS";
    } else if (this.user.authorities.includes("secretary")) {
      this.currentPool = "SECRETARY";
      this.pullGroup = "Secretary";
      this.currentActionName = "Secretary";
    } else if (this.user.authorities.includes("specialSecretary")) {
      this.currentPool = "CPL_JOINT_SECRETARY";
      this.pullGroup = "Special Secretary";
      this.currentActionName = "JS/AS/SS";
    } else if (this.user.authorities.includes("speaker")) {
      this.currentPool = "SPEAKER";
      this.pullGroup = "Speaker";
      this.currentActionName = "Speaker";
    }
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

  onSearch() {
    if (this.searchDoc) {
      this.filteredDocList = this.filteredDocs.filter(
        (element) =>
          (element.currentNumber.toString() &&
            element.currentNumber.toString().includes(this.searchDoc)) ||
          (element.typeName &&
            element.typeName
              .toLowerCase()
              .includes(this.searchDoc.toLowerCase()))
      );
    } else {
      this.filteredDocList = this.filteredDocs;
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(
      ({ disabled }) => !disabled
    );
    this.checked = listOfEnabledData.every(({ id }) =>
      this.setOfCheckedId.has(id)
    );
    this.indeterminate =
      listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) &&
      !this.checked;
  }

  getDoCList() {
    const body = {
      assemblyId: this.fileDocsArray.fileResponse.assemblyId,
      ministerDepartmentId: null,
      portfolioId: null,
      sessionId: this.fileDocsArray.fileResponse.sessionId,
      status: null,
      subtype: null,
      type: null,
      userId: this.user.userId,
    };
    if (this.filteredDocList.length === 0) {
      this.docService.getPendingForActionDocs(body).subscribe((Response) => {
        this.DocList = Response;
        this.listOfDoc = this.DocList;
        for (const doc of this.DocList) {
          if (
            this.fileDocsArray.fileResponse.subtype !== "SRO" &&
            this.fileDocsArray.fileResponse.subtype !== "ACT" &&
            this.fileDocsArray.fileResponse.subtype !== "ORDINANCE"
          ) {
            if (
              doc.subType === this.fileDocsArray.fileResponse.subtype &&
              doc.ministerDepartmentId === this.ministerDepartmentId &&
              doc.fileId === null &&
              (doc.status === "SAVED" || doc.status === "DEPARTMENT_DRAFT")
            ) {
              this.filteredDocList.push(doc);
            }
          } else if (
            doc.type === this.fileDocsArray.fileResponse.subtype &&
            doc.ministerDepartmentId === this.ministerDepartmentId &&
            doc.fileId === null &&
            (doc.status === "SAVED" || doc.status === "DEPARTMENT_DRAFT")
          ) {
            this.filteredDocList.push(doc);
          }
        }
        this.filteredDocs = this.filteredDocList;
        this.enableAttach = false;
      });
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  attachToFile() {
    const file = new CplFile();
    file.docIds = [...this.setOfCheckedId];
    file.fileFormDto = {
      fileId: this.fileDocsArray.fileResponse.fileId,
      fileNumber: this.fileDocsArray.fileResponse.fileNumber,
      userId: this.user.userId,
      subtype: this.fileDocsArray.fileResponse.subtype,
      assemblyId: this.fileDocsArray.fileResponse.assemblyId,
      description: this.fileDocsArray.fileResponse.description,
      priority: this.fileDocsArray.fileResponse.priority,
      sectionId: this.fileDocsArray.fileResponse.sectionId,
      sessionId: this.fileDocsArray.fileResponse.sessionId,
      subject: this.fileDocsArray.fileResponse.subject
    };
    const body = {
      docIds: file.docIds,
      fileFormDto: file.fileFormDto,
    };
    if (this.fileDocsArray.type !== "AMENDMENT") {
      this.fileService.createRegistrationList(body).subscribe((Res) => {
        this.setOfCheckedId = new Set<any>();
        this.getFileById(this.fileDocsArray.fileResponse.fileId);
      });
    } else {
      this.docService.createAmendementList(body).subscribe((Res) => {
        this.setOfCheckedId = new Set<any>();
        this.getFileById(this.fileDocsArray.fileResponse.fileId);
      });
    }
  }

  getCPLButtons() {
    return {
      Forward: false,
      Approve: false,
      Edit: false,
      Return: false,
      Create: false,
      Update: false,
      Read: false,
      FileClosure: false
    };
  }

  loadCPLButtons() {
    if (this.commonService.doIHaveAnAccess("BUTTONS", "FORWARD")) {
      this.cplButtons.Forward = true;
    }

    if (this.commonService.doIHaveAnAccess("BUTTONS", "APPROVE")) {
      this.cplButtons.Approve = true;
    }

    if (this.commonService.doIHaveAnAccess("BUTTONS", "UPDATE")) {
      this.cplButtons.Edit = true;
    }

    if (this.commonService.doIHaveAnAccess("BUTTONS", "BACKWARD")) {
      this.cplButtons.Return = true;
    }
    if (this.commonService.doIHaveAnAccess("DELAY_STATEMENT", "READ")) {
      this.cplButtons.Read = true;
    }
    if (this.commonService.doIHaveAnAccess("DELAY_STATEMENT", "UPDATE")) {
      this.cplButtons.Update = true;
    }
    if (this.commonService.doIHaveAnAccess("DELAY_STATEMENT", "CREATE")) {
      this.cplButtons.Create = true;
    }
    if (this.commonService.doIHaveAnAccess("AMENDMENT_DATE", "UPDATE")) {
      this.unifyDate = true;
      this.getDateList();
    }
    if (this.commonService.doIHaveAnAccess("PULL_BUTTON", "READ")) {
      this.pullButton = true;
    }
    if (this.commonService.doIHaveAnAccess("FILE_RATIFICATION", "APPROVE")) {
      this.ratificationApprove = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE_CLOSURE', 'READ')) {
      this.cplButtons.FileClosure = true;
    }
  }

  showPdfModal(attachment, isMainOrDelay) {
    this.docUrl = "";
    let viewable;

    switch (isMainOrDelay) {
      case "main": {
        for (const att of attachment) {
          if (att.isMainDocument === true) {
            this.docUrl = att.attachmentUrl;
            viewable = att.isViewable;
          }
        }
        break;
      }
      case "delay": {
        for (const att of attachment) {
          if (att.isDelayStatement === true) {
            this.docUrl = att.attachmentUrl;
            viewable = att.isViewable;
          }
        }
        break;
      }
      case "rule": {
        for (const att of attachment) {
          if (att.isStatementAsPerRule === true) {
            this.docUrl = att.attachmentUrl;
            viewable = att.isViewable;
          }
        }
        break;
      }
      case "cover": {
        for (const att of attachment) {
          if (att.isLetter === true) {
            this.docUrl = att.attachmentUrl;
            viewable = att.isViewable;
          }
        }
        break;
      }
      case 'correction': {
        for (const att of attachment) {
          if (att.isCorrection === true) {
            this.docUrl = att.attachmentUrl;
            viewable = att.isViewable;
          }
        }
        break;
      }
      default: {
        this.docUrl = attachment.attachmentUrl;
        viewable = attachment.isViewable;
        break;
      }
    }
    if (this.docUrl !== '' && viewable) {
      this.isPdfVisible = true;
    } else if (this.docUrl === '') {
      this.nothingToView = true;
     } else {
      this.showConfidental();
    }
  }

  editDoc(docId, deptDoc) {
    if (deptDoc) {
      this.router.navigate(["business-dashboard/cpl/cpl-view", "view", docId]);
    } else {
      this.router.navigate(["business-dashboard/cpl/cpl-view", "edit", docId]);
    }
  }

  editDocPrep(listId) {
    this.router.navigate([
      "business-dashboard/cpl/document-preparation",
      listId,
    ]);
  }

  tabContents() {
    this.tabs = [];
    this.extraTabs = [];
    if (
      this.fileDocsArray.type !== "LIST" &&
      this.fileDocsArray.type !== "AMENDMENT"
    ) {
      if (this.fileDocsArray.cplDocuments.length > 3) {
        for (let i = 0; i < 3; i++) {
          this.tabs.push(this.fileDocsArray.cplDocuments[i]);
        }
        for (let i = 3; i < this.fileDocsArray.cplDocuments.length; i++) {
          this.extraTabs.push(this.fileDocsArray.cplDocuments[i]);
        }
      } else {
        this.tabs = this.fileDocsArray.cplDocuments;
      }
      if (this.fileDocsArray.cplDocuments.length > 0) {
        this.portId = this.fileDocsArray.cplDocuments[0].portfolioId;
        this.ministerDepartmentId = this.fileDocsArray.cplDocuments[0].ministerDepartmentId;
      } else {
        this.portId = 0;
        this.ministerDepartmentId = 0;
      }
    } 
  }

  changeTabContents(doc) {
    this.extraTabs.splice(this.extraTabs.indexOf(doc), 1);
    this.extraTabs.push(this.tabs[2]);
    this.tabs.pop();
    this.tabs.unshift(doc);
  }

  hideModal() {
    this.isPdfVisible = false;
    this.docUrl = "";
    this.attachment = null;
  }

  setDelayStatementStatus(data) {
    this.fileDocsArray.cplDocuments.filter((element) => data);
  }

  goBack() {
    if (this.urlParams) {
      this.router.navigate(['business-dashboard/cpl/files'], {
        state: this.urlParams ? this.urlParams : null
      });
    } else {
      window.history.back();
    }
  }

  ForwardOrReturn() {
    let arrForwardUerInfo = this.selectedRole.split("-");
    this.forwardActionRow = arrForwardUerInfo[1];
    this.forwardAssignee = arrForwardUerInfo[0];
    this.forwardAssigneeGroup = arrForwardUerInfo[2];
    // console.log(forwardActionRow)
    //console.log(this.currentUserActionRow)
    if (
      this.currentUserActionRow === null ||
      this.forwardActionRow >= this.currentUserActionRow
    ) {
      this.forwardText = 'Forward';
      this.forwardReturnBtn = 'noticeprocessing.noticeprocess.forward';
    } else {
      this.forwardText = 'Return';
      this.forwardReturnBtn = 'cpl.uploadedlist.return';
    }
    if (this.forwardActionRow > this.currentUserActionRow + 1) {
      this.skip = true;
    } else {
      this.skip = false;
    }
  }
 
  sendCorrespondence(data) {
    const currentCplDocument = this.fileDocsArray.cplDocuments.find(
      (element) => element.id == data.documentId
    );
    let body = {
      fromType: "SECTION",
      toType: "DEPARTMENT",
      fromId: this.fileDocsArray.fileResponse.sectionId,
      toId: currentCplDocument.ministerDepartmentId,
      templateId: data.templateId,
      referId: data.documentId,
      referType: "CPL", 
      referSubType: currentCplDocument.type,
      assemblyId: currentCplDocument.assemblyId,
      sessionId: currentCplDocument.sessionId,
      htmlContent: data.data,
      userId: this.user.userId,
      subject: currentCplDocument.typeName,
    };

    this.fileService
      .sendCorrespondence(body, this.fileId, data.fileDocumentId)
      .subscribe((res) => {
        if (res) {
          data.status = "SUBMITTED";
          this.notification.success("Success", "Succesfully sent..");
        }
      });
  }

  public openPDF(): void {
    let neVal = this.htmlData.nativeElement.querySelectorAll(".table_blkp");
    let doc = new jsPdf("p", "pt");
    let i = 0;
    let totalCount = neVal.length;
    doc.autoTable({ html: "#head1" });
    neVal.forEach(function (value) {
      doc.autoTable({ html: "#head_" + i });
      doc.autoTable({ html: "#table_" + i });

      i++;
      // if (i === totalCount) {
      //   doc.output("dataurlnewwindow");
      // }
    });
    doc.autoTable({ html: "#foot1" });
    if (i === totalCount) {
    doc.output("dataurlnewwindow");
    }
  }

  public openPDF1(): void {
    let doc1 = new jsPdf("p", "pt");
    let outputPdf;
    this.versionArray.documentsByPortfolioDtos.forEach(function (tableCont) {
      if (
        tableCont.type === "ORDINANCE" ||
        tableCont.type === "SRO" ||
        tableCont.type === "REPORT"
      ) {
        doc1.autoTable({
          body: [["List", 14 + "Kerala NiyamaSabha"]],
        });
      }
      if (
        tableCont.type === "ORDINANCE" ||
        tableCont.type === "SRO" ||
        tableCont.type === "REPORT"
      ) {
        doc1.autoTable({
          body: [
            [
              "Minister: " +
                tableCont.minister +
                ", " +
                tableCont.portfolioName,
              "Document Type: " + tableCont.type,
            ],
          ],
        });
        let tabBody = [];
        let tabHead: any;
        let i = 1;
        doc1.autoTable({
          head: [tabHead],
          body: tabBody,
          styles: {
            cellWidth: "auto",
            overflow: "linebreak",
            minCellWidth: 20,
          },
        });
      }
    });

    outputPdf = doc1.output("blob");

    doc1.output("dataurlnewwindow");
    var data = new FormData();
  }

  public onApproveAmendmentListPDF(fileId): void {
    let doc1 = new jsPdf("p", "pt");
    let outputPdf;
    doc1.autoTable({
      body: [
        [
          "Document Name: " + this.fileDocsArray.amendments.typeName,
          "Document Type: " + this.fileDocsArray.amendments.type,
        ],
        [
          "Department: " + this.fileDocsArray.amendments.ministerDepartmentName,
          "File Id: " + this.fileDocsArray.amendments.regFileNumber,
        ],
      ],
    });

    let tabBody = [];
    let tabHead: any;
    tabHead = [
      "Sl. No.",
      "Minister Name",
      "Amendment Content",
      "Laying Date",
      "Notice Number",
    ];
    let i = 1;

    this.fileDocsArray.amendments.cplAmendmets.forEach(function (tableCont) {
      tabBody.push([
        i,
        tableCont.memberName,
        tableCont.content,
        tableCont.layingDate  ,
        tableCont.noticeNumber,
      ]);
      i++;
    });

    doc1.autoTable({
      head: [tabHead],
      body: tabBody,
      styles: {
        cellWidth: "auto",
        overflow: "linebreak",
        minCellWidth: 20,
      },
    });

    outputPdf = doc1.output("blob");

    //doc1.output('dataurlnewwindow');

    var data = new FormData();
    data.set("file", outputPdf, fileId + "_Amendment-List.pdf");
    this.fileService.uploadPDF(data).subscribe((Res) => {
      const body = {
        fromGroup: this.fromGroup,
        approvedById: this.user.userId,
        pdfDocURL: Res["body"],
        layingDate: this.layingDate,
        ratification: this.ratification,
      };

      this.fileService.approveFile(body, fileId).subscribe((Res) => {
        this.getFileById(this.fileId);
        this.selectedRole = null;
        this.notification.create(
          "success",
          "Success",
          "File approved and Amendment List added to LOB Successfully!"
        );
      });
    });
  }

  private onApproveDocListPDF(fileId): void {
    let doc1 = new jsPdf("p", "pt");
    let outputPdf;
    let textTitle = this.versionArray.title;
    let xOffset =
      doc1.internal.pageSize.width / 2 -
      (doc1.getStringUnitWidth(textTitle) * doc1.internal.getFontSize()) / 2;
    doc1.text(textTitle, xOffset, 20);
    this.versionArray.documentsByPortfolioDtos.forEach(function (tableCont) {
      if (
        tableCont.type === "ORDINANCE" ||
        tableCont.type === "SRO" ||
        tableCont.type === "REPORT" ||
        tableCont.type === "ACT"
      ) {
        doc1.autoTable({
          body: [
            [
              tableCont.type === "ACT"
                ? "Secretary: "
                : "Minister: " +
                  tableCont.minister +
                  ", " +
                  tableCont.portfolioName,
              "Document Type: " + tableCont.type,
            ],
          ],
        });
        let tabBody = [];
        let tabHead: any;
        let i = 1;

        tableCont.documentMetaDatas.forEach(function (tableCont) {
          if (tableCont.type === "ORDINANCE") {
            if (i === 1) {
              tabHead = [
                "Sl. No.",
                "ORDINANCE Year",
                "ORDINANCE Number",
                "ORDINANCE Name",
                "isStatementAsPerRule",
              ];
            }
            tabBody.push([
              i,
              tableCont.date,
              tableCont.typeNumber,
              tableCont.typeName,
              tableCont.isStatementAsPerRule ? "Yes" : "No",
            ]);
          } else if (tableCont.type === "SRO") {
            if (i === 1) {
              tabHead = [
                "Sl. No.",
                "SRO Name",
                "SRO Number",
                "SRO Date",
                "Delay Statement?",
              ];
            }
            tabBody.push([
              i,
              tableCont.typeName,
              tableCont.typeNumber,
              tableCont.typeDate,
              tableCont.isDelayed ? "RECEIVED" : "NOT NEEDED",
            ]);
          } else if (tableCont.type === "REPORT") {
            if (i === 1) {
              tabHead = [
                "Sl. No.",
                "Institution Name",
                "Report Year",
                "Report Type",
                "Delay Statement?",
              ];
            }
            tabBody.push([
              i,
              tableCont.nameOfInstitution,
              tableCont.typeYear,
              tableCont.subType,
              tableCont.isDelayed ? "RECEIVED" : "NOT NEEDED",
            ]);
          } else if (tableCont.type === "ACT") {
            if (i === 1) {
              tabHead = [
                "Sl. No.",
                "Act Number",
                "Act Name",
                "Act Year",
                "Delay Statement?",
              ];
            }
            tabBody.push([
              i,
              tableCont.typeNumber,
              tableCont.typeName,
              tableCont.typeYear,
              tableCont.isDelayed ? "RECEIVED" : "NOT NEEDED",
            ]);
          }
          i++;
        });
        doc1.autoTable({
          head: [tabHead],
          body: tabBody,
          styles: {
            cellWidth: "auto",
            overflow: "linebreak",
            minCellWidth: 20,
          },
        });
      }
    });

    outputPdf = doc1.output("blob");

    //doc1.output('dataurlnewwindow');
    var data = new FormData();
    data.set("file", outputPdf, fileId + "_Documents-List.pdf");
    this.fileService.uploadPDF(data).subscribe((Res) => {
      const body = {
        fromGroup: this.fromGroup,
        approvedById: this.user.userId,
        pdfDocURL: Res["body"],
        ratification: this.ratification,
      };
      this.fileService.approveFile(body, fileId).subscribe((Res) => {
        this.getFileById(this.fileId);
        // this.getWorkflowStatus();
        this.selectedRole = null;
        this.notification.create(
          "success",
          "Success",
          "File approved and Document List added to LOB Successfully!"
        );
      });
    });
  }

  public downloadPDF(): void {
    let DATA = this.htmlData.nativeElement;
    let doc = new jsPdf("p", "pt");
    let handleElement = {
      "#editor": function (element, renderer) {
        return true;
      },
    };
    doc.fromHTML(DATA.innerHTML, 15, 15, 15, 15, 15, {
      width: 200,
      elementHandlers: handleElement,
    });

    doc.save("angular-demo.pdf");
  }

  captureScreen() {
    let doc = new jsPdf("p", "pt");
    doc.autoTable({ html: "#data" });
    doc.autoTable({ html: "#mladata" });

    var blob = doc.output("blob");
    var w = window.open(URL.createObjectURL(blob));
  }

  printableScreen() {
    const mediaType = 'application/pdf';
    this.fileService.getPdfList(this.fileId).subscribe((res: any) => {
      const temp: any = res;
      const blob = new Blob([temp], { type: mediaType });
      this.listPdfUrl = URL.createObjectURL(blob);
      this.printable = true;
    });
  }

  cancelPrint() {
    this.printable = false;
  }

  showNoticePdf(url) {
    this.docUrl = url;
    this.isPdfVisible = true;
  }

  showAmendttachModal() {
    this.amendmentModal = true;
    this.getAmendmentList();
  }

  onAmendSearch() {
    if (this.searchAmendment) {
      this.filteredAmendList = this.tempAmendmentList.filter(
        (element) =>
          element.typeNumber
            .toLowerCase()
            .includes(this.searchAmendment.toLowerCase()) ||
          element.typeName
            .toLowerCase()
            .includes(this.searchAmendment.toLowerCase()) ||
          element.noticeNumber
            .toLowerCase()
            .includes(this.searchAmendment.toLowerCase())
      );
    } else {
      this.filteredAmendList = this.tempAmendmentList;
    }
  }

  getAmendmentList() {
    this.docService.getAllAmendments().subscribe((res) => {
      const amendMentList: any = res;
      this.filteredAmendList = amendMentList.filter(
        (element) =>
          element.documentId.includes(this.fileDocsArray.amendments.id) &&
          element.status === "LAYING_APPROVED"
      );
      this.tempAmendmentList = this.filteredAmendList;
    });
  }

  showUnifyModal() {
    this.unifyModal = true;
  }

  getDateList() {
    this.docService.getDates("", "").subscribe((Res) => {
      this.dateList = Res;
      this.disabledCosDates = (current: Date): boolean => {
        const todayDate =
          current.getFullYear() +
          "-" +
          ("0" + (current.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + current.getDate()).slice(-2);
        return !this.dateList.find((item) => item === todayDate);
      };
    });
  }

  viewAmendment(id) {
    this.router.navigate(["business-dashboard/cpl/amendment-view", id]);
  }
  showConfidental() {
    this.isconfidential = true;
  }

  viewDocument(id) {
    this.router.navigate(["business-dashboard/cpl/cpl-view", "view", id]);
  }

  showUpdateStatus() {
    this.updateModal = true;
  }

  updateStatus() {
    this.fileService
      .updateFileStatus(this.fileId, this.updatedStatus)
      .subscribe((Res) => {
        this.updateModal = false;
        this.updatedStatus = null;
        this.notification.create(
          "success",
          "Success",
          "File status updated successfully!"
        );
        this.getFileById(this.fileId);
      });
  }

  showPriorityModal() {
    this.priorityModal = true;
  }
  editPriority() {
    this.priorityModal = false;
    const body = {
      assemblyId: this.fileDocsArray.fileResponse.assemblyId,
      assigedTo: 0,
      createdDate: this.fileDocsArray.fileResponse.createdDate,
      currentNumber: this.fileDocsArray.fileResponse.currentNum,
      description: this.fileDocsArray.fileResponse.description,
      fileId: this.fileDocsArray.fileResponse.fileId,
      fileNumber: this.fileDocsArray.fileResponse.fileNumber,
      priority: this.filePriority,
      sectionId: this.fileDocsArray.fileResponse.sectionId,
      sessionId: this.fileDocsArray.fileResponse.sessionId,
      status: this.fileDocsArray.fileResponse.status,
      subject: this.fileDocsArray.fileResponse.subject,
      subType: this.fileDocsArray.fileResponse.subType,
      type: this.fileDocsArray.fileResponse.type,
      userId: this.user.userId,
      workflowId: this.fileDocsArray.fileResponse.workflowId,
    };
    this.fileService
      .updateFile(body, this.fileDocsArray.fileResponse.fileId)
      .subscribe((Res) => {
        this.getFileById(this.fileId);
        this.getLogs(this.fileId);
      });
  }

  viewFile(fileId) {
    this.router.navigate(["business-dashboard/cpl/file-workflow", fileId]);
  }

  closeModel() {
    this.isconfidential = false;
    this.nothingToView = false;
  }

  showPullModal() {
    if (!this.cplButtons.Create && !this.fileDocsArray.delayStatementRecived &&
      (this.fromGroup === 'Secretary' || this.fromGroup === 'Speaker')) {
      this.notification.create('warning',
      'Warning',
      'This file cannot be pulled because delay statement is not attached!');
    } else {
    this.pullModal = true;
    }
  }

  ratificationApproveFile(fileId) {
    if (this.fileDocsArray.delayStatementRecived) {
      this.ratification = true;
      this.approveFile(fileId);
    } else {
      this.notification.create(
        'warning',
        'Warning',
        'Delay statement not recieved! Please request for delay statement.'
      );
    }
  }

  getCorrespondenceFile() {
    this.correspondenceService.getCorrespondenceFile(this.fileId).subscribe(Res => {
      this.correspondenceData = Res;
    });
  }

 letterList(business, data) {
    if (business) {
      if (this.correspondenceData.businessMap) {
        this.letterTableData = this.correspondenceData.businessMap[data.id];
      }
      this.commonService.getSubjectById(data.ministerDepartmentId).subscribe((Res: any) => {
      this.urlData = {
        business: 'NO_BUSINESS',
        type: 'CPL_SECTION',
        fileId: data.fileId,
        businessReferId: data.id,
        businessReferType: data.type,
        businessReferSubType: data.subType,
        businessReferNumber: data.typeNumber,
        businessReferName: data.typeName,
        fileNumber: data.regFileNumber,
        departmentId: data.ministerDepartmentId,
        masterLetter: null,
        refrenceLetter: null,
        toCode: Res.code,
        toDisplayName: Res.departmentName
       };
      });
    } else {
      this.letterTableData = this.correspondenceData.correspondenceDto;
      let subType;
      if (this.fileDocsArray.type === 'AMENDMENT') {
        subType = 'AMENDMENT_LIST';
      } else {
        subType = null;
      }
      this.urlData = {
        business: 'NO_BUSINESS',
        type: 'CPL_SECTION',
        fileId: this.fileId,
        businessReferId: null,
        businessReferType: null,
        businessReferSubType: subType,
        businessReferNumber: null,
        businessReferName: null,
        fileNumber: this.fileDocsArray.fileResponse.fileNumber,
        departmentId: null,
        masterLetter: null,
        refrenceLetter: null,
        toCode: null,
        toDisplayName: null
      };
    }
 }

  showLetterModal() {
    this.letterModal = true;
  }

  showLetter(id, workflow) {
    if (workflow) {
      this.router.navigate([
        'business-dashboard/correspondence/correspondence-workflow',
        id
      ]);
    } else {
      this.router.navigate([
        'business-dashboard/correspondence/correspondence',
        'view',
        id
      ]);
    }
  }

  draftCorrespondence() {
    this.router.navigate(['business-dashboard/correspondence/select-template'], {
      state: this.urlData
    });
  }

  getspeakerNote() {
    const mediaType = 'application/pdf';
    this.fileService.getSpeakerNote(this.fileId).subscribe(Res => {
      if (Res) {
        const temp: any = Res;
        const blob = new Blob([temp], { type: mediaType });
        this.speakerNoteUrl = URL.createObjectURL(blob);
        this.viewSpeakerNote = true;
      }
    });
  }

  hideSpeakerNote() {
    this.viewSpeakerNote = false;
  }

  fileClosure() {
    this.fileService.fileClosure(this.fileId, this.user.userId).subscribe(Res => {
      this.notification.create(
        'success',
        'Success',
        'File closure initiated successfully!'
      );
      this.getFileById(this.fileId);
      this.getLogs(this.fileId);
    });
  }

  forwardClosureFile() {
    if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
    if (this.skip) {
      this.showSkipModal = true;
    } else {
    const body = {
      processInstanceId: this.fileDocsArray.fileResponse.fileClosureId,
      action: 'FORWARD',
      groupId: this.forwardAssigneeGroup,
      fromGroup: this.fromGroup,
      assignee: this.forwardAssignee,
      remark: this.reason,
      skipped: this.showSkipModal
    };
    this.fileService.forwardFileClosure(body, this.fileId).subscribe((Res) => {
    this.notification.create(
      'success',
      'Success',
      'File for Closure ' + this.forwardText + 'ed Successfully!'
    );
    this.router.navigate(['business-dashboard/cpl/files']);
   });
  }
  } else {
    this.notification.create('warning', 'Warning', 'Please Add Note!');
  }
 }

 aprroveClosure() {
  if (this.latestNote && this.latestNote.user.userId === this.user.userId) {
    this.closeFile();
 } else {
    const body = {
      fileId: this.fileId,
      note: 'File closed',
      referenceBusiness: [0],
      referenceRules: [0],
      temporary: false,
      userId: this.user.userId,
    };
    this.fileService.addNote(body).subscribe((Res) => {
      this.notes = Res;
      this.latestNote = this.notes[this.notes.length - 1];
      this.getLogs(this.fileId);
      this.inputValue = null;
      this.currentRuleStatement = null;
      this.closeFile();
    });
  }
 }

 closeFile() {
  const body = {
    fromGroup: this.fromGroup,
    approvedById: this.user.userId
  };
  this.fileService.approveClosure(body, this.fileId).subscribe((Res) => {
    this.getFileById(this.fileId);
    this.notification.create(
      'success',
      'Success',
      'File Closed Successfully!'
    );
  });
 }

 setRole(roles) {
    if (roles.find(x => x.roleName === 'speaker')) {
      return [roles.find(x => x.roleName === 'speaker')];
    } else {
      return roles;
    }
  }

  returnGO(type) {
    if (type === 'SRO') {
      return 'cpl.fileworkflowdocs.gono';
    } else {
      return 'cpl.docpreparion.notificationnumber';
    }
  }

  returnVersion() {
    return 'cpl.filelistflow.version';
  }

  romanize(num) {
    if (isNaN(num))
        return NaN;
    let digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

viewSubFile(fileId, fileType) {
  this.router.navigate([fileType.viewPath, fileId]);
}
}
