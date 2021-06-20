import { Component, OnInit, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { FileServiceService } from "../../shared/services/file-service.service";
import { TablescommonService } from "../../shared/services/tablescommon.service";
import { GovernersAddressService } from "../../shared/services/governersaddress.service";
import { NzNotificationService } from "ng-zorro-antd";
import { DomSanitizer } from "@angular/platform-browser";
import { ElectionService } from "../../shared/services/election.service";

@Component({
  selector: "lib-file-view",
  templateUrl: "./file-view.component.html",
  styleUrls: ["./file-view.component.css"],
})
export class FileViewComponent implements OnInit {
  resume = false;
  bulletinPart1 = false;
  assignee: any;
  currentPoolUser: any;
  allWorkflowUsers: any = [];
  logDetails: any = [];
  stepStatusDetail: any = [];
  userDetails: any = [];
  roleDetails: any = [];
  notesInfo: any = [];
  notesData: any = [];
  userId: any;
  fileId: any;
  fileDetails: any = null;
  showTableContent;
  latestNote: any = null;
  responseAvailable = false;
  errataStatus = "APPROVED";
  bulletinStatus = "APPROVED";
  currentUser: any;
  ballotStatus = "APPROVED";
  objStatus = "LOB APPROVED";
  isEditPrio: boolean;
  priority;
  clauseStatus = "APPROVED";
  tabParams = {};
  reportfullScreenMode = false;
  ratificationStatus = null;
  sectionRole: any;
  assemblyid;
  sessionid;
  urlParams: any;
  letterContent;
  noticeContent;
  m2mPModal = false;
  type: any;
  subType: any;
  letter = {
    business: null,
    letterCode: null,
    letterValue: null,
    letterToGovSec: null,
    toCode: null,
    toDisplayName: null,
    toEditable: null,
    toTypable: null,
    lettertoProtem: null,
    letterToGAD: null,
    letterToTourism: null,
    letterToMembersOnNomination: null,
    businessReferId: null,
    businessReferType: null,
    redirectToModule: null,
    letterToHouseKeeping: null,
  };
  permissions = {
    attachProtemLetters: false,
  };
  reportDatas = {
    protemSpeakerReading: null,
    secretaryReading: null,
    speakerNoteDeputySpk: null,
  };
  showModal = false;
  pendingDocuments: any = null;
  docSelected: any = null;
  docTypeCode: any = null;
  osDocuments: any = {
    cabinateNote: null,
    electionNote: null,
    governorOffice: null,
  };
  voteListfullScreenMode = false;
  printUrl: any = null;
  printVisible = false;

  constructor(
    private route: ActivatedRoute,
    @Inject("authService") private auth,
    private router: Router,
    private file: FileServiceService,
    private common: TablescommonService,
    private governerAddrss: GovernersAddressService,
    private notify: NzNotificationService,
    private sanitizer: DomSanitizer,
    private electionService: ElectionService
  ) {
    this.currentUser = auth.getCurrentUser();
    this.userId = auth.getCurrentUser().userId;
    this.common.setTablePermissions(this.currentUser.rbsPermissions);
  }

  ngOnInit() {
    this.getRbsPermissions();
    this.route.params.subscribe((params) => {
      this.fileId = params.id;
      this.type = params.business;
      if (this.type === "pro-tem-speaker" || this.type === "election") {
        this.getFileByElectionFileId(this.fileId);
      } else if (this.type === "table-diary") {
        this.getFileByResumeFileId(this.fileId);
      } else {
        this.getFileByFileId(this.fileId);
      }
    });
  }
  getFileByElectionFileId(fileId) {
    this.setTabfilters();
    this.file
      .getFileByElectionFileId(fileId, this.userId)
      .subscribe((Response) => {
        if (Response) {
          this.showTableContent = this.route.snapshot.params.business;
          this.fileDetails = Response;
          this.responseAvailable = true;
          if (this.fileDetails.fileResponse.subtype === "PRO_TEM_SPEAKER") {
            this.getOsDocuments();
          }
          this.getNoticeContent();
          this.getFamilyLetter();
          this.getStatusForBlocks();
          if (this.fileDetails.letter) {
            this.getLettersInProtem();
          }
          if (this.fileDetails.reportDatas) {
            this.getReports();
          }
          this.notesInfo = this.fileDetails.fileResponse;
          this.subType = this.notesInfo.subtype;
          if (this.notesInfo) {
            this.latestNote = this.notesInfo.notes[
              this.notesInfo.notes.length - 1
            ];
            this.getWorkflowUsers(this.notesInfo);
            this.getAllNotes(this.notesInfo.fileId);
          }
          this.userDetails = this.fileDetails.fileResponse.user;
          this.roleDetails = this.fileDetails.fileResponse.user.roles;
          this.logDetails = this.fileDetails.fileResponse.logs;
          this.getWorkflowStatus();
          this.handlePDFUrl();
          if (this.fileDetails.fileResponse.ratification) {
            if (this.fileDetails.fileResponse.ratification.length !== 0) {
              const temp = this.fileDetails.fileResponse.ratification.filter(
                (x) => x.sectionRole === this.sectionRole
              );
              if (temp.length !== 0) {
                this.ratificationStatus = temp[0].status;
              }
            }
          }
        }
      });
  }
  getFileByFileId(fileId) {
    this.setTabfilters();
    this.file.getFileById(fileId, this.userId).subscribe((Response) => {
      if (Response) {
        this.showTableContent = this.route.snapshot.params.business;
        this.fileDetails = Response;
        this.responseAvailable = true;
        this.getNoticeContent();
        this.getFamilyLetter();
        this.getStatusForBlocks();
        this.notesInfo = this.fileDetails.fileResponse;
        this.subType = this.notesInfo.subtype;
        if (this.notesInfo) {
          this.latestNote = this.notesInfo.notes[
            this.notesInfo.notes.length - 1
          ];
          this.getWorkflowUsers(this.notesInfo);
          this.getAllNotes(this.notesInfo.fileId);
        }
        this.userDetails = this.fileDetails.fileResponse.user;
        this.roleDetails = this.fileDetails.fileResponse.user.roles;
        this.logDetails = this.fileDetails.fileResponse.logs;
        this.getWorkflowStatus();
        this.handlePDFUrl();
        if (this.fileDetails.fileResponse.ratification) {
          if (this.fileDetails.fileResponse.ratification.length !== 0) {
            const temp = this.fileDetails.fileResponse.ratification.filter(
              (x) => x.sectionRole === this.sectionRole
            );
            if (temp.length !== 0) {
              this.ratificationStatus = temp[0].status;
            }
          }
        }
      }
    });
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
          this.assignee = current.assignee;
        }
      });
  }

  getStatusForBlocks() {
    if (this.fileDetails.errata) {
      const status = this.fileDetails.errata.map((x) => x.status);
      if (status.includes("SUBMITTED")) {
        this.errataStatus = "SUBMITTED";
      } else if (status.includes("WAITING_FOR_SUBMISSION")) {
        this.errataStatus = "WAITING_FOR_SUBMISSION";
      }
    }
    if (this.fileDetails.bulletins) {
      const status = this.fileDetails.bulletins.map((x) => x.fileStatus);
      if (status.includes("SUBMITTED")) {
        this.bulletinStatus = "SUBMITTED";
      }
    }
    if (this.fileDetails.ballot) {
      const status = this.fileDetails.ballot.map((x) => x.status);
      if (status.includes("SUBMITTED")) {
        this.ballotStatus = "SUBMITTED";
      }
    }
    if (this.fileDetails.objections) {
      const status = this.fileDetails.objections.map((x) => x.status);
      if (status.includes("LOB_PENDING")) {
        this.objStatus = "LOB PENDING";
      }
    }
    if (this.fileDetails.clauseByClauseList) {
      const clauseStatus = this.fileDetails.clauseByClauseList.map(
        (x) => x.listStatus
      );
      if (clauseStatus.includes("SUBMITTED")) {
        this.clauseStatus = "SUBMITTED";
      } else if (clauseStatus.includes("APPROVED")) {
        this.clauseStatus = "APPROVED";
      } else if (clauseStatus.includes("PUBLISHED")) {
        this.clauseStatus = "PUBLISHED";
      }
    }
  }

  getVersion() {}
  edit() {}
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

  showCurrentTab(key, canEdit) {
    this.tabParams["showIndex"] = 1;
    this.tabParams["showBtn"] = canEdit;
    this.tabParams["CurrentTab"] = key;
    this.checkIfLetter();
  }
  getWorkflowUsers(notesinfo) {
    if (notesinfo.status !== "APPROVED") {
      this.file
        .getWorkflowActionUsers(notesinfo.workflowId, notesinfo.fileId)
        .subscribe((Res: any) => {
          this.allWorkflowUsers = Res;
        });
    }
  }
  getAllNotes(id) {
    this.file.getAllNotes(id).subscribe((Response) => {
      if (Response) {
        this.notesInfo.notes = Response;
      }
    });
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
      // workflowEngineCode: string: '',
      workflowId: fileResponse.workflowId,
    };
    this.isEditPrio = false;
    this.file.updateFile(this.fileId, body).subscribe((Res) => {
      if (
        this.subType === "PRO_TEM_SPEAKER" ||
        this.subType === "SPEAKER_ELECTION" ||
        this.subType === "DEPUTY_SPEAKER_ELECTION" ||
        this.subType === "PANEL_OF_CHAIRMAN"
      ) {
        this.getFileByElectionFileId(this.fileId);
      } else if (
        this.subType === "TABLE_RESUME" ||
        this.subType === "TABLE_BULLETIN_ONE"
      ) {
        this.getFileByResumeFileId(this.fileId);
      } else {
        this.getFileByFileId(this.fileId);
      }
    });
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

  setTabfilters() {
    this.tabParams = {
      CurrentTab: "",
      showIndex: 0,
    };
  }
  getFile(e) {
    if (
      this.subType === "PRO_TEM_SPEAKER" ||
      this.subType === "SPEAKER_ELECTION" ||
      this.subType === "DEPUTY_SPEAKER_ELECTION" ||
      this.subType === "PANEL_OF_CHAIRMAN"
    ) {
      this.getFileByElectionFileId(e);
    } else if (
      this.subType === "TABLE_RESUME" ||
      this.subType === "TABLE_BULLETIN_ONE"
    ) {
      this.getFileByResumeFileId(this.fileId);
    } else {
      this.getFileByFileId(e);
    }
  }
  addClass() {
    this.reportfullScreenMode = !this.reportfullScreenMode;
  }
  onCancel() {
    this.isEditPrio = false;
  }
  getNoticeContent() {
    if (this.fileDetails.motionOfThanks) {
      let noticeId = this.fileDetails.motionOfThanks[0].noticeId;
      this.file
        .getNoticeTemplateData(noticeId, this.userId)
        .subscribe((res) => {
          this.noticeContent = res.notice.noticeData;
        });
    }
  }
  checkIfLetter() {
    let correspondenceId = "";
    switch (this.tabParams["CurrentTab"]) {
      case "govCoveringLetter":
        if (
          this.fileDetails["governorsAddressCoveringLetter"] &&
          this.fileDetails["governorsAddressCoveringLetter"][0]
        ) {
          correspondenceId = this.fileDetails[
            "governorsAddressCoveringLetter"
          ][0].correspondenceId;
        }
        break;
      case "letterWithCoveringLetter":
        if (
          this.fileDetails["letterWithCoveringLetter"] &&
          this.fileDetails["letterWithCoveringLetter"][0]
        ) {
          correspondenceId = this.fileDetails["letterWithCoveringLetter"][0]
            .correspondenceId;
        }
        break;
      case "govCorrespondanceLawDept":
        if (
          this.fileDetails["governorsAddressCorrespondanceLawDept"] &&
          this.fileDetails["governorsAddressCorrespondanceLawDept"][0]
        ) {
          correspondenceId = this.fileDetails[
            "governorsAddressCorrespondanceLawDept"
          ][0].correspondenceId;
        }
        break;
      case "letterToGovSec":
        correspondenceId = this.letter.letterToGovSec.correspondenceId;
        break;
      case "lettertoProtem":
        correspondenceId = this.letter.lettertoProtem.correspondenceId;
        break;
      case "letterToGAD":
        correspondenceId = this.letter.letterToGAD.correspondenceId;
        break;
      case "letterToTourism":
        correspondenceId = this.letter.letterToTourism.correspondenceId;
        break;
      case "letterToMembersOnNomination":
        correspondenceId = this.letter.letterToMembersOnNomination
          .correspondenceId;
        break;
      case "letterToHouseKeeping":
        correspondenceId = this.letter.letterToHouseKeeping.correspondenceId;
        break;
      default:
        break;
    }
    if (correspondenceId) {
      this.getCorrespondenceById(correspondenceId);
    }
  }
  getCorrespondenceById(id) {
    if (id) {
      this.common
        .getCorrespondenceById(id, this.currentUser.correspondenceCode.code)
        .subscribe((Res: any) => {
          this.letterContent = Res.data;
        });
    }
  }
  govLOBActivityChange(event) {
    if (event.type === "ADD_SPEAKERNOTE") {
      this.addSpeakerNote(event);
    }
    if (event.type === "SET_TO_LOB") {
      this.setToLOB();
    }
    if (event.type === "SET_TA_TO_LOB") {
      this.setTAToLOB();
    }
  }
  addSpeakerNote(data) {
    let body = {
      governsAddressId:
        this.fileDetails && this.fileDetails.governorsAddress
          ? this.fileDetails.governorsAddress[0].id
          : null,
      motAmendmentDate: data.motAmendmentDate.toISOString().split("T")[0],
      motAmendmentLastDate: data.motAmendmentLastDate
        .toISOString()
        .split("T")[0],
      reportType: "SpeakerNoteGovernorSpeech",
    };
    this.governerAddrss.addSpeakerNote(body).subscribe((Res) => {
      this.notify.success("Success", "Added Speaker Note");
      this.router.navigate(["business-dashboard/tables/list-ga"]);
    });
  }
  setTAToLOB() {
    if (
      this.fileDetails["timeAllocation"] &&
      this.fileDetails["timeAllocation"].length > 0
    ) {
      let ids = this.fileDetails["timeAllocation"].map((value) => value.id);
      this.governerAddrss
        .setTAToLOB({ fileId: this.fileId, masterIds: ids })
        .subscribe((Res) => {
          this.notify.success("Success", "Added To LOB");
          this.router.navigate(["business-dashboard/tables/list-ga"]);
        });
    }
  }
  setToLOB() {
    this.governerAddrss.setSpeakerNoteToLOB(this.fileId).subscribe((Res) => {
      this.notify.success("Success", "Added To LOB");
      this.router.navigate(["business-dashboard/tables/list-ga"]);
    });
  }
  handlePDFUrl() {
    if (this.fileDetails) {
      if (this.fileDetails["procession"] && this.fileDetails["procession"][0]) {
        let processionUrl = this.fileDetails["procession"][0].processionUrl;
        this.fileDetails[
          "procession"
        ][0].processionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          processionUrl
        );
      }
      if (
        this.fileDetails["speakerNote"] &&
        this.fileDetails["speakerNote"][0]
      ) {
        let speakerNote = this.fileDetails["speakerNote"][0];
        this.fileDetails[
          "speakerNote"
        ][0] = this.sanitizer.bypassSecurityTrustResourceUrl(speakerNote);
      }
    }
  }
  reloadFileDetails() {
    if (
      this.subType === "PRO_TEM_SPEAKER" ||
      this.subType === "SPEAKER_ELECTION" ||
      this.subType === "DEPUTY_SPEAKER_ELECTION" ||
      this.subType === "PANEL_OF_CHAIRMAN"
    ) {
      this.getFileByElectionFileId(this.fileId);
    } else if (
      this.subType === "TABLE_RESUME" ||
      this.subType === "TABLE_BULLETIN_ONE"
    ) {
      this.getFileByResumeFileId(this.fileId);
    } else {
      this.getFileByFileId(this.fileId);
    }
  }
  getFamilyLetter() {
    if (
      this.fileDetails["letterToFamily"] &&
      this.fileDetails["letterToFamily"].length > 0
    ) {
      this.fileDetails["letterToFamily"].forEach((element) => {
        if (element.correspondenceId) {
          this.common
            .getCorrespondenceById(
              element.correspondenceId,
              this.currentUser.correspondenceCode.code
            )
            .subscribe((Res: any) => {
              element.letterContent = Res.data;
            });
        }
      });
      console.log(this.fileDetails["letterToFamily"]);
    }
  }
  viewCorrespondence(id) {
    this.router.navigate([
      "business-dashboard/correspondence/correspondence",
      "view",
      id,
    ]);
  }
  getFamilyLetterStatus(familyLetter) {
    const status = familyLetter.map((x) => x.letterStatus);
    if (status.includes("DRAFT")) {
      return "SUBMITTED";
    } else {
      return "APPROVED";
    }
  }

  showM2MPModal() {
    this.m2mPModal = true;
  }

  closeM2MPModal() {
    this.m2mPModal = false;
  }

  cancel() {}

  returnCorrespondenceType() {
    if (
      this.fileDetails.proTemSpeaker &&
      this.fileDetails.proTemSpeaker[0].cabinateNoteStatus === "APPROVED" &&
      !this.letter.letterToGovSec &&
      this.fileDetails.fileResponse.subtype === "PRO_TEM_SPEAKER"
    ) {
      this.letter.business = "ELECTION_PRO_TEM_SPEAKER_GOVERNORS_LETEER";
      this.letter.letterCode = "PTM_LETTER_GOVERNER_SECRETARY";
      this.letter.letterValue = "Letter to Secretary of Governor";
      this.letter.toCode = null;
      this.letter.toDisplayName = null;
      this.letter.toTypable = true;
      this.letter.toEditable = true;
      if (this.fileDetails.proTemSpeaker) {
        this.letter.businessReferId = this.fileDetails.proTemSpeaker[0].id;
      }
      this.letter.businessReferType = "PRO_TEM_SPEAKER";
      this.letter.redirectToModule = "TABLES_PROTEM";
      return " Letter to Secretary of Governor";
    } else if (
      this.fileDetails.ptmGovernorLetters &&
      this.fileDetails.ptmGovernorLetters[0].status === "APPROVED" &&
      !this.letter.lettertoProtem &&
      this.fileDetails.fileResponse.status === "APPROVED" &&
      this.fileDetails.fileResponse.subtype === "PRO_TEM_SPEAKER"
    ) {
      this.letter.business = "ELECTION_PRO_TEM_SPEAKER_INFORM_LETEER";
      this.letter.letterCode = "LETTER_TO_PRO_TEM_SPEAKER";
      this.letter.letterValue = "Letter to Protem Speaker";
      this.letter.toCode = this.fileDetails.proTemSpeaker[0].proTemSpeakerId;
      this.letter.toDisplayName = this.fileDetails.proTemSpeaker[0].proTemSpeakerName;
      this.letter.toTypable = false;
      this.letter.toEditable = false;
      if (this.fileDetails.proTemSpeaker) {
        this.letter.businessReferId = this.fileDetails.proTemSpeaker[0].id;
      }
      this.letter.businessReferType = "PRO_TEM_SPEAKER";
      this.letter.redirectToModule = "TABLES_PROTEM";
      return " Letter to Protem Speaker";
    } else if (
      this.letter.lettertoProtem &&
      (this.fileDetails.fileResponse.status === "APPROVED" ||
        this.userId == this.assignee) &&
      !this.letter.letterToGAD &&
      this.fileDetails.fileResponse.subtype === "PRO_TEM_SPEAKER"
    ) {
      this.letter.business = "ELECTION_PRO_TEM_LETTER_TO_GAD";
      this.letter.letterCode = "PTM_LETTER_GAD";
      this.letter.letterValue = "Letter to GAD";
      this.letter.toCode = "GENERAL_ADMINISTRATION";
      this.letter.toDisplayName = "General Administration";
      this.letter.toTypable = false;
      this.letter.toEditable = false;
      if (this.fileDetails.proTemSpeaker) {
        this.letter.businessReferId = this.fileDetails.proTemSpeaker[0].id;
      }
      this.letter.businessReferType = "PRO_TEM_SPEAKER";
      this.letter.redirectToModule = "TABLES_PROTEM";
      return " Letter to GAD";
    } else if (
      this.letter.letterToGAD &&
      (this.fileDetails.fileResponse.status === "APPROVED" ||
        this.userId == this.assignee) &&
      !this.letter.letterToTourism &&
      this.fileDetails.fileResponse.subtype === "PRO_TEM_SPEAKER"
    ) {
      this.letter.business = "ELECTION_PRO_TEM_LETTER_TO_TOURISM";
      this.letter.letterCode = "PTM_LETTER_TOURISM";
      this.letter.letterValue = "Letter to Tourism";
      this.letter.toCode = "TOURISM";
      this.letter.toDisplayName = "Tourism";
      this.letter.toTypable = false;
      this.letter.toEditable = false;
      if (this.fileDetails.proTemSpeaker) {
        this.letter.businessReferId = this.fileDetails.proTemSpeaker[0].id;
      }
      this.letter.businessReferType = "PRO_TEM_SPEAKER";
      this.letter.redirectToModule = "TABLES_PROTEM";
      return " Letter to Tourism";
    } else if (
      (this.fileDetails.fileResponse.status === "APPROVED" ||
        this.userId == this.assignee) &&
      !this.letter.letterToMembersOnNomination &&
      (this.fileDetails.fileResponse.subtype === "SPEAKER_ELECTION" ||
      this.fileDetails.fileResponse.subtype === 'DEPUTY_SPEAKER_ELECTION') &&
      this.fileDetails.bulletins &&
      (this.fileDetails.bulletins[0].status === "APPROVED" ||
        this.fileDetails.bulletins[0].status === "PUBLISHED")
    ) {
      //  add when subtype issue is resolved
      this.letter.business = "ELECTION_NOMINATION_LETTER_TO_MEMBER";
      this.letter.letterCode = "ELECTION_NOMINATION_LETTER_TO_MEMBER";
      this.letter.letterValue = "Letter for Members On Nomination";
      this.letter.toCode = "MEMBER";
      this.letter.toDisplayName = "All Members";
      this.letter.toTypable = false;
      this.letter.toEditable = false;
      if (this.fileDetails.speakerElections) {
        this.letter.businessReferId = this.fileDetails.speakerElections[0].id;
        this.letter.businessReferType = "SPEAKER_ELECTION";
      } else if (this.fileDetails.deputySpeakerElections) {
        this.letter.businessReferId = this.fileDetails.deputySpeakerElections[0].id;
        this.letter.businessReferType = "DEPUTY_SPEAKER_ELECTION";
      }
      // this.letter.businessReferType = "SPEAKER_ELECTION";
      this.letter.redirectToModule = "TABLES_SPEAKER_ELECTION";
      return " Letter to Members On Nomination";
    } else if (
      this.fileDetails.fileResponse.status === "APPROVED" &&
      this.letter.letterToMembersOnNomination &&
      this.letter.letterToMembersOnNomination.status === "APPROVED" &&
      !this.letter.letterToHouseKeeping &&
      this.fileDetails.fileResponse.subtype === "SPEAKER_ELECTION"
    ) {
      this.letter.business = "ELECTION_LETTER_TO_HOUSE_KEEPING";
      this.letter.letterCode = "ELECTION_LETTER_TO_HOUSE_KEEPING";
      this.letter.letterValue = "Letter to House Keeping";
      this.letter.toCode = "HOUSE_KEEPING_SECTION";
      this.letter.toDisplayName = "House Keeping Section";
      this.letter.toTypable = false;
      this.letter.toEditable = false;
      if (this.fileDetails.speakerElections) {
        this.letter.businessReferId = this.fileDetails.speakerElections[0].id;
      }
      this.letter.businessReferType = "SPEAKER_ELECTION";
      this.letter.redirectToModule = "TABLES_SPEAKER_ELECTION";
      return " Letter to House Keeping";
    } else if (
      ((this.fileDetails.fileResponse.status === "APPROVED" && this.fileDetails.fileResponse.subtype === "DEPUTY_SPEAKER_ELECTION" &&
      this.reportDatas.speakerNoteDeputySpk &&
      this.reportDatas.speakerNoteDeputySpk.status === "APPROVED") || 
      (this.fileDetails.fileResponse.subtype === "SPEAKER_ELECTION" 
      && this.letter.letterToHouseKeeping)) &&
      !this.letter.letterToTourism
    ) {
      this.letter.business = "ELECTION_PRO_TEM_LETTER_TO_TOURISM";
      this.letter.letterCode = "PTM_LETTER_TOURISM";
      this.letter.letterValue = "Letter to Tourism";
      this.letter.toCode = "TOURISM";
      this.letter.toDisplayName = "Tourism";
      this.letter.toTypable = false;
      this.letter.toEditable = false;
      if (this.fileDetails.deputySpeakerElections && this.fileDetails.fileResponse.subtype === "DEPUTY_SPEAKER_ELECTION") {
        this.letter.businessReferId = this.fileDetails.deputySpeakerElections[0].id;
        this.letter.businessReferType = "DEPUTY_SPEAKER_ELECTION";
      } else if (this.fileDetails.fileResponse.subtype === "SPEAKER_ELECTION" && this.fileDetails.speakerElections) {
        this.letter.businessReferId = this.fileDetails.speakerElections[0].id;
        this.letter.businessReferType = "SPEAKER_ELECTION";
      }
      this.letter.redirectToModule = "TABLES_SPEAKER_ELECTION";
      return " Letter to Tourism";
    }
  }

  draftCorrespondence() {
    this.returnCorrespondenceType();
    this.router.navigate(
      ["business-dashboard/correspondence/select-template"],
      {
        state: this.buildCorrespondanceData(),
      }
    );
  }

  buildCorrespondanceData() {
    const body = {
      business: this.letter.business,
      type: "TABLE",
      fileId: this.fileId,
      businessReferId: this.letter.businessReferId,
      businessReferType: this.letter.businessReferType,
      businessReferSubType: this.letter.letterCode,
      businessReferValue: this.letter.letterValue,
      businessReferNumber: null,
      businessReferName: null,
      fileNumber: this.fileDetails.fileResponse.fileNumber,
      departmentId: null,
      masterLetter: null,
      refrenceLetter: null,
      toCode: this.letter.toCode,
      toDisplayName: this.letter.toDisplayName,
      toEditable: this.letter.toEditable,
      redirectToFile: true,
      redirectToModule: this.letter.redirectToModule,
      isResubmit: this.fileDetails.fileResponse.status === 'APPROVED' ? true : false,
      toTypable: this.letter.toTypable,
    };
    return body;
  }

  getLettersInProtem() {
    if (this.fileDetails.letter && this.fileDetails.letter.length > 0) {
      this.letter.letterToGovSec = this.fileDetails.letter.find(
        (l) => l.businessSubType === "PTM_LETTER_GOVERNER_SECRETARY"
      );
      this.letter.lettertoProtem = this.fileDetails.letter.find(
        (l) => l.businessSubType === "LETTER_TO_PRO_TEM_SPEAKER"
      );
      this.letter.letterToGAD = this.fileDetails.letter.find(
        (l) => l.businessSubType === "PTM_LETTER_GAD"
      );
      this.letter.letterToTourism = this.fileDetails.letter.find(
        (l) => l.businessSubType === "PTM_LETTER_TOURISM"
      );
      this.letter.letterToMembersOnNomination = this.fileDetails.letter.find(
        (l) => l.businessSubType === "ELECTION_NOMINATION_LETTER_TO_MEMBER"
      );
      this.letter.letterToHouseKeeping = this.fileDetails.letter.find(
        (l) => l.businessSubType === "ELECTION_LETTER_TO_HOUSE_KEEPING"
      );
    }
  }

  getRbsPermissions() {
    if (this.common.doIHaveAnAccess("ATTACH_PROTEM_LETTER", "CREATE")) {
      this.permissions.attachProtemLetters = true;
    }
  }

  getReports() {
    if (
      this.fileDetails.reportDatas &&
      this.fileDetails.reportDatas.length > 0
    ) {
      this.reportDatas.protemSpeakerReading = this.fileDetails.reportDatas.find(
        (r) => r.reportType === "PRO_TEM_SPEAKER_READING"
      );
      this.reportDatas.secretaryReading = this.fileDetails.reportDatas.find(
        (r) => r.reportType === "SECRETARY_READING"
      );
      this.reportDatas.speakerNoteDeputySpk = this.fileDetails.reportDatas.find(
        (r) => r.reportType === "SPEAKER_NOTE"
      );
    }
  }

  viewFile(fileId, fileType) {
    this.router.navigate([fileType.viewPath, fileId]);
  }

  showAttachModal(typeCode, business) {
    this.docTypeCode = typeCode;
    const body = {
      assemblyId: null,
      sessionId: null,
      sectionId: this.currentUser.correspondenceCode.id,
      status: ["ASSIGNED"],
      assignedTo: this.userId,
      businessTag: business,
      type: typeCode
    };
    this.electionService.getPendingForAttach(body).subscribe((res: any) => {
      this.pendingDocuments = res.filter(
        (d) => d.businessTags.length === 0 && d.typeCode === typeCode
      );
      this.showModal = true;
    });
  }

  attachOfficeSectionDocs() {
    this.electionService
      .createFileAttachment(this.buildReqBody())
      .subscribe((res) => {
        this.notify.success("Success", "Document attached to file succesfully");
        this.getFileByElectionFileId(this.fileId);
        this.cancelModal();
      });
  }

  cancelModal() {
    this.showModal = false;
    this.docSelected = null;
    this.pendingDocuments = null;
    this.docTypeCode = null;
  }

  buildReqBody() {
    if (this.subType === 'SPEAKER_ELECTION' && this.docTypeCode === 'CABINET_NOTE') {
      return {
        attachmentId: this.docSelected,
        attachmentSubType: this.docTypeCode,
        attachmentType: 'OFFICE_SECTION_DOCUMENT',
        businessId: this.fileDetails.speakerElections[0].id,
        fileDto: {
          fileForm: {
            activeSubTypes: ['SPK_ELN_CABINET_NOTE'],
            requestedAdditionalSubtype: ['SPK_ELN_CABINET_NOTE'],
            fileId: this.fileDetails.fileResponse.fileId,
            subtype: 'SPEAKER_ELECTION',
            type: 'TABLE',
            userId: this.userId,
          },
          speakerElectionId: this.fileDetails.speakerElections[0].id,
        },
        subType: 'SPK_ELN_CABINET_NOTE',
        type: 'SPEAKER_ELECTION',
      };
    } else if (this.subType === 'DEPUTY_SPEAKER_ELECTION' && this.docTypeCode === 'SPEAKER_ORDER') {
      return {
        attachmentId: this.docSelected,
        attachmentSubType: this.docTypeCode,
        attachmentType: 'OFFICE_SECTION_DOCUMENT',
        businessId: this.fileDetails.deputySpeakerElections[0].id,
        fileDto: {
          fileForm: {
            activeSubTypes: ['DEPUTY_SPKR_ELN_SPEAKER_ORDER'],
            requestedAdditionalSubtype: ['DEPUTY_SPKR_ELN_SPEAKER_ORDER'],
            fileId: this.fileDetails.fileResponse.fileId,
            subtype: 'DEPUTY_SPEAKER_ELECTION',
            type: 'TABLE',
            userId: this.userId,
          },
          speakerElectionId: this.fileDetails.deputySpeakerElections[0].id,
        },
        subType: 'DEPUTY_SPKR_ELN_SPEAKER_ORDER',
        type: 'DEPUTY_SPEAKER_ELECTION',
      };
    } else if (this.subType === 'PRO_TEM_SPEAKER' && this.docTypeCode === 'CABINET_NOTE') {
      return {
        attachmentId: this.docSelected,
        attachmentSubType: this.docTypeCode,
        attachmentType: 'OFFICE_SECTION_DOCUMENT',
        businessId: this.fileDetails.proTemSpeaker[0].id,
        fileDto: {
          fileForm: {
            activeSubTypes: ['PRO_TEM_SPEAKER_CABINET_NOTE'],
            requestedAdditionalSubtype: ['PRO_TEM_SPEAKER_CABINET_NOTE'],
            fileId: this.fileDetails.fileResponse.fileId,
            subtype: 'PRO_TEM_SPEAKER',
            type: 'TABLE',
            userId: this.userId,
          },
          proTemSpeakerId: this.fileDetails.proTemSpeaker[0].id,
        },
        subType: 'PRO_TEM_SPEAKER_CABINET_NOTE',
        type: 'PRO_TEM_SPEAKER',
      };
    } else {
    if (this.fileDetails.fileResponse.status === "APPROVED") {
      return {
        attachmentId: this.docSelected,
        attachmentSubType:
          this.docTypeCode === "ELECTION_NOTIFICATION"
            ? "ELECTION_NOTIFICATION"
            : "LETTER_FROM_GOVERNOR_OFFICE",
        attachmentType: "OFFICE_SECTION_DOCUMENT",
        businessId: this.fileDetails.proTemSpeaker[0].id,
        fileDto: {
          fileForm: {
            activeSubTypes: [
              this.docTypeCode === "ELECTION_NOTIFICATION"
                ? "PTM_ELECTION_NOTIFICATION"
                : "PTM_LETTER_FROM_GOVERNOR_OFFICE",
            ],
            fileId: this.fileDetails.fileResponse.fileId,
            subtype: "PRO_TEM_SPEAKER",
            type: "TABLE",
            userId: this.userId,
          },
          proTemSpeakerId: this.fileDetails.proTemSpeaker[0].id,
        },
        subType:
          this.docTypeCode === "ELECTION_NOTIFICATION"
            ? "PTM_ELECTION_NOTIFICATION"
            : "PTM_LETTER_FROM_GOVERNOR_OFFICE",
        type: "PRO_TEM_SPEAKER",
      };
    } else if (this.assignee == this.userId) {
      return {
        attachmentId: this.docSelected,
        attachmentSubType:
          this.docTypeCode === "ELECTION_NOTIFICATION"
            ? "ELECTION_NOTIFICATION"
            : "LETTER_FROM_GOVERNOR_OFFICE",
        attachmentType: "OFFICE_SECTION_DOCUMENT",
        businessId: this.fileDetails.proTemSpeaker[0].id,
        fileDto: {
          fileForm: {
            activeSubTypes: [
              this.docTypeCode === "ELECTION_NOTIFICATION"
                ? "PTM_ELECTION_NOTIFICATION"
                : "PTM_LETTER_FROM_GOVERNOR_OFFICE",
            ],
            requestedAdditionalSubtype: [
              this.docTypeCode === "ELECTION_NOTIFICATION"
                ? "PTM_ELECTION_NOTIFICATION"
                : "PTM_LETTER_FROM_GOVERNOR_OFFICE",
            ],
            fileId: this.fileDetails.fileResponse.fileId,
            subtype: "PRO_TEM_SPEAKER",
            type: "TABLE",
            userId: this.userId,
          },
          proTemSpeakerId: this.fileDetails.proTemSpeaker[0].id,
        },
        subType:
          this.docTypeCode === "ELECTION_NOTIFICATION"
            ? "PTM_ELECTION_NOTIFICATION"
            : "PTM_LETTER_FROM_GOVERNOR_OFFICE",
        type: "PRO_TEM_SPEAKER",
      };
    }
   }
  }

  getOsDocuments() {
    if (
      this.fileDetails.proTemSpeaker &&
      this.fileDetails.proTemSpeaker.length > 0
    ) {
      this.osDocuments.cabinateNote = this.fileDetails.proTemSpeaker[0].osDocuments.find(
        (d) => d.typeCode === "CABINET_NOTE"
      );
      this.osDocuments.electionNote = this.fileDetails.proTemSpeaker[0].osDocuments.find(
        (d) => d.typeCode === "ELECTION_NOTIFICATION"
      );
      this.osDocuments.governorOffice = this.fileDetails.proTemSpeaker[0].osDocuments.find(
        (d) => d.typeCode === "LETTER_FROM_GOVERNOR_OFFICE"
      );
    }
  }

  getFileByResumeFileId(fileId) {
    this.setTabfilters();
    this.file
      .getFileByResumeFileId(fileId, this.userId)
      .subscribe((Response) => {
        if (Response) {
          this.showTableContent = this.route.snapshot.params.business;
          this.fileDetails = Response;
          this.responseAvailable = true;

          this.getStatusForBlocks();

          this.notesInfo = this.fileDetails.fileResponse;
          this.subType = this.notesInfo.subtype;
          if (this.notesInfo) {
            this.latestNote = this.notesInfo.notes[
              this.notesInfo.notes.length - 1
            ];
            this.getWorkflowUsers(this.notesInfo);
            this.getAllNotes(this.notesInfo.fileId);
          }
          this.userDetails = this.fileDetails.fileResponse.user;
          this.roleDetails = this.fileDetails.fileResponse.user.roles;
          this.logDetails = this.fileDetails.fileResponse.logs;
          this.getWorkflowStatus();
          this.handlePDFUrl();
          if (this.fileDetails.fileResponse.ratification) {
            if (this.fileDetails.fileResponse.ratification.length !== 0) {
              const temp = this.fileDetails.fileResponse.ratification.filter(
                (x) => x.sectionRole === this.sectionRole
              );
              if (temp.length !== 0) {
                this.ratificationStatus = temp[0].status;
              }
            }
          }
        }
      });
  }

  showBulletinPart1Model() {
    this.bulletinPart1 = true;
  }

  cancelBulletinPart1Model() {
    this.bulletinPart1 = false;
  }

  showResumeModel() {
    this.resume = true;
  }

  cancelResumeModel() {
    this.resume = false;
  }
  editSeatPlan() {
    this.router.navigate([
      "business-dashboard/tables/seat-layout",
      this.fileDetails.allocation[0].id,
    ]);
  }

  addVoteListClass() {
    this.voteListfullScreenMode = !this.voteListfullScreenMode;
  }
  
  formatDate(dateString) {
    if (dateString) {
      const date = new Date(dateString);
      var day = date.getDay();
      const monthML = [
        'ജനുവരി',
      'ഫെബ്രുവരി',
      'മാർച്ച്' ,
      'ഏപ്രിൽ' ,
      'മെയ്' ,
      'ജൂൺ' ,
      'ജൂലൈ' ,
      'ഓഗസ്റ്റ്' ,
      'സെപ്റ്റംബർ' ,
      'ഒക്ടോബർ' ,
      'നവംബർ' ,
      'ഡിസംബർ'];
      var days = ["ഞായർ", "തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"];
      return date.getFullYear() + ' ' + monthML[date.getMonth()] + ' ' + date.getDate() + ', ' + days[day];
    }
  }

  showPrint(htmlContent) {
    this.common.downloadReport(htmlContent).subscribe((res: any) => {
      if (res) {
        const blob = new Blob([res], { type: 'application/pdf' });
        this.printUrl = URL.createObjectURL(blob);
        window.open(this.printUrl, '_blank');
      }
    });
  }

  cancelPrint() {
    this.printVisible = false;
    this.printUrl = null;
  }
}
