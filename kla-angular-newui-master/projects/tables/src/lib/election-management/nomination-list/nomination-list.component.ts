import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays } from 'date-fns';
import { NzModalService, NzNotificationService, UploadChangeParam, UploadFile } from 'ng-zorro-antd';
import { ElectionService } from '../../shared/services/election.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-nomination-list',
  templateUrl: './nomination-list.component.html',
  styleUrls: ['./nomination-list.component.scss']
})
export class NominationListComponent implements OnInit {
  @Input() fileElectionId;
  electionId: any = null;
  electionDetails: any = null;
  tempNominations: any = null;
  search: any = null;
  colCheckboxes = [
    {id: 0, label: 'slNo', check: true, disable: false},
    {id: 1, label: 'Nominee Name', check: true, disable: false},
    {id: 2, label: 'Nominated By', check: true, disable: false},
    {id: 3, label: 'Supported By', check: true, disable: false},
    {id: 4, label: 'Status', check: true, disable: false},
    {id: 5, label: 'Signed Form', check: true, disable: false}
  ];
  permission = {
    acceptReject: false,
    createFile: false,
    createNomination: false,
    viewVoteList: false,
    addToLOB: false
  };
  user: any = null;
  nominationList: any = [];
  tempNominationList: any = [];
  fileDetails: any = null;
  voteList: any = null;
  voteListPreview = false;
  speakerNomination = {
    showPopup: false,
    nominationDetails: null
  };
  createdNomination = false;
  bulletinData: any = null;
  readingPreview = false;
  reading: any = null;
  speakerNoteView = false;
  speakerNote: any = null;
  reportDatas = {
    protemSpeakerReading: null,
    secretaryReading: null,
    speakerNoteDeputySpk: null
  };
  submitVisible = false;
  submitNominationId: any = null;
  uploadedAttachmentUrl: any = null;
  pdfData: any = null;
  uploadURL = this.commonService.uploadUrl();
  fileList = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true,
  };
  previewPurpose: any = null;
  consentList: any = [];
  tempConsentList: any = [];
  printUrl: any = null;
  reports = {
    protemSpeakerReading: null,
    secretaryReading: null,
    speakerNoteDeputySpk: null
  };

  constructor(private route: ActivatedRoute,
              private electionService: ElectionService,
              private commonService: TablescommonService,
              @Inject('authService') private AuthService,
              private notification: NzNotificationService,
              private fileService: FileServiceService,
              private modalService: NzModalService,
              private router: Router) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setTablePermissions(this.user.rbsPermissions);
   }

  ngOnInit() {
    if (this.fileElectionId) {
      this.electionId = this.fileElectionId;
    } else {
      this.electionId = this.route.snapshot.params.id;
    }
    this.getRbsPermissionsinList();
    if (this.permission.acceptReject) {
        this.getCreatedNominationList();
        this.getPendingForConsent();
        this.getSpeakerElectionById();
    } else {
      this.getSpeakerElectionById();
    }
  }

  getSpeakerElectionById() {
    this.electionService.getSpeakerElectionById(this.electionId).subscribe((res: any) => {
      this.electionDetails = res;
      this.tempNominations = this.electionDetails.nominations;
      this.returnReportsGenerated();
      this.getFileById();
    });
  }

  returnReportsGenerated() {
    if (this.electionDetails.readings && this.electionDetails.readings.length > 0) {
      this.reports.protemSpeakerReading = this.electionDetails.readings.find(r => r.reportType === 'PRO_TEM_SPEAKER_READING');
      this.reports.secretaryReading = this.electionDetails.readings.find(r => r.reportType === 'SECRETARY_READING');
      this.reports.speakerNoteDeputySpk = this.electionDetails.readings.find(r => r.reportType === 'SPEAKER_NOTE');
    }
  }

  searchList() {
    if (this.search) {
      this.electionDetails.nominations = this.tempNominations.filter(n =>
        n.nomineeName && n.nomineeName.toLowerCase().includes(this.search.toLowerCase()));
    } else {
      this.electionDetails.nominations = this.tempNominations;
    }
  }

  searchConsentList() {
    if (this.search) {
      this.consentList.nominations = this.tempConsentList.filter(n =>
        n.nomineeName && n.nomineeName.toLowerCase().includes(this.search.toLowerCase()));
    } else {
      this.consentList.nominations = this.tempConsentList;
    }
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('ACCEPT_REJECT_NOMINATION', 'READ')) {
      this.permission.acceptReject = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE', 'CREATE')) {
      this.permission.createFile = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_ELECTION_NOMINATION', 'CREATE')) {
      this.permission.createNomination = true;
    }
    if (this.commonService.doIHaveAnAccess('BALLLOT_PAPER', 'READ')) {
      this.permission.viewVoteList = true;
    }
    if (this.commonService.doIHaveAnAccess("ADD_TO_LOB", "READ")) {
      this.permission.addToLOB = true;
    }
  }

  getCreatedNominationList() {
    this.nominationList = null;
    this.tempNominationList = null;
    this.electionService.getCreatedNominationListForMembers(this.electionId).subscribe((res: any) => {
      this.nominationList = res;
      this.tempNominationList = res;
      if (this.nominationList.length > 0) {
        this.createdNomination = true;
      }
    });
  }

  getPendingForConsent() {
    this.consentList = null;
    this.tempConsentList = null;
    this.electionService.getPendingForConsentNomination(this.electionId).subscribe((res: any) => {
      this.consentList = res;
      this.tempConsentList = res;
    });
  }

  updateStatus(nomination, consentStatus) {
    if (consentStatus === 'ACCEPT' && this.nominationList.find(x => x.status !== 'SAVED')) {
      this.notification.warning(
        'Warning',
        'You Cannot Accept Consent As You Have Already Created A Nomination!'
        );
    } else  if (consentStatus === 'ACCEPT' && this.consentList.find(x => x.consentStatus === 'ACCEPT') &&
    (this.consentList.find(x => x.consentStatus === 'ACCEPT').nomineeId  !==  this.user.userId ||
    (this.consentList.find(x => x.consentStatus === 'ACCEPT').nomineeId  ===  this.user.userId &&
    nomination.nomineeId !== this.user.userId))) {
      this.notification.warning(
        'Warning',
        'You Cannot Accept This Consent As You Have Already Accepted Another Consent!'
        );
    } else {
      const body = {
        id: nomination.consent.find(c => c.userId ===  this.user.userId).id,
        status: consentStatus
      };
      this.electionService.updateNominationStatus(body).subscribe((res: any) => {
       this.getPendingForConsent();
       this.notification.success(
        'Success',
        'Status updated succesfully!'
        );
      });
    }
  }

  searchNominationList() {
    if (this.search) {
      this.nominationList = this.tempNominationList.filter(n =>
        n.nomineeName && n.nomineeName.toLowerCase().includes(this.search.toLowerCase()));
    } else {
      this.nominationList = this.tempNominationList;
    }
  }

  returnName(nomination, type) {
    return nomination.consent.find(c => c.type === type).user.details.fullName;
  }

  updateNominationStatus(nomination, nominationStatus) {
    const body = {
      id: nomination.id,
      status: nominationStatus
    };
    this.electionService.updateNominationStatusAssistant(body).subscribe((res: any) => {
     this.getSpeakerElectionById();
     this.notification.success(
      'Success',
      'Status updated succesfully!'
      );
    });
  }

  attachToFile(attachType) {
    this.fileService.getFileByElectionFileId(this.electionDetails.fileId, this.user.userId).subscribe((res: any) => {
      if (res.fileResponse.status === 'APPROVED') {
        let fileType = null;
        if (this.electionDetails.electionType === 'SPEAKER') {
          if (attachType === 'VOTELIST') {
            fileType = 'VOTE_LIST';
          } else {
            fileType = 'SPEAKER_ELECTION_NOMINATION';
          }
        } else {
          if (attachType === 'VOTELIST') {
            fileType = 'VOTE_LIST';
          } else {
          fileType = 'DEPUTY_SPEAKER_ELECTION_NOMINATION';
          }
        }
        let body;
        if (attachType === 'VOTELIST') {
          body = {
            voteListId: this.voteList.id,
            fileForm: {
              fileId: this.electionDetails.fileId,
              activeSubTypes: [fileType],
              type: 'TABLE',
              userId: this.user.userId,
            }
          };
          this.resubmitFile(body);
        } else if (attachType === 'READING') {
          if (this.reading.reportType === 'SPEAKER_NOTE') {
            body = {
              reportId: this.reading.id,
              fileForm: {
                fileId: this.electionDetails.fileId,
                activeSubTypes: ['DEPUTY_SPEAKER_NOTE'],
                type: 'TABLE',
                userId: this.user.userId,
              }
            };
          } else {
            body = {
              reportId: this.reading.id,
              fileForm: {
                fileId: this.electionDetails.fileId,
                activeSubTypes: [this.reading.reportType],
                type: 'TABLE',
                userId: this.user.userId,
              }
            };
          }
          this.resubmitFile(body);
        } else {
          body = {
            nominationIds: this.electionDetails.nominations.filter(n => n.status === 'VALID').map(x => x.id),
            fileForm: {
              fileId: this.electionDetails.fileId,
              activeSubTypes: [fileType],
              type: 'TABLE',
              userId: this.user.userId,
            }
          };
          if (body.nominationIds.length > 0) {
           this.resubmitFile(body);
          } else {
            this.notification.warning(
              'Warning',
              'No valid nominations available!'
              );
          }
        }
      } else {
        this.modalService.create({
          nzTitle: 'Create Bulletin Part 2',
          nzWidth : '500',
          nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot attach now... </b>',
          nzOkText: 'OK',
          nzOnOk: () => {},
        });
      }
    });
  }

  resubmitFile(body) {
    this.fileService.resubmitProtemFile(body).subscribe((Res: any) => {
      this.router.navigate(['business-dashboard/tables/file-view', 'election',  this.electionDetails.fileId]);
    });
  }

  getFileById() {
    this.fileService.getFileByElectionFileId(this.electionDetails.fileId, this.user.userId).subscribe((res: any) => {
      this.fileDetails = res;
      if (this.fileDetails.reportDatas) {
        this.getReports();
      }
    });
  }

  generateVoteList() {
    this.electionService.generateVoteList(this.electionDetails.id).subscribe((res: any) => {
      this.voteListPreview = true;
      this.voteList = res;
      this.getSpeakerElectionById();
    });
  }

  getVoteListPreview() {
    if (this.electionDetails.voteList && this.electionDetails.voteList.length > 0) {
      this.voteListPreview = true;
      this.voteList = this.electionDetails.voteList[0];
    }
  }

  hidePreview() {
    this.voteListPreview = false;
    this.readingPreview = false;
    this.reading = null;
    this.speakerNoteView = false;
    this.speakerNote = null;
  }

  createNominationPopup() {
    if (this.consentList.find(x => x.consentStatus === 'ACCEPT')) {
      this.notification.warning(
        'Warning',
        'You already accepted a consent. So You Cannot Create Nomination!'
      );
    } else {
      this.speakerNomination.showPopup = true;
    }
  }

  cancelNomination() {
    this.speakerNomination.showPopup = false;
    this.getCreatedNominationList();
  }

  generateReading(type) {
    this.electionService.generateReading(this.electionDetails.id, type).subscribe((res: any) => {
      this.readingPreview = true;
      this.reading = res;
      this.getSpeakerElectionById();
    });
  }

  getReading(reading) {
    if (reading) {
      this.readingPreview = true;
      this.reading = reading;
    }
  }

  getReports() {
    if (this.fileDetails.reportDatas && this.fileDetails.reportDatas.length > 0) {
      this.reportDatas.protemSpeakerReading = this.fileDetails.reportDatas.find(r => r.reportType === 'PRO_TEM_SPEAKER_READING');
      this.reportDatas.secretaryReading = this.fileDetails.reportDatas.find(r => r.reportType === 'SECRETARY_READING');
      this.reportDatas.speakerNoteDeputySpk = this.fileDetails.reportDatas.find(r => r.reportType === 'SPEAKER_NOTE');
    }
  }

  showAttachReport() {
    if (this.reading && this.reading.reportType === 'PRO_TEM_SPEAKER_READING'
    && !this.reportDatas.protemSpeakerReading) {
      return true;
    } else if (this.reading && this.reading.reportType === 'SECRETARY_READING'
    && this.reportDatas.protemSpeakerReading && this.reportDatas.protemSpeakerReading.status === 'APPROVED'
    && !this.reportDatas.secretaryReading) {
      return true;
    } else if (this.reading && this.reading.reportType === 'SPEAKER_NOTE' && !this.reportDatas.speakerNoteDeputySpk) {
      return true;
    }
  }

  isNominationTimeEnded() {
    let ended = false;
    const today = new Date();
    const curtime = this.addZero(today.getHours()) + ':' + this.addZero(today.getMinutes()) + ':' +  this.addZero(today.getSeconds());
    if ((differenceInCalendarDays(new Date(this.electionDetails.nominationEndDate), new Date()) < 0)) {
      ended = true;
    } else if ((differenceInCalendarDays(new Date(this.electionDetails.nominationEndDate), new Date()) == 0)) {
      if (curtime >= this.electionDetails.nominationEndTime) {
        ended = true;
      }
    }
    return ended;
  }

  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  showVoteList() {
    if ((this.permission.createNomination &&
      this.fileDetails && this.fileDetails.voteList
      && this.fileDetails.voteList.status === 'APPROVED') || !this.permission.createNomination) {
      return true;
    } else {
      return false;
    }
  }

  showProtemSpeakerReading() {
    if ((this.permission.createNomination &&
      this.fileDetails && this.reportDatas.protemSpeakerReading
      && this.reportDatas.protemSpeakerReading.status === 'APPROVED') || !this.permission.createNomination) {
      return true;
    } else {
      return false;
    }
  }

  showSecretaryReading() {
    if ((this.permission.createNomination &&
      this.fileDetails && this.reportDatas.secretaryReading
      && this.reportDatas.secretaryReading.status === 'APPROVED') || !this.permission.createNomination) {
      return true;
    } else {
      return false;
    }
  }

  showSpkNote() {
    if ((this.permission.createNomination &&
      this.fileDetails && this.reportDatas.speakerNoteDeputySpk
      && this.reportDatas.speakerNoteDeputySpk.status === 'APPROVED') || !this.permission.createNomination) {
      return true;
    } else {
      return false;
    }
  }


  requestForConsent(id) {
    if (this.consentList.find(x => x.consentStatus === 'ACCEPT')) {
      this.notification.warning(
        'Warning',
        'You already accepted a consent. So You Cannot Request for Consent!'
        );
    } else {
      this.electionService.requestConsent(id).subscribe((res: any) => {
        this.getCreatedNominationList();
        this.notification.success(
          'Success',
          'Consent Requested Successfully!'
          );
      });
    }
  }

  submitNomination() {
    const body = {
      id: this.submitNominationId,
      signedForm: this.uploadedAttachmentUrl
    };
    this.electionService.submitNomination(body).subscribe((res: any) => {
      this.getCreatedNominationList();
      this.notification.success(
        'Success',
        'Nomination Submitted Successfully!'
        );
      this.cancelSubmitModal();
      this.getCreatedNominationList();
    });
  }

  showSubmitModal(id, purpose) {
    this.previewPurpose = purpose;
    if (purpose === 'view') {
      this.submitVisible = true;
      this.pdfData = id;
    } else {
      this.submitNominationId = id;
      this.electionService.getNominationForm(id).subscribe((res: any) => {
      this.submitVisible = true;
      var mediaType = "application/pdf"
      var blob = new Blob([res], { type: mediaType });
      this.pdfData = URL.createObjectURL(blob);
      });
    }
  }

  cancelSubmitModal() {
    this.submitVisible = false;
    this.uploadedAttachmentUrl = null;
  }

  handleChange(info: UploadChangeParam): void {
    const fileList = info.fileList;
    if (info.file.response) {
      for (const file of fileList) {
        file.url = file.response.body;
        this.uploadedAttachmentUrl = info.file.response.body;
      }
    }
    this.fileList = fileList.filter((item: any) => {
      if (item.response) {
        return item.response.status !== 'success';
      }
      return true;
    });
  }

  handlePreview = async (file: UploadFile) => {
    window.open(file.url, '_blank');
  }

  addToLOB() {
    this.electionService.addToLOB(this.electionId).subscribe((res: any) => {
      this.notification.success('Success', 'Added to LOB Successfully!');
      this.getSpeakerElectionById();
    });
  }

  showPrint(htmlContent) {
    this.commonService.downloadReport(htmlContent).subscribe((res: any) => {
      if (res) {
        const blob = new Blob([res], { type: 'application/pdf' });
        this.printUrl = URL.createObjectURL(blob);
        window.open(this.printUrl, '_blank');
      }
    });
  }

}
