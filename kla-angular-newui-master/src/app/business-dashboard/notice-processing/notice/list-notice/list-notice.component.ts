import { Component, OnInit } from "@angular/core";
import { NoticeTemplateService } from "../../shared/services/notice-template.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { NoticeService } from "../../shared/services/notice.service";
import { debounceTime } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { FileService } from "../../shared/services/file.service";
import { NotificationCustomService } from "src/app/shared/services/notification.service";
import { differenceInCalendarDays } from "date-fns";
import { NoticeProcessService } from "../../shared/services/notice-process.service";
import { CalenderofsittingService } from "src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service";

@Component({
  selector: "app-list-notice",
  templateUrl: "./list-notice.component.html",
  styleUrls: ["./list-notice.component.scss"],
})
export class ListNoticeComponent implements OnInit {
  tempData: any = [];
  searchPerson: any = null;
  radioValue: any = null;
  assigneeCode: any = "";
  searchParamForFiles = "";
  pendingFileList: any = [];
  allPendingFileList: any = [];
  searchPendingFilesParam = "";
  searchBACParam = "";
  today = new Date();
  maxValue: any;
  maxNumber: any;
  workFlowId: any;
  userId;
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
  searchParam: string;
  serialnohide = true;
  noticenohide = true;
  noticeheadinghide = true;
  quickOptions = [
    { label: "Can be admitted", disallowStatus: false },
    { label: "Can be disallowed as per rule", disallowStatus: true },
    { label: "Not allowed as per rule", disallowStatus: true },
  ];
  selectedTags = [];
  filter = {
    assemblyId: null,
    sessionId: null,
    searchText: "",
    status: null,
  };
  filterCheckboxes = [
    { id: 1, label: "Serial No", checked: true },
    { id: 2, label: "Notice No", checked: true },
    { id: 3, label: "Notice Heading", checked: true },
    { id: 4, label: "Notice Type", checked: true },
    { id: 5, label: "Submitted By", checked: true },
    { id: 6, label: "RegDate", checked: true },
    { id: 7, label: "Status", checked: true },
  ];
  checkboxes = [
    { id: 1, label: "File No", check: true },
    { id: 2, label: "File Subject", check: true },
    { id: 3, label: "Priority", check: true },
    { id: 5, label: "RegDate", check: true },
    { id: 6, label: "Status", check: true },
  ];
  arisingFileNumber = 0;
  assemblyList = [];
  sessionList = [];
  noticeSessionList = [];
  noticeList: any = [];
  status = null;
  startId = 0;
  id = this.startId - 1;
  total = 0;
  listOfData: any;
  data = [];
  bacList: any = [];
  allBACList: any = [];
  TypeSelection = new FormControl("1");
  noticeStatusList = [
    "SAVED",
    "SUBMITTED",
    "APPROVED",
    "WITHDRAWN",
    "DISALLOWED",
    "REVOKED",
    "CONSENT_PENDING",
    "CONSENT_REJECTED",
  ];
  noticeStatusList1 = ["Serial No"];
  filterSelected = {
    serialNo: null,
    noticeNo: null,
    noticeHeading: null,
    noticeType: null,
    fileNo: null,
    regDate: null,
    status: null,
  };
  //assemblyIdFlag = true;
  //sessionIdFlag = true;
  numberOfItem = 10;
  pageIndex = 0;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfSelection = [
    {
      text: "Select All Row",
      onSelect: () => {
        this.onAllChecked(true);
      },
    },
    {
      text: "Select Odd Row",
      onSelect: () => {
        this.noticeList.forEach((data, index) =>
          this.updateCheckedSet(data.noticeId, index % 2 !== 0)
        );
        this.refreshCheckedStatus();
      },
    },
    {
      text: "Select Even Row",
      onSelect: () => {
        this.noticeList.forEach((data, index) =>
          this.updateCheckedSet(data.noticeId, index % 2 === 0)
        );
        this.refreshCheckedStatus();
      },
    },
  ];
  mockData = [
    {
      key: "1",
      name: "John Brown",
      date: 22,
    },
    {
      key: "2",
      name: "Jim Green",
      date: 25,
    },
    {
      key: "3",
      name: "Joe Black",
      date: 27,
    },
  ];
  isVisible = false;
  value: any;
  advancedFiltersFlag = true;
  popupFlag = false;
  sections: any;
  isConfirmLoading = false;
  flag = false;
  noticeIds: any = [];
  allFileList = [];
  fileList = [];
  noOfChecked: any = [];
  createFileForm: FormGroup = this.fb.group({
    assemblyId: [1, Validators.required],
    sessionId: [4, Validators.required],
    currentNumber: ["", Validators.required],
    backFileReference: [""],
    subject: ["", Validators.required],
    type: ["NOTICE", Validators.required],
    priority: ["NORMAL", Validators.required],
    description: ["", Validators.required],
    userId: [this.user.getCurrentUser().userId, Validators.required],
  });
  attachFileForm: FormGroup = this.fb.group({
    fileId: ["", Validators.required],
    fileNo: [""],
    subject: [""],
    searchParamForFiles: [""],
  });
  assignTaskForm: FormGroup = this.fb.group({
    sections: ["", Validators.required],
    name: ["", Validators.required],
    seatNo: ["", Validators.required],
    userId: [0, Validators.required],
  });
  dateForm: FormGroup = this.fb.group({
    date: ["", Validators.required],
  });
  encodedUrl = btoa("../../ab/list");
  showDrop: boolean;
  viewContent: any;
  isVisible1: boolean;
  isVisibleFilter = false;
  listOfAllData = [];
  searchCol: any;
  fileId = 0;
  totalNoticeList = [];
  pendingTimeAllocationList: any = [];
  tempPendingTimeAllocationList: any = [];
  searchTAParam: any = null;
  isForwardVisible = false;
  forwardNoticeData: any = null;
  dateList: any = [];
  forwardedDate = new Date();
  disabledCosDates: any = null;
  businessMapForTA: any = null;
  selectedDates: any = [];
  tabIndex = 0;

