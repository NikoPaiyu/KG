import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { FileServiceService } from '../../shared/services/file-service.service';

@Component({
  selector: 'committee-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit {
  filtrParams: any = {};
  committeeId: any;
  showFilePopup = false;
  searchMeet = null;
  result: any = [];
  allResult: any = [];
  allConsents: any = [];
  pendingNoticeList: any = [];
  myMeetingList: any = [];
  tableParams: any = { colSpan: false };
  colCheckboxes = [
    { id: 0, label: 'title', check: true, disable: false },
    { id: 1, label: 'date', check: true, disable: false },
    { id: 2, label: 'venue', check: true, disable: false },
    { id: 3, label: 'joint', check: true, disable: false }
  ];
  showDetailsPopup = false;
  permissions: any = {
    meetingCreate: false,
    createFile: false,
    myMeeting: false,
    pendingNoticeList: false
  };
  user: any;
  constructor(private service: CommitteecommonService,
              private router: Router,
              @Inject('authService') private AuthService,
              private file: FileServiceService,
              private notification: NzNotificationService) {
                this.user = AuthService.getCurrentUser();
                this.service.setCommitteePermissions(this.user.rbsPermissions);
              }

  ngOnInit() {
    this.loadPermissions();
    this._setFilter();
    this._getList();
  }
  searchMeetList() {

  }
  // let type='GENERAL_AMENDMENT';
  _getList() {
    // this.service.getBillList().subscribe((Response) => {
    // this.result = this.allResult = new Array(5).fill(0).map((_, index) => {
    //   if (index < 6) {
    //     return {
    //       no: 332,
    //       id: index++,
    //       title: "The Kerala Appropriation(No.2) Bill, 2020",
    //       date: "malayalam",
    //       minister: "Dn. T M Thomas Isaac",
    //       dept: "Finance",
    //       status: "Status",
    //       viewLinks: false,
    //     };
    //   }
this.service.getAllMeetingList().subscribe((Res)=>{
  this.result=this.allResult=Res;
})
    // });

    // });
  }
  sort(sort: { key: string; value: string }): void {
    const data = this.allResult.filter((item) => item);
    if (sort.key && sort.value) {
      this.result = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.result = data;
    }
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
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.result.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  showConsentLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.allConsents.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  hideLinks(id) {
    this.result.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  hideConsentLinks(id) {
    this.allConsents.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }
  // cancelBulletin() {
  //   this.showFilePopup=false;
  // }
  showPopup(id) {
    if(id) {
      this.committeeId=id;
    this.showFilePopup=true;
    }
  }

  showFilter(type) {
    // this.filtrParams.colFilter = type === "column" ? true : false;
    this.filtrParams.rowFilter = type === "row" ? true : false;
    this.filtrParams.showPriorityPopup = false;
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Title", key: "Title" },
      { label: "Date", key: "Date" },
      { label: "Venue", key: "Venue" },
      // { label: "numberOfAmendments", key: "numberOfAmendments" },
      // { label: "respondedmembers", key: "respondedmembers" },
      // { label: "Status", key: "status" },
    ];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < tableDataMdl.length; i++) {
      const row = {
        key: tableDataMdl[i].key,
        label: tableDataMdl[i].label,
        checked: false,
        filtersel: false,
        data: [],
        selValue: null,
        disableCol: false,
      };
      this.filtrParams.tableDto.push(row);
    }
    this.filtrParams.colFilter = false;
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  // showFilter(type) {
  //   // this.filtrParams.colFilter = type === "column" ? true : false;
  //   this.filtrParams.rowFilter = type === "row" ? true : false;
  //   this.filtrParams.showPriorityPopup = false;
  // }
  _confrmFilter(): void {
    if (this.filtrParams.colFilter) {
      this._filterCols();
    } else {
      this._filterRows();
    }
  }
  _filterCols() {
    this.filtrParams.colFilter = false;
    // this.filtrParams.tableDto.forEach((element) => {
    //   if (element.checked) {
    //     element.disableCol = true;
    //   }
    // });
  }
  _filterRows() {
    this.filtrParams.rowFilter = false;
    this.filtrParams.tableDto.forEach((element) => {
      element.filtersel = element.checked;
    });
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    let count = 0;
    this.filtrParams.tableDto.forEach((element) => {
      count++;
      if (element.filtersel) {
        switch (element.key) {
          case "Title":
            this.allResult.forEach((value) => {
              element.data.push(value.title);
            });
            break; 
          case "Date":
            this.allResult.forEach((value) => {
              element.data.push(value.date);
            });
            break;
          case "Venue":
            this.allResult.forEach((value) => {
              element.data.push(value.venue);
            });
            break;
          // case "fileNo":
          //   this.allClauseList.forEach((value) => {
          //     element.data.push(value.fileNumber);
          //   });
          //   break;
          // case "numberOfAmendments":
          //   this.allClauseList.forEach((value) => {
          //     element.data.push(value.numberOfNotices);
          //   });
          //   break;
          // case "respondedmembers":
          //     this.allClauseList.forEach((value) => {
          //       element.data.push(value.ministerName);
          //     });
          //     break;  
          // case "status":
          //   this.allClauseList.forEach((value) => {
          //     element.data.push(value.status);
          //   });
          //   break;
          default:
            break;
        }
      }
    });
    if (count === this.filtrParams.tableDto.length) {
      this.filtrParams.tableDto.forEach((element) => {
        element.data = element.data.filter((v, i, a) => a.indexOf(v) === i);
      });
    }
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.result= this.allResult;
    } else {
      this.result= this.allResult.filter((item: any) =>
        this.applyFilter(item, this.filtrParams.tableDto)
      );
    }
  }
  applyFilter(element: any, filter: any) {
    for (const field in filter) {
      if (filter[field].selValue) {
        if (typeof filter[field].selValue === "string") {
          if (
            !element[filter[field].key] ||
            element[filter[field].key].toLowerCase() !==
              filter[field].selValue.toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field].selValue === "number") {
          if (
            !element[filter[field].key] ||
            element[filter[field].key] !== filter[field].selValue
          ) {
            return false;
          }
        // } else if (typeof filter[field].selValue === "object") {
        //   if (
        //     !element[filter[field].key] ||
        //     element[filter[field].key] !== filter[field].selValue
        //   ) {
        //     return false;
        //   }
         }
      }
    }
    return true;
  }
  
  disableFilter(filter) {
    filter.filtersel = false;
    filter.checked = false;
    filter.data = [];
    filter.selValue = null;
    this.searchCol();
    this._loadSelectedfilterData();
  }
  clearFilter() {
    this._setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }
  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
  }
  closeModal(event){
    // if(!event){
      this.showFilePopup=event;
      // this._getList();
    // }
  }
  showFile(id){
    this.router.navigate(["business-dashboard/committee/file-view",id])
  }
  onCancelPopup() {
    this.showFilePopup = false;
    this.committeeId = null;
  }
  showMeetDetailsPopup() {
    this.showDetailsPopup = true;
  }

  closeDetailsPopup() {
    this.showDetailsPopup = false;
  }

  afterCreateMeeting(event) {
    if (event) {
      this._getList();
      this.closeDetailsPopup();
    }
  }

  showMeeting(id) {
    this.router.navigate(['/business-dashboard/committee/meeting-view', id]);
  }

  loadPermissions() {
    if (this.service.doIHaveAnAccess('MEETING', 'CREATE')) {
      this.permissions.createMeeting = true;
    }
    if (this.service.doIHaveAnAccess('FILE', 'CREATE')) {
      this.permissions.createFile = true;
    }
    if (this.service.doIHaveAnAccess('PENDING_MEETING_NOTICES', 'READ')) {
      this.permissions.pendingNoticeList = true;
    }
    if (this.service.doIHaveAnAccess('MY_MEETING', 'READ')) {
      this.permissions.myMeeting = true;
    }
  }
  getConsentsList() {
    this.service.getAllConsentList().subscribe(Res => {
      this.allConsents = Res;
    });
  }
  _getPendingList() {
    const body = {};
    this.service.getPendingMeetingNoticeList(body).subscribe(Res => {
      if (Res) {
        this.pendingNoticeList = Res;
      }
    });
  }
  _getMyMeetingList() {
    this.service.getMyMeetingList().subscribe( Res => {
      if (Res) {
        this.myMeetingList = Res;
      }
    });
  }
  showNoticeLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.pendingNoticeList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  hideNoticeLinks(id) {
    this.pendingNoticeList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }
  showNotice(id) {
    this.router.navigate(['/business-dashboard/committee/view-meeting', id]);
  }
  showMeetingLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.myMeetingList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }
  hideMeetingLinks(id) {
    this.myMeetingList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  resubmitMeeting(meeting) {
    const fileReqbody={
      meetingId: meeting.id,
      fileForm: {
        activeSubTypes: ['MEETING_DETAIL'],
        fileId: meeting.fileId,
        subtype : 'COMMITTEE_MEETING',
        type: 'COMMITTEE',
        userId : this.user.userId
      }
    };
    this.file
    .reSubmitFile(fileReqbody)
    .subscribe((Res: any) => {
      this.notification.success('Success', ' Resubmitted Successfully');
      this.router.navigate(['business-dashboard/committee/file-view/', meeting.fileId]);
    });
  }
}
