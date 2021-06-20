import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { ElectionService } from '../../shared/services/election.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-protem-speaker-view',
  templateUrl: './protem-speaker-view.component.html',
  styleUrls: ['./protem-speaker-view.component.scss']
})
export class ProtemSpeakerViewComponent implements OnInit {
  @Input() protemFileDetails = null;
  @Input() protemFile = null;
  @Output() attachedToProtem = new EventEmitter<any>();
  protemSpeakerId: any = null;
  protemDetails: any = null;
  osDocuments: any = {
    cabinateNote: null,
    electionNote: null,
    governorOffice: null
  };
  showModal = false;
  user: any;
  pendingDocuments: any;
  docSelected: any = null;
  isResubmit = false;
  showFileModal = false;
  showCreateModal = false;
  fileDetails: any = null;
  create= {
   content:'',
  };
  activeSubtype: any = null;
  oathData: any = null;
  modules: any;
  oathEnding = null;
  oathId = null;
  letterToSec = null;
  permission = {
    createOath: false,
    createFile: false,
    attachDocs: false
  };

  constructor(private electionService: ElectionService,
              private router: Router,
              private route: ActivatedRoute,
              @Inject('authService') private AuthService,
              private notification: NzNotificationService,
              private file: FileServiceService,
              public commonService: TablescommonService) {
                this.user = AuthService.getCurrentUser();
                this.commonService.setTablePermissions(this.user.rbsPermissions);
              }

  ngOnInit() {
    this.getRbsPermissionsinList();
    this.setEditorConfig();
    if (this.route.snapshot.params.id) {
      this.protemSpeakerId = this.route.snapshot.params.id;
    }
    if (this.protemFileDetails) {
      this.protemDetails = this.protemFileDetails;
      this.getOsDocuments();
      this.getFileById();
    } else {
      this.getProtemSpeakerById();
    }
  }

  getProtemSpeakerById() {
    this.electionService.getProtemSpeakerById(this.protemSpeakerId).subscribe((res: any) => {
      this.protemDetails = res;
      this.getOsDocuments();
      this.getFileById();
    });
  }

  getOsDocuments() {
    this.osDocuments.cabinateNote = this.protemDetails.osDocuments.find(d => d.typeCode === 'CABINET_NOTE');
    this.osDocuments.electionNote = this.protemDetails.osDocuments.find(d => d.typeCode === 'ELECTION_NOTIFICATION');
    this.osDocuments.governorOffice = this.protemDetails.osDocuments.find(d => d.typeCode === 'LETTER_FROM_GOVERNOR_OFFICE');
  }

  viewDocs(id) {
    this.router.navigate(['business-dashboard/tables/election/view-reg-docs', id]);
  }

  showAttachModal(type) {
    switch (type) {
        case 'ELECTION_NOTIFICATION':
        this.activeSubtype = 'PTM_ELECTION_NOTIFICATION';
        break;
        case 'LETTER_FROM_GOVERNOR_OFFICE':
        this.activeSubtype = 'PTM_LETTER_FROM_GOVERNOR_OFFICE';
        break;
        case 'PRO_TEM_SPEAKER_AUTH':
        this.activeSubtype = 'PRO_TEM_SPEAKER_AUTH';
        break;
        default:
        break;
    }
    if (this.protemDetails.fileId) {
      this.file.getFileByElectionFileId(this.protemDetails.fileId, this.user.userId).subscribe((Response: any) => {
        this.fileDetails = Response;
        if (this.fileDetails.letter) {
          this.letterToSec = this.fileDetails.letter.find(l => l.businessSubType === 'PTM_LETTER_GOVERNER_SECRETARY');
        }
        if (Response.fileResponse.status === 'APPROVED') {
          this.isResubmit = true;
          if (type === 'PRO_TEM_SPEAKER_AUTH') {
            this.attachToFile();
          } else {
            this.getPendingDocs(type);
          }
        } else {
          this.file
          .checkWorkFlowStatus(Response.fileResponse.workflowId)
          .subscribe((Res) => {
              const current = Res[Res.length - 1];
              if (this.user.userId == current.assignee) {
                this.isResubmit = false;
                if (type === 'PRO_TEM_SPEAKER_AUTH') {
                  this.attachToFile();
                } else {
                  this.getPendingDocs(type);
                }
              } else {
                this.notification.warning(
                  'Warning',
                  'File is Under Approval Flow. Cannot Attach Now!'
                );
              }
          });
        }
        });
    } else {
      this.notification.warning(
        'Warning',
        'File Not Created. Cannot Attach Now!'
      );
    }
  }

  getPendingDocs(typeCode) {
      const body = {
        assemblyId: this.osDocuments.cabinateNote.assemblyId,
        sessionId: this.osDocuments.cabinateNote.sessionId,
        sectionId: this.user.correspondenceCode.id,
        status: ['SAVED'],
        assignedTo: this.user.userId
      };
      this.electionService.getPendingDocuments(body).subscribe((res: any) => {
        this.pendingDocuments = res.filter(x => x.typeCode === typeCode);
        this.showModal = true;
      });
  }

  cancelModal() {
    this.pendingDocuments = null;
    this.showModal = false;
  }

