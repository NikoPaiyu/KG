import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { FileServiceService } from '../../shared/services/file-service.service';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { BillAmendmentsService } from '../shared/services/bill-amendments.service';
import { PmbrResolutionService } from '../shared/services/pmbr-resolution.service';

@Component({
  selector: "pmbr-amendments-list-view",
  templateUrl: "./amendments-list-view.component.html",
  styleUrls: ["./amendments-list-view.component.css"],
})
export class AmendmentsListViewComponent implements OnInit {
  listId;
  listOfData;
  speakerNote;
  memberReading;
  readingPreview: boolean;
  permission = {
    createFile: false,
  };
  user;
  attachtofileButton: boolean;
  memberReadingPreview: boolean;
  lobDate;
  dateFormat = "dd-MM-yyyy";
  presentationAllowedDates: any = [];
  presentationDates;
  resolution: any;
  fileResponse: any;
  toCodes: any;

  constructor(
    private route: ActivatedRoute,
    private service: BillAmendmentsService,
    private pmbrCommonService: PmbrCommonService,
    @Inject("authService") private AuthService,
    private router: Router,
    private notification: NzNotificationService,
    private fileService: FileServiceService,
    private resolutionService: PmbrResolutionService,
    public datepipe: DatePipe
  ) {
    this.user = AuthService.getCurrentUser();
    this.pmbrCommonService.setPermissions(this.user.rbsPermissions);
    if (this.user.authorities[0] === "assistant") {
      this.attachtofileButton = true;
    }
  }

  ngOnInit() {
    this.getPermissions();
    this.getPresentationDates();
    this.route.params.subscribe((params) => {
      this.listId = params.id;
      this.getAmendmentsList(this.listId);
    });
  }
  getPermissions() {
    if (this.pmbrCommonService.doIHaveAnAccess("FILE", "CREATE")) {
      this.permission.createFile = true;
    }
  }
  getAmendmentsList(listId) {
    this.service.getClauseList(listId).subscribe((res) => {
      if (res) {
        this.listOfData = res;
      }
    });
  }
  generateSpeakerNote() {
    const body ={
      ballotResultId: this.listOfData.billId,
      flow:'FINAL',
    }
      this.pmbrCommonService
        .generateSpeakerNote(body)
        .subscribe((Res: any) => {
          this.speakerNote = Res;
          this.readingPreview = true;
          this.getAmendmentsList(this.listId);
        });
  }
  viewSpeakerNote(speakerNoteId){
    if (speakerNoteId) {
      this.pmbrCommonService
        .getPmbrSpeakerNote(this.listOfData.speakerNoteId)
        .subscribe((Res: any) => {
          this.speakerNote = Res;
          this.readingPreview = true;
        });
    }
  }
  // generateMemberReading() {
  //   const flow = "FINAL";
  //   this.pmbrCommonService
  //     .generateMemberReading(this.listOfData.billId, flow)
  //     .subscribe((Res: any) => {
  //       this.memberReading = Res;
  //       this.getAmendmentsList(this.listId);
  //     });
  // }
  // viewMemberReading(id) {
  //   this.pmbrCommonService.viewMemberReading(id).subscribe((Res: any) => {
  //     this.memberReading = Res;
  //   });
  // }

  hidePreview() {
    this.speakerNote = null;
    this.readingPreview = false;
    this.memberReading = null;
    this.memberReadingPreview = false;
  }

