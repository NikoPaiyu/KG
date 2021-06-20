import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ElectionService } from '../../shared/services/election.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-protem-speaker-auth-list',
  templateUrl: './protem-speaker-auth-list.component.html',
  styleUrls: ['./protem-speaker-auth-list.component.css']
})
export class ProtemSpeakerAuthListComponent implements OnInit {
  search = null;
  proTemSpeakerauthList: any =[];
  tempProTemSpeakerauthList: any =[];
  colCheckboxes = [
    { id: 0, label: 'slno', check: true, disable: false },
    { id: 1, label: 'fileId', check: true, disable: false },
    { id: 2, label: 'filenumber', check: true, disable: false },
    { id: 3, label: 'content', check: true, disable: false },
    { id: 4, label: 'proTemSpeakerId', check: true, disable: false },
    { id: 5, label: 'status', check: true, disable: false }

  ];
  bulletinData: any = null;
  showBulletinPart2Popup = false;
  resubmitfileId: any = null;
  user: any = null;
  showContentPopup = false;
  oathContent = null;
  permission = {
    createBulletin: false
  }

  constructor(private electionService: ElectionService,
              private notification: NzNotificationService,
              private router: Router,
              private fileService: FileServiceService,
              @Inject('authService') private AuthService,
              private modalService: NzModalService,
              public commonService: TablescommonService) {
                this.user = this.AuthService.getCurrentUser();
                this.commonService.setTablePermissions(this.user.rbsPermissions);
               }
 
  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 6) {
      for (const box of this.colCheckboxes) {
        if (!box.check) {
          box.disable = true;
        }
      }
    } else {
      for (const box of this.colCheckboxes) {
        box.disable = false;
      }
    }
  }
  searchProtemList() {
    if (this.search) {
      this.proTemSpeakerauthList = this.tempProTemSpeakerauthList.filter(
        (element) =>
          // (element.fileId &&
          //   element.fileId
          //     .toLowerCase()
          //     .includes(this.search.toLowerCase())) ||
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.content &&
            element.content
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
              // (element.proTemSpeakerId &&
              //   element.proTemSpeakerId
              //     .toLowerCase()
              //     .includes(this.search.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.proTemSpeakerauthList = this.tempProTemSpeakerauthList;
    }
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempProTemSpeakerauthList.filter((item) => item);
    if (sort.key && sort.value) {
      this.proTemSpeakerauthList = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.proTemSpeakerauthList = data;
    }
  }
  getProtemSpeakerAuthList() {
    this.electionService.getProtemSpeakerAuthList().subscribe((res :any) => {
       this.proTemSpeakerauthList = this.tempProTemSpeakerauthList = res;
    })
  }
  ngOnInit() {
    this.getRbsPermissionsinList();
    this.getProtemSpeakerAuthList();
  }

  afterCreateBulletin(event) {
    if (event) {
      this.notification.success('Success', 'Bulletin Created.');
      this.resubmitFile();
    }
    this.cancelBulletin();
  }

  cancelBulletin() {
    this.showBulletinPart2Popup = false;
    this.bulletinData = {};
    this.showContentPopup = false;
    this.oathContent = null;
  }

  resubmitFile() {
    const body = {
      fileForm: {
        fileId: this.resubmitfileId,
        activeSubTypes: ['BULLETIN'],
        type: 'BULLETIN',
        userId: this.user.userId,
      }
    };
    this.fileService.resubmitProtemFile(body).subscribe((Res: any) => {
     this.viewFile(this.resubmitfileId);
    });
  }

  showLinks(id) {
    this.proTemSpeakerauthList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.proTemSpeakerauthList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  createBulletinPart2(data) {
    this.bulletinData = {
      businessId: data.proTemSpeakerId,
      businessType: 'PRO_TEM_SPEAKER',
      description: '',
      fileId: data.fileId,
      part: '2',
      title: '',
      type: 'ELECTION',
      userId: this.user.userId,
      assemblyId: null,
      sessionId: null
    };
    this.resubmitfileId = data.fileId;
    this.fileService.getFileByElectionFileId(data.fileId, this.user.userId).subscribe((res: any) => {
      if (res.fileResponse.status === 'APPROVED') {
        this.showBulletinPart2Popup = true;
      } else {
        this.modalService.create({
          nzTitle: 'Create Bulletin Part 2',
          nzWidth : '500',
          nzContent: '&nbsp;&nbsp;<b>Currently file is under approval flow..Cannot create bulletin now... </b>',
          nzOkText: 'OK',
          nzOnOk: () => {},
        });
      }
    });
  }

  showContent(content) {
    this.showContentPopup = true;
    this.oathContent = content;
  }

  viewProtemSpeaker(id) {
    this.router.navigate(['business-dashboard/tables/election/protem-speaker', id]);
  }

  viewFile(fileId) {
    this.router.navigate(['business-dashboard/tables/file-view', 'pro-tem-speaker', fileId]);
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('CREATE_BULLETIN', 'CREATE')) {
      this.permission.createBulletin = true;
    }
  }
}