  attachProtemSpeaker() {
    const body = {
      fileId: this.protemDetails.fileId,
      fileNumber: this.protemDetails.fileNumber,
      proTemSpeakerName:  this.protemDetails.proTemSpeakerName,
      id: this.protemDetails.id,
      proTemSpeakerId: this.protemDetails.proTemSpeakerId,
      osDocuments: [ { id: this.docSelected, operation: 'UPDATE' } ]
    };
    this.electionService.createProtemSpeaker(body).subscribe((res: any) => {
      this.notification.success(
        'Success',
        'Protem Speaker Updated Successfully!'
      );
      if (!this.protemFileDetails) {
        this.getProtemSpeakerById();
      }
      this.attachToFile();
    });
  }

  attachToFile() {
    if (this.isResubmit) {
      const body = {
        ptmElectionNotificationId: this.docSelected,
        proTemSpeakerAuthId: this.oathId,
        proTemSpeakerId: this.protemDetails.id,
        fileForm: {
          fileId: this.protemDetails.fileId,
          activeSubTypes: [this.activeSubtype],
          type: 'TABLE',
          userId: this.user.userId,
        }
      };
      this.file.resubmitProtemFile(body).subscribe((res: any) => {
        this.notification.success(
          'Success',
          'Document Attached to File Successfully!'
        );
        this.viewFile();
        this.attachedToProtem.emit();
      });
    } else {
      const body = {
        proTemSpeakerId: this.protemDetails.id,
        fileForm: {
          activeSubTypes: this.fileDetails.fileResponse.activeSubTypes,
          fileId: this.protemDetails.fileId,
          userId: this.user.userId,
          requestedAdditionalSubtype: [this.activeSubtype]
        },
      };
      this.file.addSubtypeToProtemFile(body).subscribe((res: any) => {
        this.notification.success(
          'Success',
          'Document Attached to File Successfully!'
        );
        this.viewFile();
        this.attachedToProtem.emit();
      });
    }
  }
  createProtemAuth() {
    if (!this.oathEnding) {
      this.notification.warning(  'Warning',
        'Please Enter Required fields!' );
    } else {
    const body = {
      content:this.oathData,
      fileId: this.protemDetails.fileId,
      fileNumber: this.protemDetails.fileNumber,
      id: null,
      proTemSpeakerId: parseInt(this.protemSpeakerId, 10),
      status: ""
    };
    this.file.createProtemAuth(body).subscribe((res: any)=> {
      this.notification.success(  'Success',
      'ProTem Speaker Auth Created!' );
      this.showCreateModal = false;
      this.oathId = res.id;
      this.showAttachModal('PRO_TEM_SPEAKER_AUTH');
    });
    }
  }

  onBackClick() {
    window.history.back();
  }

  showFilePopup() {
    this.showFileModal = true;
  }

  hideFileModal() {
    this.showFileModal = false;
  }
  showAuthPopup(){
    this.showCreateModal = true;
    this.generateAuth();
  }
  hideAuthPopup() {
    this.showCreateModal = false;
    this.oathEnding = null;
    this.generateAuth();
  }

  viewFile() {
    this.router.navigate(['business-dashboard/tables/file-view', 'pro-tem-speaker', this.protemDetails.fileId]);
  }
  viewAuthList() {
    this.router.navigate(['business-dashboard/tables/election/protem-speaker-auth-list'])
  }

  setEditorConfig() {
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
      ]
    };
  }

  generateAuth() {
    let endingData;
    if (this.oathEnding) {
      endingData = this.oathEnding;
    } else {
      endingData = '......';
    }
    this.oathData = '<h4 class="ql-indent-2">സത്യപ്രതിജ്ഞ&nbsp;</h4><p class="ql-indent-2"><br></p><p>' +
    this.protemDetails.proTemSpeakerName +
    '&nbsp; ആയ ഞാൻ, | നിയമസഭയിലെ ഒരംഗമായി തെരഞ്ഞെടുക്കപ്പെട്ടിരിക്കുന്നതിനാൽ | നിയമം വഴി സ്ഥാപിതമായ | ഭാരതത്തിന്റെ ഭരണഘടനയോട് | ഞാൻ നിർവ്യാജമായ വിശ്വസ്തതയും കൂറും പുലർത്തുമെന്നും | ഞാൻ ഭാരത്തിന്റെ പരമാധികാരവും | അഖണ്ഡതയും നിലനിർത്തുമെന്നും | ഞാൻ ഏറ്റെടുക്കുവാൻ പോകുന്ന കർത്തവ്യം | ഞാൻ വിശ്വസ്തതയോടുകൂടി നിർവ്വഹിക്കുമെന്നും |&nbsp;' + endingData + '&nbsp;ചെയ്യുന്നു.</p>'
  }

  getFileById() {
    this.file.getFileByElectionFileId(this.protemDetails.fileId, this.user.userId).subscribe((Response: any) => {
      if (Response.letter) {
        this.letterToSec = Response.letter.find(l => l.businessSubType === 'PTM_LETTER_GOVERNER_SECRETARY');
      }
    });
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('CREATE_PROTEM_OATH', 'CREATE')) {
      this.permission.createOath = true;
    }
    if (this.commonService.doIHaveAnAccess('FILE', 'CREATE')) {
      this.permission.createFile = true;
    }
    if (this.commonService.doIHaveAnAccess('ATTACH_PROTEM_LETTER', 'CREATE')) {
      this.permission.attachDocs = true;
    }
  }

}