  attachSpeakerNoteToFile() {
    this.fileService
      .getFileById(this.listOfData.billFileId, this.user.userId)
      .subscribe((res: any) => {
        if (res) {
          if (res.fileResponse.status === "APPROVED") {
            const body = {
              pmbrSpeakerNoteId: this.speakerNote.id,
              fileForm: {
                fileId: this.listOfData.billFileId,
                activeSubTypes: ["PMBR_SPEAKER_NOTE"],
                type: "PM_RESOLUTION",
                userId: this.user.userId,
              },
            };
            this.fileService.attachToFile(body).subscribe((Res: any) => {
              this.router.navigate([
                "business-dashboard/pmbr/file-view/",
                this.listOfData.billFileId,
              ]);
            });
          } else {
            this.notification.warning(
              "Warning",
              "File is under approval flow. Cannot attach now!"
            );
          }
        }
      });
  }
  attachMemberReadingToFile() {
    this.fileService
      .getFileById(this.listOfData.billFileId, this.user.userId)
      .subscribe((res: any) => {
        if (res) {
          if (res.fileResponse.status === "APPROVED") {
            const body = {
              pmbrMemberReadingId: this.memberReading.id,
              fileForm: {
                fileId: this.listOfData.billFileId,
                activeSubTypes: ["PMBR_MEMBER_READING"],
                type: "PM_RESOLUTION",
                userId: this.user.userId,
              },
            };
            this.fileService.attachToFile(body).subscribe((Res: any) => {
              this.router.navigate([
                "business-dashboard/pmbr/file-view/",
                this.listOfData.billFileId,
              ]);
            });
          } else {
            this.notification.warning(
              "Warning",
              "File is under approval flow. Cannot attach now!"
            );
          }
        }
      });
  }
  attachToFile() {
    this.fileService
      .getFileById(this.listOfData.billFileId, this.user.userId)
      .subscribe((res: any) => {
        if (res) {
          const body = {
            pmBillId: this.listOfData.billId,
            billId: this.listOfData.billId,
            // pmbrMemberReadingId: this.listOfData?.memberReadingId,
            fileForm: {
              assemblyId: res.fileResponse.assemblyId,
              sessionId: res.fileResponse.sessionId,
              fileId: this.listOfData.listFileId,
              currentNumber: null,
              description: res.fileResponse.description,
              status: "SAVED",
              subject: res.fileResponse.subject,
              activeSubTypes: ["PM_RESOLUTION", "PMBR_MEMBER_READING"],
              requestedAdditionalSubtype: ["PM_RESOLUTION", "PMBR_MEMBER_READING"],
              type: "PM_RESOLUTION",
              userId: this.user.userId,
              subtype: "PM_RESOLUTION",
              priority: res.fileResponse.priority,
            },
          };
          this.pmbrCommonService.resubmitOrAttachFile(body).subscribe((Res: any) => {
            this.notification.success("Success", "File Attached Successfully");
            this.router.navigate(["business-dashboard/pmbr/file-view/",Res.fileResponse.fileId,]);
          });
        }
      });
  }
  addToLob() {
    const date = this.datepipe.transform(this.lobDate, "yyyy-MM-dd")
    // if (this.listOfData.memberReadingId) {
      if (this.listOfData.speakerNoteId) {
          this.pmbrCommonService
          .addResolutionToLobFinal(this.listOfData.speakerNoteId, this.listOfData.billId, date)
          .subscribe((res) => {
            if (res) {
              this.getAmendmentsList(this.listId);
              this.notification.success('Success', 'Resolution added to Lob!');
          }
          });
      } else {
        this.notification.warning("Warning", "Add speaker note!");
      }
    // } else {
    //   this.notification.warning("Warning", "Create Member reading!");
    // }
  }
  backToList() {
    // this.router.navigate(["business-dashboard/pmbr/lists"]);
    window.history.back();
  }
  getPresentationDates() {
    this.resolutionService.getActivePresentationDates().subscribe(res => {
      this.presentationDates = res;
      this.presentationAllowedDates = (current: Date): boolean => {
        const todayDate = current.getFullYear() + '-' + ('0' + (current.getMonth() + 1)).slice(-2) + '-' + ('0' + current.getDate()).slice(-2);
        return !this.presentationDates.find(item => item === todayDate);
      };
    });
  }
  //to get department codes
  getDepartmentCode(resolutionId) {
    this.pmbrCommonService.getResolutionDepartmentCode(resolutionId).subscribe((res: any) => {
      if (res) {
        this.toCodes = res;
        this.draftCorrespondance();
      } else {
        this.notification.success(
          'Warning',
          'Department Not Found'
        );
      }
    });
  }
  // create letter to send list to stakeholders
  draftCorrespondance() {
    this.router.navigate(
      ['business-dashboard/correspondence/select-template'],
      {
        state: {
          business: 'PM_RESOLUTION_LETTER_TO_STAKE_HOLDER',
          type: 'PMBR_SECTION',
          fileId: this.listOfData.billFileId,
          businessReferId: this.listId,
          businessReferType: 'PM_RESOLUTION_LETTER_TO_STAKE_HOLDER',
          businessReferSubType: 'PMBR',
          businessReferValue : 'Letter to Departent',
          businessReferNumber: null,
          businessReferName: null,
          fileNumber:  this.listOfData.billFileNumber,
          departmentId: null,
          masterLetter: null,
          refrenceLetter: null,
          toCode:  this.toCodes[0].code,
          toDisplayName: this.toCodes[0].stakeHolder,
          toEditable: false,
          redirectToModule: 'PMBR',
          redirectToFile: true
        },
      }
    );
  }
  // view letter
  viewCorrespondence(corresId) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',corresId,
    ]);
  }
}
