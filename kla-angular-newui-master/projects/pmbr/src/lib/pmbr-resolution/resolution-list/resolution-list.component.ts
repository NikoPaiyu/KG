import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { InoticeDetails } from '../../pmbr-bill/shared/models/pmbr-bill-model';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
import { PmbrResolutionService } from '../shared/services/pmbr-resolution.service';

@Component({
  selector: 'pmbr-resolution-list',
  templateUrl: './resolution-list.component.html',
  styleUrls: ['./resolution-list.component.css']
})
export class ResolutionListComponent implements OnInit {
  resolutionList: any = [];
  tempResolutionList: any = [];
  showHideResolutionMetaData = false;
  showHideCreateNotice = false;
  noticeDetails: InoticeDetails;
  searchMyResolution;
  user: any;
  permissions = {
    createResolution: false,
    updateResolution: false,
    createAmendment: false
  };
  selectedResolutionId;
  showWonNoticeTabe = false;
  passedResolutions = [];
  colCheckboxes = [
    { id: 0, label: 'bill', check: true, disable: false },
    { id: 1, label: 'type of bill', check: true, disable: false },
    { id: 2, label: 'language', check: true, disable: false },
    { id: 3, label: 'honblemember', check: true, disable: false },
    { id: 4, label: 'department', check: true, disable: false },
    { id: 5, label: 'status', check: true, disable: false },
    { id: 6, label: 'action', check: true, disable: false }
  ];
  heading;
  constructor(private pmbrCommonService: PmbrResolutionService, private router: Router, private notification: NzNotificationService,
    private route: ActivatedRoute, @Inject('authService') private AuthService,
    private common: PmbrCommonService) {
    this.user = AuthService.getCurrentUser();
    this.common.setPermissions(this.user.rbsPermissions);
  }

  ngOnInit() {
    this.getRbsPermissions();
    this.resolutionBillList();
    this.getPassedResolutions();
  }
  resolutionBillList() {
    const body = {
      assemblyId: 0,
      assignedTo: 0,
      departmentId: null,
      isGovernerRecommendation: false,
      isOrdinance: false,
      natureOfBill: "string",
      sessionId: 0,
      status: [
        null
      ],
      type: "PRIVATE_MEMBER_RESOLUTION",

    }
    this.pmbrCommonService.getResolutionList(body).subscribe((Res: any) => {
      this.resolutionList = this.tempResolutionList = Res;
    });
  }
  searchList(searchText) {
    if (searchText) {
      this.resolutionList = this.tempResolutionList.filter(
        (element) => (element.billMetaDataDto.title && element.billMetaDataDto.title
          .toLowerCase().includes(searchText.toLowerCase())) ||
          (element.billMetaDataDto.createdDate && element.billMetaDataDto.createdDate
            .toLowerCase().includes(searchText.toLowerCase())) ||
          (element.billMetaDataDto.type && element.billMetaDataDto.type
            .toLowerCase().includes(searchText.toLowerCase())) ||
          (element.billMetaDataDto.session && element.billMetaDataDto.session
            .toLowerCase().includes(searchText.toLowerCase())) ||
          (element.billMetaDataDto.status && element.billMetaDataDto.status
            .toLowerCase().includes(searchText.toLowerCase()) ||
            (element.billMetaDataDto.language && element.billMetaDataDto.language
              .toLowerCase().includes(searchText.toLowerCase()))));
    } else {
      this.resolutionList = this.tempResolutionList;
    }
  }
  hidePopUp() {
    this.showHideResolutionMetaData = false;
    this.showHideCreateNotice = false;
  }
  updateOrCancelResolutionMetaData(res) {
    if (res) {
      this.notification.success('Success', 'Resolution updated succesfully..');
      this.resolutionBillList();
    }
    this.hidePopUp();
  }
  editContent(resolutionId) {
    this.router.navigate(["business-dashboard/pmbr/create-resolution", resolutionId]);
  }
  createNoticeText(type, event) {
    return event.notices.some(n => n.noticeType == type) ? 'ViewNotice' : 'CreateNotice'
  }
  showCreateNotice(type, event) {
    const noticeDetails = event.notices.find(n => n.noticeType == type)
    if(noticeDetails){
      this.heading = "View Notice"
    }else{
      this.heading = "Create Notice"
    }
    this.noticeDetails = {
      billId: event.billMetaDataDto.id,
      noticeId: noticeDetails ? noticeDetails.id : null,
      noticeType: type,
      billStatus: event.billMetaDataDto.status
    }
    this.showHideCreateNotice = true;
  }
  saveNotice(event) {
    if (event) {
      this.resolutionBillList();
      this.notification.success('Success', 'Notice created successfully')
    }
    this.hidePopUp();
  }
  createAmendment(billId) {
    this.router.navigate(['./resolution-amendment', billId], { relativeTo: this.route.parent });
  }
  editResolutionMetaData(resolutionId) {
    this.selectedResolutionId = resolutionId;
    this.showHideResolutionMetaData = true;
  }
  getRbsPermissions() {
    if (this.common.doIHaveAnAccess('PM_RESOLUTION', 'CREATE')) {
      this.permissions.createResolution = true;
    }
    if (this.common.doIHaveAnAccess('PM_RESOLUTION', 'UPDATE')) {
      this.permissions.updateResolution = true;
    }
    if (this.common.doIHaveAnAccess('RESOLUTION_AMENDMENT', 'CREATE')) {
      this.permissions.createAmendment = true;
    }
  }
  resolutionTabClick() {
    this.showWonNoticeTabe = false;
    this.resolutionBillList();
  }
  wonNoticeTabClick() {
    this.showWonNoticeTabe = true;
  }
  viewResolutionContent(resolutionId) {
    this.router.navigate(["business-dashboard/pmbr/resolution-view", resolutionId]);
  }
  getPassedResolutions() {
    this.pmbrCommonService.getPresentedResolutionList().subscribe((data: any) => {
      // this.passedResolutions = data;
      this.passedResolutions = data.filter(x=> x.billOwnerId !== this.user.userId);
    });
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

  isMinister() {
    return this.user.authorities.includes("minister");
  }
}
