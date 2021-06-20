import { Component, OnInit } from "@angular/core";
import { NoticeTemplateService } from "../../shared/services/notice-template.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl } from "@angular/forms";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NoticeService } from "../../shared/services/notice.service";
import { debounceTime } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";
@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss']
})
export class NoticeListComponent implements OnInit {

  maxValue: any;
  maxNumber: any;
  serialnodisable = true;
  noticenodisable = true;
  noticeheadingdisable = true;
  noticetypedisable = true;
  filenodisable = true;
  regdatedisable = true;
  statusdisable = true;
  isOkLoading = true;
  serialNo = [];
  noticeNo = [];
  noticeHeading = [];
  noticeType = [];
  fileNo = [];
  regDate = [];
  Status = [];
  serialnohide = true;
  noticenohide = true;
  noticeheadinghide = true;
  filter = {
    assemblyId: null,
    sessionId: null,
    searchText: "",
    status: "SUBMITTED"
  };
  filterCheckboxes = [
    { id: 1, label: "Serial No", checked: true },
    { id: 2, label: "Notice No", checked: true },
    { id: 3, label: "Notice Heading", checked: true },
    { id: 4, label: "Notice Type", checked: true },
    { id: 5, label: "File No", checked: true },
    { id: 6, label: "RegDate", checked: true },
    { id: 7, label: "Status", checked: true },
  ];
  checkboxes = [
    { id: 1, label: "File No", check: true },
    { id: 2, label: "File Subject", check: true },
    { id: 3, label: "Priority", check: true },
    { id: 4, label: "From Whom", check: true },
    { id: 5, label: "RegDate", check: true },
    { id: 6, label: "Status", check: true },
  ];
  assemblyList = [];
  sessionList = [];
  noticeList: any = [];
  status = null;
  startId = 0;
  id = this.startId - 1;
  total = 0;
  listOfData: any;
  TypeSelection = new FormControl('1');
  noticeStatusList = [
    "SUBMITTED",
    "APPROVED",
    "WITHDRAWN",
    "DISALLOWED",
    "REVOKED"
  ];
  filterSelected = {
    serialNo: null,
    noticeNo: null,
    noticeHeading: null,
    noticeType: null,
    fileNo: null,
    regDate: null,
    status: null,
  };
  numberOfItem = 10;
  pageIndex = 0;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  isVisible = false;
  value: any;
  sections: any;
  isConfirmLoading = false;
  flag = false;
  noticeIds: any = [];
  allFileList = [];
  fileList = [];
  noOfChecked: any = [];
  encodedUrl = btoa('../../ab/list');
  showDrop: boolean;
  viewContent: any;
  isVisibleFilter = false;
  listOfAllData = [];
  searchCol: any;
  constructor(
    private service: NoticeTemplateService,
    private route: ActivatedRoute,
    public notice: NoticeService,
    private router: Router,
    private user: AuthService,
    private cos: CalenderofsittingService
  ) {
    this.noOfChecked = 0;
  }

