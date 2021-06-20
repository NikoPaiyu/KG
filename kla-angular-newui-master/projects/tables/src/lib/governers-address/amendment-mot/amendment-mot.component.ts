import { Component, Inject, Input, OnInit } from '@angular/core';
import { NzModalRef, NzNotificationComponent, NzNotificationService, UploadFile } from "ng-zorro-antd";
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { GovernersAddressService } from '../../shared/services/governersaddress.service';
import { FileServiceService } from '../../shared/services/file-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tables-amendment-mot',
  templateUrl: './amendment-mot.component.html',
  styleUrls: ['./amendment-mot.component.css']
})
export class AmendmentMOTComponent implements OnInit {
  viewContent="";
  amendmentContent="";
  isViewAmendment=false;
  @Input() MOTId;
  isFileView=false;
  today: any = new Date();
  isCreateAmendment = false;
  isChecked = true;
  tablefiltrParams: any = { disable: {}, data: {} };
  isVisibleFilter = false;
  listOfData = [];
  listOfDisplayData = [];
  listOfAllData = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  mapOfCheckedId: { [key: string]: boolean } = {};
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  filterCheckboxes: any = [];
  filterSelected: object;
  statusParam: any;
  sortbyId = false;
  fileList: UploadFile[] = [];
  motList: any[];
  selMOT = "";
  amendment='';
  processionId = '';
  user;
  amendmentForm:FormGroup;
  constructor(
    private governerAddrss: GovernersAddressService,
    private file: FileServiceService,
    private router:Router,
    private route:ActivatedRoute,
    private notification:NzNotificationService,
    @Inject('authService') public auth,
    private fb:FormBuilder
  ) {
    this.user = auth.getCurrentUser();
    this._setFilterValue();
  }
  ngOnInit() {
    this.loadRBSPermissions();
    this.formvalidation();
    this.isFileView= this.MOTId ? true:false;
  if(this.MOTId){
   this.getAmendmentsbyMOTId(this.MOTId);
  }else{
  this.getAmendmentList();
  }
    this.getMOTList();
  }
  loadRBSPermissions() {
  }
  formvalidation() {
    this.amendmentForm = this.fb.group({
      Id: [null],
      amendment: [null, [Validators.required]],
      Mot: [null, [Validators.required]],
      subject: [null, [Validators.required]]
    });
  }
  getAmendmentList() {
    this.governerAddrss.getAllAmendmentbyUserId(this.user.userId).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      console.log(this.listOfAllData);
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  sortbyAssemblyAndSessionId(res) {
    this.listOfDisplayData = this.listOfAllData;
    this._applyFilterForAssembly(this.listOfDisplayData);
    this.onSearchUser();
    this.sortbyId = true;
  }
  getMOTList() {
    this.governerAddrss.getApprovedMOT().subscribe((res: any) => {
      this.motList = res;
      console.log(this.motList);
    });
  }
  currentPageDataChange($event): void {
    this.listOfDisplayData = $event;
  }
  _applyFilterForAssembly(res) {
    if (this.filterSelected) {
      this.searchCol(this.filterSelected);
    } else {
      if (this.sortbyId) {
        this.listOfData;
      } else {
        this.listOfData = res;
      }
    }
    this.sortbyId = false;
  }
  _chooseFilter(box) {
    box.checked = !box.checked;
  }
  _showFilter(): void {
    this.isVisibleFilter = false;
    const tablefilter = this.tablefiltrParams.disable;
    tablefilter.fileSubjectdisable = this.filterCheckboxes.find(
      (element) =>
        element.label === "Notice Number"
    ).checked;
    tablefilter.processionUrldisable = this.filterCheckboxes.find(
      (element) => element.label === "Assembly"
    ).checked;
    tablefilter.statusdisable = this.filterCheckboxes.find(
      (element) => element.label === "Session"
    ).checked;
    this._loadSelectedfilterData();
  }
  _hideFilter(): void {
    this.isVisibleFilter = false;
    if (this.isVisibleFilter == false) {
      this.clearFilter();
    }
  }
  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }
  search(): void {
    const filterFunc = (item: { name: string; age: number; address: string }) =>
      (this.searchAddress
        ? item.address.indexOf(this.searchAddress) !== -1
        : true) &&
      (this.listOfSearchName.length
        ? this.listOfSearchName.some((name) => item.name.indexOf(name) !== -1)
        : true);
    const data = this.listOfData.filter((item) => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.listOfData = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.listOfData = data;
    }
  }
  DoNothing() {
    return false;
  }
  clearFilter() {
    this.searchParam = "";
    localStorage.clear();
    this._setFilterValue();
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  onSearchUser() {
    this.searchCol(this.filterSelected);
    this.inputSearch();
  }
  inputSearch() {
    if (this.searchParam) {
      this.listOfData = this.listOfData.filter(
        (element) =>
          (element.motionOfThanks.noticeNumber &&
            element.motionOfThanks.noticeNumber
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.assemblyValue.toString() &&
            element.assemblyValue.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) 
        );
    }
  }
  disableFilter(fliterNum) {
    const tablefilter = this.tablefiltrParams.disable;
    switch (fliterNum) {
      case 1:
        tablefilter.fileSubjectdisable = false;
        this.filterSelected["NoticeNumber"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Notice Number") {
            element.checked = false;
          }
        });
      case 2:
        tablefilter.processionUrldisable = false;
        this.filterSelected["Assembly"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label === "Assembly") {
            element.checked = false;
          }
        });
        break;
      case 3:
        tablefilter.statusdisable = false;
        this.filterSelected["Session"] = null;
        this.filterCheckboxes.forEach((element) => {
          if (element.label == "Session") {
            element.checked = false;
          }
        });
        break;
      default:
        break;
    }
    this.searchCol(this.filterSelected);
    this._loadSelectedfilterData();
  }
  _loadSelectedfilterData() {
    const tablefilter = this.tablefiltrParams.disable;
    const tablefiltrData = this.tablefiltrParams.data;
    const self = this;
    let counter1 = 0;
    let counter2 = 0;
    let counter3 = 0;
    tablefilter.fileSubjectdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter1++;
        tablefiltrData.NoticeNumber.push(self.listOfAllData[key].motionOfThanks.noticeNumber);
        if (counter1 == self.listOfAllData.length) {
          tablefiltrData.NoticeNumber = tablefiltrData.NoticeNumber.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.processionUrldisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter2++;
        tablefiltrData.Assembly.push(self.listOfAllData[key].assemblyValue);
        if (counter2 == self.listOfAllData.length) {
          tablefiltrData.Assembly = tablefiltrData.Assembly.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
    tablefilter.statusdisable
      ? Object.keys(self.listOfAllData).forEach(function (key) {
        counter3++;
        tablefiltrData.Session.push(self.listOfAllData[key].sessionValue);
        if (counter3 == self.listOfAllData.length) {
          tablefiltrData.Session = tablefiltrData.Session.filter(
            (v, i, a) => a.indexOf(v) === i
          );
        }
      })
      : "";
  }
  searchCol(filter: any) {
    if (!filter) {
      this.listOfData = this.listOfAllData;
    } else {
      this.listOfData = this.listOfAllData.filter((item: any) =>
        this.applyFilter(item, filter)
      );
    }
    this.inputSearch();
  }
  applyFilter(element: any, filter: any): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === "string") {
          if (
            !element[field] ||
            element[field]
              .toLowerCase()
              .indexOf(filter[field].toLowerCase()) === -1
          ) {
            return false;
          }
        } else if (typeof filter[field] === "number") {
          if (element[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
  showModal(): void {
    this.isVisibleFilter = true;
  }
  _setFilterValue() {
    this.tablefiltrParams.disable = {
      fileSubjectdisable: false,
      processionUrldisable: false,
      statusdisable: false
    };
    this.tablefiltrParams.data = {
      NoticeNumber: [],
      Assembly: [],
      Session: []
    };
    this.filterCheckboxes = [
      { label: "Notice Number", checked: false },
      { label: "Assembly", checked: false },
      { label: "Session", checked: false },
    ];
    this.filterSelected = {
      NoticeNumber: null,
      Assembly: null,
      Session: null
    };
  }
  viewGovernessAddress(data) {
    // if (data.status !== 'SUBMITTED') {
    //   this.showProcessionpopup(data);
    // }
  }
  showAmendmentpopup() {
    this.isCreateAmendment= true;
    // if (data) {
    //   this.processionId = data.id;
    //   this.fileList = [
    //     {
    //       uid: "-1",
    //       size: 0,
    //       type: "pdf",
    //       name: "document",
    //       status: "done",
    //       url: data.processionUrl
    //     }
    //   ];
    //   this.selGovaddress = data.governorsAddressId ? data.governorsAddressId : "";
    // }
  }

  getSelectedMOT(){
 let selectedMOT=this.motList.find(el=>el.id=== this.amendmentForm.value.Mot);
return selectedMOT;
  }
  getNoticeContent(id) {
    if(id){
    let selectedMOT=this.motList.find(el=>el.id=== this.amendmentForm.value.Mot);
    this.file.getNoticeTemplateData(selectedMOT.noticeId, this.user.userId).subscribe(res => {
      this.viewContent = res.notice.noticeData;
      console.log(this.viewContent); 
    });
  }else{
    this.viewContent="";
  }
  }

  saveAmendment() {
    // let fileReq = {
    //   file: this.fileList,
    //   assemblyId: 1,
    //   sessionId: 4,
    //   business: 'TABLE_PROCESSION'
    // }
    // // this.governerAddrss.uploadFile(fileReq).subscribe((processionFile: any) => {
    let reqParam = {
      id:(this.amendmentForm.value.Id) ? this.amendmentForm.value.Id: null,
      amendmentText:this.amendmentForm.value.amendment,
      motionOfThanks:this.getSelectedMOT(),
      submittedBy:this.user.userId,
      subject:this.amendmentForm.value.subject
    }
    console.log(reqParam);
    for(const key in this.amendmentForm.controls){
      this.amendmentForm.controls[key].updateValueAndValidity();
      this.amendmentForm.controls[key].markAsDirty();
    }
    if(this.amendmentForm.valid){
    this.governerAddrss.createAmendmentForMOT(reqParam).subscribe((Res: any) => {
       this.isCreateAmendment= false;
       this.notification.create('success', 'Success', 'Amendment Created Successfully!');
       this.amendmentForm.reset();
      //  this.router.navigate(['business-dashboard/tables/file-view/',Res.motionOfThanks.fileId]);
      this.getAmendmentList();
      });
    }
  }
  // findFileId() {
    // const selected = this.GvAddrssList.find(element => element.id === this.selGovaddress);
    // return selected.fileId
  // }
  // submitProcession(procession) {
  //   debugger;
  //   let reqParam = this._buildReqForProcession(procession);
  //   this.file.attachToFile(reqParam).subscribe((res: any) => {
  //     this.getProcessionList();
  //   });
  // }
  // _buildReqForProcession(procession) {
  //   return ({
  //     processionId: procession.id,
  //     governorsAddressId: procession.governorsAddressId,
  //     fileForm: {
  //       fileId: this.findFileId(),
  //       activeSubTypes: [
  //         "TABLE_PROCESSION"
  //       ],
  //       type: "TABLE",
  //       userId: this.auth.getCurrentUser().userId
  //     }
  //   });
  // }
  // disabledDate = (current: Date): boolean => {
  //   return differenceInCalendarDays(current, this.today) < 0;
  // }
  cancel() {
    this.isCreateAmendment = false;
  }
  // beforeUpload = (file: UploadFile): boolean => {
  //   this.fileList = [];
  //   this.fileList = this.fileList.concat(file);
  //   return false;
  // };

  // handleRemoveFIle = (file: UploadFile) => {
  //   return true;
  // };
  _showFileName(processionUrl) {
    return processionUrl.split('file/')[1]
  }
  getAmendmentsbyMOTId(Id){
    this.governerAddrss.getAllAmendmentByMotId(Id).subscribe((res: any) => {
      this.listOfDisplayData = this.listOfAllData = res;
      console.log(this.listOfAllData);
      this.sortbyAssemblyAndSessionId(res);
    });
  }
  viewAmendment(text) {
    if(text){
  this.amendmentContent=text; 
  this.isViewAmendment=true;
    }
  }
  handleCancel(){
    this.isViewAmendment=false;
  }
}