    constructor(
    private service: NoticeTemplateService,
    private route: ActivatedRoute,
    public notice: NoticeService,
    private router: Router,
    private user: AuthService,
    private fb: FormBuilder,
    private file: FileService,
    private notify: NotificationCustomService,
    private process: NoticeProcessService,
    private cos: CalenderofsittingService
  ) {
    this.noOfChecked = 0;
  }

  ngOnInit() {
    this.status = this.route.snapshot.params.status || null;
    const id = this.user.getCurrentUser();
    // this.getAssemblyList();
    // this.getSessionList();
    this.getAssemblySessionDetails();
    this.loadPermissions();
    this.getPendingBacNotices();
  }
  getAssemblySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.filter.assemblyId = data.activeAssemblySession.assemblyId;
      this.filterFiles();
      this.filterNoticeAssembly();
      this.filter.sessionId = data.activeAssemblySession.sessionId;
      this.getAllNotice(0);
      this.getPendingFile();
    });
  }
  filterFiles() {
    const assemblyDetails = this.assemblyList.find(x => x.id == this.filter.assemblyId);
    if (assemblyDetails) {
      this.sessionList = assemblyDetails.session;
    }
    this.filter.sessionId = null;
    this.pendingFileList = [];
  }
  filterNoticeAssembly() {
    const assemblyDetails = this.assemblyList.find(x => x.id == this.filter.assemblyId);
    if (assemblyDetails) {
      this.noticeSessionList = assemblyDetails.session;
    }
    this.filter.sessionId = null;
    this.noticeList = [];
  }

  getAllFiles() {
    this.file
      .getAllFiles(this.filter.assemblyId, this.filter.sessionId)
      .subscribe((Response) => {
        this.allFileList = this.fileList = Response;
        //console.log(this.fileList);
        this.onSearchFilesForAttach();
      });
  }
  loadPermissions() {
    this.notice.getNoticePermissions(this.user.getCurrentUser().userId);
  }

  /*getAssemblyList() {
    this.service.getAllAssembly().subscribe((Response) => {
      this.assemblyList = Response;
      const res = this.assemblyList.map((x) => x.id);
      this.maxNumber = Math.max.apply(null, res);
      this.filter.assemblyId = this.maxNumber;
    });
  }
  getSessionList() {
    this.service.getAllSession().subscribe((Response) => {
      this.sessionList = Response;
      const result = this.sessionList.map((x) => x.id);
      this.maxValue = Math.max.apply(null, result);
      this.filter.sessionId = this.maxValue;
    });
  }*/
  resetFilter() {
    this.filter = {
      assemblyId: null,
      sessionId: null,
      searchText: "",
      status: null,
    };
    this.getAllNotice(0);
  }
  getNoticeListByUser(startId) {
    const body = {
      startPage: startId,
      numberOfItem: this.numberOfItem,
      userId: this.user.getCurrentUser().userId,
      assemblyId: this.filter.assemblyId,
      sessionId: this.filter.sessionId,
      inputText: this.filter.searchText,
      status: this.filter.status ? this.filter.status : null,
    };

    this.service
      .getNoticeByUserId(body)
      .pipe(debounceTime(1000))
      .subscribe((Response) => {
        if (Response) {
          this.listOfData = Response;
          this.noticeList = [];
          this.noticeList = Response.notices;
          this.noticeList = this.noticeList.map((x) => {
            x.checked = false;
            return x;
          });
          this.total = this.listOfData.totalElements;
        }
      });
  }

  getAllPendingNoticeList(startId) {
    const body = {
      startPage: startId,
      numberOfItem: this.numberOfItem,
      userId: this.user.getCurrentUser().userId,
      // role: this.isSpeaker() ? "speaker" : this.user.getCurrentUser().authorities[0],
      assemblyId: this.filter.assemblyId,
      sessionId: this.filter.sessionId,
      inputText: this.filter.searchText,
      status: this.filter.status ? this.filter.status : null,
    };

    this.service
      .getAllPendingNotice(body)
      .pipe(debounceTime(1000))
      .subscribe((Response) => {
        if (Response) {
          this.listOfData = Response;
          this.noticeList = [];
          this.noticeList = Response.notices;
          this.noticeList = this.noticeList.map((x) => {
            x.checked = false;
            return x;
          });
          this.total = this.listOfData.totalElements;
          for (const item of this.noticeList) {
            if (!this.totalNoticeList.find((val) => val.noticeId === item.noticeId)) {
              this.totalNoticeList.push(item);
            }
          }
        }
      });
  }
  getAllNotice(startId) {
    if ((this.isMLA() && !this.isSpeaker()) || this.isPPO()) {
      this.getNoticeListByUser(startId);
    } else {
      this.getAllPendingNoticeList(startId);
    }
  }
  isMLA() {
    return this.user.getCurrentUser().authorities.includes("MLA");
  }
  isPPO() {
    return (
      this.user.getCurrentUser().authorities.includes("ppo") ||
      this.user
        .getCurrentUser()
        .authorities.includes("parliamentaryPartySecretary")
    );
  }
  isSpeaker() {
    return this.user.getCurrentUser().authorities.includes("speaker");
  }
  gotoCreatenotice(event) {
    console.log(event);
    this.router.navigate(["../../notice/ab"], {
      relativeTo: this.route.parent,
    });
  }
  openFile(fileId) {
    this.router.navigate(["../../notice/staff/file", fileId], {
      relativeTo: this.route.parent,
    });
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
        this.router.navigate(
          ["../../notice/process", noticeData.noticeId, this.encodedUrl],
          {
            relativeTo: this.route.parent,
          }
        );
      }
    } else {
      this.router.navigate(
        ["../../notice/process", noticeData.noticeId, this.encodedUrl],
        {
          relativeTo: this.route.parent,
        }
      );
    }
  }

  // removeAssemblyId() {
  //   this.assemblyIdFlag = false;
  // }

  // removeSessionId() {
  //   this.sessionIdFlag = false;
  // }

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
    this.tabIndex = 0;
    this.createFileForm = this.fb.group({
      assemblyId: [1, Validators.required],
      sessionId: [4, Validators.required],
      currentNumber: [null , Validators.required],
      backFileReference: [''],
      subject: ['', Validators.required],
      type: ['NOTICE', Validators.required],
      priority: ['NORMAL', Validators.required],
      description: ['', Validators.required],
      userId: [this.user.getCurrentUser().userId, Validators.required],
    });
  }
  attachToFile() {
    if (this.noticeIds && this.noticeIds.length > 0) {
      let notices = this.noticeList
        .filter((element) =>
          this.noticeIds.some((ids) => ids == element.noticeId)
        )
        .map((notice) => notice.templateName);
      if (notices) {
        let noticeTypeSet = new Set(notices);
        if (noticeTypeSet.size > 1) {
          this.notify.showError(
            "Alert",
            "Notices of Different Types Are Not Allowed."
          );
        } else {
          this.attachFileForm.reset();
          const noticesforfiles = this.noticeList.map((x) => x.noticeId);
          if (noticesforfiles && noticesforfiles.length > 0) {
            this.getFilestoAttach(noticesforfiles[0]);
            if (this.arisingFileNumber === 0){
              this.getArisingFileNumber();
            }
          }
        }
      }
    }
  }
  getFilestoAttach(noticeId) {
    this.file
      .getFilesToAttachByNoticeId(
        this.filter.assemblyId,
        this.filter.sessionId,
        noticeId
      )
      .subscribe((data) => {
        this.fileList = data;
        this.allFileList = data;
        console.log(this.fileList);
        this.isVisible = true;
      });
  }
  onAdvancedFilterclick() {
    this.advancedFiltersFlag = false;
  }
  showTask() {
    if (this.noticeIds && this.noticeIds.length > 0) {
      let notices = this.noticeList
        .filter((element) =>
          this.noticeIds.some((ids) => ids == element.noticeId)
        )
        .map((notice) => notice.templateName);
      if (notices) {
        let noticeTypeSet = new Set(notices);
        if (noticeTypeSet.size > 1) {
          this.notify.showError(
            "Alert",
            "Notices of Different Types Are Not Allowed."
          );
        } else {
          this.assignTaskForm.reset();
          const noticesforfiles = this.noticeList.map((x) => x.workFlowId);
          if (noticesforfiles && noticesforfiles.length > 0) {
            this.getWorkFlowRole(noticesforfiles[0]);
          }
        }
      }
    }
  }
  Cancel() {
    this.popupFlag = false;
  }
  assign() {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.popupFlag = false;
      this.isConfirmLoading = false;
    }, 3000);
  }
  updateCheckedSet(noticeId: any, checked: boolean): void {
    if (checked && this.noticeIds.indexOf(noticeId) < 0) {
      this.setOfCheckedId.add(noticeId);
    } else {
      this.setOfCheckedId.delete(noticeId);
    }
  }
  _checkAllRows(value: boolean): void {
    this.setOfCheckedId.forEach((item) =>
      this.updateCheckedSet(this.noticeIds, value)
    );
    // this.listOfCurrentPageData.forEach(
    //   (item) => (this.setOfCheckedId[item.id] = value)
    // );
    this.refreshCheckedStatus();
  }
  onItemChecked(noticeId: any, checked: boolean): void {
    this.updateCheckedSet(noticeId, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.noticeList.forEach((item) =>
      this.updateCheckedSet(item.noticeId, value)
    );
    this.refreshCheckedStatus();
  }

  // onCurrentPageDataChange($event): void {
  //   this.noticeList = $event;
  //   this.refreshCheckedStatus();
  // }

  refreshCheckedStatus(): void {
    this.checked = this.noticeList.every((item) =>
      this.setOfCheckedId.has(item.noticeId)
    );
    const noticeid = this.noticeList.filter((item) =>
      this.setOfCheckedId.has(item.noticeId)
    );
    this.noticeIds = noticeid.map((x) => x.noticeId);
    this.noOfChecked = this.noticeIds.length;
    this.indeterminate =
      this.noticeList.some((item) => this.setOfCheckedId.has(item.noticeId)) &&
      !this.checked;
  }
  createFile() {
    let fileDetails;
    this.createFileForm.get('assemblyId').setValue(this.filter.assemblyId);
    this.createFileForm.get('sessionId').setValue(this.filter.sessionId);
    const data = {
      noticeIds: this.noticeIds,
      fileForm: this.createFileForm.value,
    };
    this.setFileSessions();
    this.file.attachToFile(data).subscribe(
      (Response) => {
        fileDetails = Response[0];
        this.file.getFileById(fileDetails.fileId, this.user.getCurrentUser().userId).subscribe( res => {
          this.notify.showSuccess('Success', 'file' + res.fileResponse.fileNumber + 'created successfully');
        });
        this.getAllNotice(0);
        this.getPendingFile();
        this.router.navigate(['../../notice/staff/file', fileDetails.fileId], {
            relativeTo: this.route.parent,
          });
        this.createFileForm.get('backFileReference').reset();
        this.createFileForm.get('subject').reset();
        this.createFileForm.get('description').reset();
        this.createFileForm.get('currentNumber').reset();
        this.setOfCheckedId.clear();
        this.noOfChecked = 0;
        this.arisingFileNumber = 0;
      },
      (error) => {}
    );
    this.isVisible = false;
  }
  setFileSessions() {
    if (this.noticeIds && this.noticeIds.length > 0) {
      const notice = this.noticeList.find(
        (x) => x.noticeId === this.noticeIds[0]
      );
      if (notice) {
        this.createFileForm.get("assemblyId").setValue(notice.assemblyId);
        this.createFileForm.get("sessionId").setValue(notice.sessionId);
      }
    }
  }
  addNotice(checked, noticeId) {
    if (checked) {
      this.noticeIds.push(noticeId);
    } else {
      this.noticeIds.splice(this.noticeIds.indexOf(noticeId), 1);
    }
  }
  attachFile() {
    const data = {
      noticeIds: this.noticeIds,
      fileForm: this.attachFileForm.value,
    };
    this.file.attachToFile(data).subscribe(
      (Response) => {
        this.noOfChecked = 0;
        this.notify.showSuccess(
          "Success",
          "Notice attached to file successfully"
        );
      },
      (error) => {}
    );
    this.isVisible = false;
    this.getAllNotice(0);
    this.getPendingFile();
  }
  showDropdown() {
    this.showDrop = true;
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };
  getPendingBacNotices() {
    this.file.getPendingBacNotices().subscribe((Response) => {
      if (Response) {
        this.bacList = this.allBACList = Response;
        this.filterBACList();
      }
    });
  }
  setToLob(data) {
    if (this.dateForm.value.date) {
      const body = {
        noticeId: data.noticeId,
        userId: this.user.getCurrentUser().userId,
        lobDate: this.dateForm.value.date,
      };
      this.file.setToLob(body).subscribe((Response) => {
        if (Response) {
          this.getPendingBacNotices();
          this.notify.showSuccess(
            "Success",
            "Notice added to LOB successfully"
          );
          // tslint:disable-next-line: no-unused-expression
          this.dateForm.reset();
        }
      });
    } else {
      this.notify.showWarning("Warning!", "pick a date!");
    }
  }
  cancel() {}
  getPendingFile() {
    const Type = "NOTICE";
    this.file
      .getPendingFile(
        this.filter.assemblyId,
        this.filter.sessionId,
        this.user.getCurrentUser().userId,
        Type
      )
      .subscribe((Response) => {
        this.pendingFileList = this.allPendingFileList = Response;
        this.filterPendingFiles();
      });
  }
  getArisingFileNumber() {
    this.file.getArisingFileNumber().subscribe((Response) => {
      this.arisingFileNumber = Response.body;
    });
  }
  showModal1(noticeData): void {
    this.isVisible1 = true;
    if (noticeData) {
      this.viewContent = noticeData;
    } else {
      this.viewContent = "Nothing to preview";
    }
  }
  handleCancel1(): void {
    this.isVisible1 = false;
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  _hideFilter(): void {
    this.isVisibleFilter = false;
  }
  // clearFilter() {
  //   this.searchParam = "";
  //   this.serialnodisable = false;
  //   this.noticenodisable = false;
  //   this.noticeheadingdisable = false;
  //   this.noticetypedisable = false;
  //   this.filenodisable = false;
  //   this.regdatedisable = false;
  //   this.statusdisable = false;
  //   this.filterSelected = {
  //     serialNo: null,
  //     noticeNo: null,
  //     noticeHeading: null,
  //     noticeType: null,
  //     fileNo: null,
  //     regDate: null,
  //     status: null,
  //   };
  //   this.filterCheckboxes.forEach((element) => {
  //     {
  //       element.checked = false;
  //     }
  //   });
  //   this.searchCol(this.filterSelected);
  // }
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
    // this.filterCheckboxes = [
    //   { label: "Serial No", checked: true },
    //   { label: "Notice No", checked: true },
    //   { label: "Notice Heading", checked: true },
    //   { label: "Notice Type", checked: true },
    //   { label: "File No", checked: true },
    //   { label: "RegDate", checked: true },
    //   { label: "Status", checked: true },
    // ];
  }

  onSearchFilesForAttach() {
    let searchParam = this.attachFileForm.value.searchParamForFiles;
    if (searchParam) {
      this.fileList = this.allFileList.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(searchParam.toLowerCase())) ||
          (element.subject &&
            element.subject.toLowerCase().includes(searchParam.toLowerCase()))
      );
      this.fileList = this.advancedFilter(this.fileList);
    } else {
      this.fileList = this.advancedFilter(this.allFileList);
    }
  }

  advancedFilter(list) {
    if (this.attachFileForm.value.fileNo) {
      list = list.filter(
        (element) =>
          element.fileNumber &&
          element.fileNumber
            .toLowerCase()
            .includes(this.attachFileForm.value.fileNo.toLowerCase())
      );
    }
    if (this.attachFileForm.value.subject) {
      list = list.filter(
        (element) =>
          element.subject &&
          element.subject
            .toLowerCase()
            .includes(this.attachFileForm.value.subject.toLowerCase())
      );
    }
    return list;
  }

  filterPendingFiles() {
    if (this.searchPendingFilesParam) {
      this.pendingFileList = this.allPendingFileList.filter(
        (element) =>
          (element.fileNumber &&
            element.fileNumber
              .toLowerCase()
              .includes(this.searchPendingFilesParam.toLowerCase())) ||
          (element.subject &&
            element.subject
              .toLowerCase()
              .includes(this.searchPendingFilesParam.toLowerCase()))
      );
    } else {
      this.pendingFileList = this.allPendingFileList;
    }
  }

  filterBACList() {
    if (this.searchBACParam) {
      this.bacList = this.allBACList.filter(
        (element) =>
          element.title &&
          element.title
            .toLowerCase()
            .includes(this.searchBACParam.toLowerCase())
      );
    } else {
      this.bacList = this.allBACList;
    }
  }
  showModel(): void {
    this.isVisible = true;
  }
  getWorkFlowRole(workflowId) {
    this.file.getWorkFlowRole(workflowId, this.fileId).subscribe((Response) => {
      if (Response) {
        let datas = Response;
        // this.tempData = Response;
        this.data = datas.filter(
          (element) => element.userId !== this.user.getCurrentUser().userId
        );
        this.tempData = this.data;
        //console.log("data", this.data);
        this.popupFlag = true;
      }
    });
  }
  getrolename(item) {
    this.assigneeCode = item.actionId;
  }
  forwardAllWithAssignee() {
    // debugger
    const details = this.data.map((x) => x.actionName);
    const assign = this.data.map((x) => x.userId);
    const instanceId = this.noticeList
      .filter((element) =>
        this.noticeIds.some((ids) => ids === element.noticeId)
      )
      .map((notice) => notice.workFlowId);
    const body = {
      fromGroup: this.user.getCurrentUser().authorities[0],
      groupId: this.assigneeCode,
      action: "FORWARD",
      processInstanceId: instanceId,
      assignee: this.radioValue.userId,
    };
    this.file.forwardAllWithAssignee(body).subscribe((Res) => {
      console.log("Res", Res);
    });
    this.notify.showSuccess("Success", "Task is Assigned Successfully");
    this.setOfCheckedId.clear();
    this.noOfChecked = 0;
    setTimeout(() => {
      this.getAllNotice(0);
    }, 1500);
    this.popupFlag = false;
  }
  personSearch() {
    if (this.searchPerson) {
      this.data = this.tempData.filter(
        (element) =>
          element.fullName &&
          element.fullName
            .toLowerCase()
            .includes(this.searchPerson.toLowerCase())
      );
    } else {
      this.data = this.tempData;
    }
  }

  getPendingForTimeAllocation() {
    this.notice.getPendingForTimeAllocation().subscribe((res: any) => {
      this.pendingTimeAllocationList = this.tempPendingTimeAllocationList = res;
    });
  }

  filterTimeAllocationList() {
    if (this.searchTAParam) {
      this.pendingTimeAllocationList = this.tempPendingTimeAllocationList.filter(
        (element) =>
          element.title &&
          element.title
            .toLowerCase()
            .includes(this.searchTAParam.toLowerCase())
      );
    } else {
      this.pendingTimeAllocationList = this.tempPendingTimeAllocationList;
    }
  }

  forwardForTimeAllocation() {
    const body = {
      businessDates: this.selectedDates,
      forwardedDate: this.forwardedDate,
      id: null,
      numberOfDays: this.businessMapForTA ? this.businessMapForTA[this.forwardNoticeData.workflowCode].days : null,
      referenceId:  this.forwardNoticeData.noticeId,
      referenceNumber:  this.forwardNoticeData.noticeNumber,
      referenceTitle:  this.forwardNoticeData.title,
      referenceType: 'NOTICE',
      taTaken: false,
      typeCode: this.forwardNoticeData.workflowCode,
      assemblyId: this.forwardNoticeData.assemblyId,
      sessionId: this.forwardNoticeData.sessionId,
    };
    this.notice.forwardForTimeAllocation(body).subscribe((res: any) => {
      this.getPendingForTimeAllocation();
      this.cancelForwardModal();
      this.notify.showSuccess('Success', 'Notice Forwarded Successfully');
    });
  }

  showForwardModal(data) {
    this.forwardNoticeData = data;
    this.isForwardVisible = true;
    this.getBusinessMapForTA();
    this.getCOSDates(data.assemblyId,data.sessionId);
  }

  cancelForwardModal() {
    this.isForwardVisible = false;
    this.forwardedDate = new Date();
    this.selectedDates = [];
  }

  // getActiveAssemblySession() {
  //   this.notice.getActiveAssemblySession().subscribe((res: any) => {
  //     this.getCOSDates(res);
  //   });
  // }

  getCOSDates(assemblyId,sessionId) {
    if(assemblyId && sessionId){
    this.notice.getCOSDates(assemblyId,sessionId).subscribe((res: any) => {
      this.dateList = res;
      this.disabledCosDates = (current: Date): boolean => {
        const todayDate =
          current.getFullYear() +
          '-' +
          ('0' + (current.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + current.getDate()).slice(-2);
        return !this.dateList.find((item) => item === todayDate);
      }
    });
   }
  }

  getBusinessMapForTA() {
    this.notice.getBusinessMapForTA().subscribe((res: any) => {
      this.businessMapForTA = res;
    });
  }
}