  ngOnInit() {
    this.status = this.route.snapshot.params.status || null;
    this.loadPermissions();
    this.getAssemblySessionDetails();
  }

  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.filter.assemblyId = data.activeAssemblySession.assemblyId;
      this.filterAssembly();
      this.filter.sessionId  = data.activeAssemblySession.sessionId;
      this.getAllNotice(0);
      
    });
  }
  filterAssembly() {
    const assemblyDetail = this.assemblyList.find(x => x.id == this.filter.assemblyId);
    if (assemblyDetail) {
      this.sessionList = assemblyDetail.session;
    }
    this.filter.sessionId = null;
    this.listOfData = [];
    this.noticeList = [];
  }

  loadPermissions() {
    this.notice.getNoticePermissions(this.user.getCurrentUser().userId);
  }

  resetFilter() {
    this.filter = {
      assemblyId: null,
      sessionId: null,
      searchText: "",
      status: "SUBMITTED"
    };
    this.getAllNotice(0);
  }

  getAllNoticeList() {
    this.filter.searchText = "";
    const body = {
      assemblyId: this.filter.assemblyId,
      sessionId: this.filter.sessionId,
      status: this.filter.status ? this.filter.status : ""
    };

    this.notice
      .getAllNoticeswithAssemblySessionStatus(body)
      .pipe(debounceTime(1000))
      .subscribe((Response: any) => {
        if (Response) {
          this.listOfData = this.noticeList = Response;
        }
      });
  }
  getAllNotice(startId) {
    if (!this.filter.status)
      this.filter.status = "SUBMITTED";
    this.getAllNoticeList();
  }
  isMLA() {
    return this.user.getCurrentUser().authorities.includes("MLA");
  }
  isPPO() {
    return this.user.getCurrentUser().authorities.includes("ppo") || this.user.getCurrentUser().authorities.includes("parliamentaryPartySecretary");
  }
  isSpeaker() {
    return this.user.getCurrentUser().authorities.includes("speaker");
  }
  onchange(id): void {
    this.getAllNotice(id);
  }
  processNotice(noticeData) {
    if ((this.isMLA() && !this.isSpeaker()) || this.isPPO()) {
      if (noticeData.status === "SAVED") {
        this.router.navigate(
          ["../../notice/ab/create", 0, noticeData.noticeId],
          { relativeTo: this.route.parent }
        );
      } else {
        this.router.navigate(["../../notice/process", noticeData.noticeId, this.encodedUrl], {
          relativeTo: this.route.parent
        });
      }
    } else {
      this.router.navigate(["../../notice/process", noticeData.noticeId, this.encodedUrl], {
        relativeTo: this.route.parent
      });
    }
  }

  pageSizeChange(numberOfItem) {
    this.pageIndex = 0;
    this.numberOfItem = numberOfItem;
    this.getAllNotice(this.pageIndex);
  }

  pageIndexChange(index) {
    this.pageIndex = index;
    this.getAllNotice(this.pageIndex);

  }
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  updateCheckedSet(noticeId: any, checked: boolean): void {
    if (checked && this.noticeIds.indexOf(noticeId) < 0) {
      this.setOfCheckedId.add(noticeId);
    } else {
      this.setOfCheckedId.delete(noticeId);
    }
  }



  refreshCheckedStatus(): void {
    this.checked = this.noticeList.every(item =>
      this.setOfCheckedId.has(item.noticeId)
    );
    const noticeid = this.noticeList.filter(item =>
      this.setOfCheckedId.has(item.noticeId)
    );
    this.noticeIds = noticeid.map(x => x.noticeId);
    this.noOfChecked = this.noticeIds.length;
    this.indeterminate =
      this.noticeList.some(item => this.setOfCheckedId.has(item.noticeId)) &&
      !this.checked;
  }

  addNotice(checked, noticeId) {
    if (checked) {
      this.noticeIds.push(noticeId);
    } else {
      this.noticeIds.splice(this.noticeIds.indexOf(noticeId), 1);
    }
  }

  showDropdown() {
    this.showDrop = true;
  }

  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  _hideFilter(): void {
    this.isVisibleFilter = false;
  }

  _showFilter(): void {
    this.isVisibleFilter = false;
    this.serialnodisable = this.filterCheckboxes.find(
      (element) => element.label === "Serial No"
    ).checked;
    this.noticenodisable = this.filterCheckboxes.find(
      (element) => element.label === "Notice No"
    ).checked;
    this.noticeheadingdisable = this.filterCheckboxes.find(
      (element) => element.label === "Notice Heading"
    ).checked;
    this.noticetypedisable = this.filterCheckboxes.find(
      (element) => element.label === "Notice Type"
    ).checked;
    this.filenodisable = this.filterCheckboxes.find(
      (element) => element.label === "File No"
    ).checked;
    this.regdatedisable = this.filterCheckboxes.find(
      (element) => element.label === "RegDate"
    ).checked;
    this.statusdisable = this.filterCheckboxes.find(
      (element) => element.label === "Status"
    ).checked;
  }

  searchForNotices() {
    if (this.filter.searchText) {
      this.noticeList = this.listOfData.filter(
        (element) =>
          (element.noticeNumber &&
            element.noticeNumber
              .toLowerCase()
              .includes(this.filter.searchText.toLowerCase())) ||
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.filter.searchText.toLowerCase())) ||
          (element.templateName &&
            element.templateName
              .toLowerCase()
              .includes(this.filter.searchText.toLowerCase())) ||
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.filter.searchText.toLowerCase())) ||
          (element.createdDate &&
            element.createdDate.toString()
              .toLowerCase()
              .includes(this.filter.searchText.toLowerCase()))
      );
    } else {
      this.noticeList = this.listOfData;
    }
  }
}
