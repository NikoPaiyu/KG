import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { ElectionService } from '../../shared/services/election.service';
import { TablescommonService } from '../../shared/services/tablescommon.service';

@Component({
  selector: 'tables-protem-speaker-list',
  templateUrl: './protem-speaker-list.component.html',
  styleUrls: ['./protem-speaker-list.component.scss']
})
export class ProtemSpeakerListComponent implements OnInit {
  searchList: any;
  listOfDocs: any;
  tempListOfDocs: any;
  search = null;
  protemStatus: any = 'SAVED';
  protemStatusList: any = ['SAVED', 'SUBMITTED', 'APPROVED'];
  showFileModal = false;
  protemDetails: any = null;
  colCheckboxes = [
    { id: 0, label: 'slno', check: true, disable: false },
    { id: 1, label: 'protemspeakername', check: true, disable: false },
    { id: 2, label: 'filenumber', check: true, disable: false },
    { id: 3, label: 'status', check: true, disable: false }

  ];
  permission = {
    createFile: false,
    createProtemSpeaker: false
  };
  isProtemVisible = false;
  protemSpeaker: any = null;
  memberList: any = null;

  constructor(private electionService: ElectionService,
              private router: Router,
              @Inject('authService') private AuthService,
              public commonService: TablescommonService,
              private notification: NzNotificationService
              ) {
    this.commonService.setTablePermissions(AuthService.getCurrentUser().rbsPermissions);
    this.getProtemList();
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

  ngOnInit() {
    this.getRbsPermissionsinList();
  }

  getProtemList() {
    this.listOfDocs = this.tempListOfDocs = [];
    this.electionService.getProtemSpeakerList(this.protemStatus).subscribe((res: any) => {
      this.listOfDocs = this.tempListOfDocs = res;
    });
  }

  searchProtemList() {
    if (this.search) {
      this.listOfDocs = this.tempListOfDocs.filter(
        (element) =>
          (element.proTemSpeakerName &&
            element.proTemSpeakerName
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.listOfDocs = this.tempListOfDocs;
    }
  }

  viewOSDoc(id) {
    this.router.navigate(['business-dashboard/tables/election/view-reg-docs', id]);
  }

  viewFile(id) {
    this.router.navigate(['business-dashboard/tables/file-view', 'pro-tem-speaker', id]);
  }

  showLinks(id) {
    this.listOfDocs.forEach((element) => {
        if (element.id === id) {
          element.viewLinks = true;
        } else {
          element.viewLinks = false;
        }
      });
  }

  hideLinks(id) {
    this.listOfDocs.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  showCreateFileModal(list) {
    this.showFileModal = true;
    this.protemDetails = list;
  }

  hideFileModal() {
    this.showFileModal = false;
    this.protemDetails = null;
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.tempListOfDocs.filter((item) => item);
    if (sort.key && sort.value) {
      this.listOfDocs = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.listOfDocs = data;
    }
  }

  showProtemView(id) {
    this.router.navigate(['business-dashboard/tables/election/protem-speaker', id]);
  }

  getRbsPermissionsinList() {
    if (this.commonService.doIHaveAnAccess('FILE', 'CREATE')) {
      this.permission.createFile = true;
    }
    if (this.commonService.doIHaveAnAccess('CREATE_PROTEM_SPEAKER', 'CREATE')) {
      this.permission.createProtemSpeaker = true;
    }
  }

  showProtemPopup() {
    const body= ["MEMBER","ELECTED"]
    this.electionService.getMemberList(body).subscribe((res: any) => {
      this.memberList = res;
      this.isProtemVisible = true;
    });
  }

  hideProtemModal() {
    this.isProtemVisible = false;
    this.protemSpeaker = null;
  }

  createProtemSpeaker() {
    const body = {
      id: null,
      proTemSpeakerId: this.protemSpeaker
    };
    this.electionService.createProtemSpeaker(body).subscribe((res: any) => {
      this.notification.success(
        'Success',
        'Protem Speaker Created Successfully!'
      );
      this.hideProtemModal();
      this.getProtemList();
    });
  }

}
