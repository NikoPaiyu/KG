import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { forkJoin } from 'rxjs';
import { CommitteeService } from '../../shared/services/committee.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';

@Component({
  selector: 'committee-bill-claiming',
  templateUrl: './bill-claiming.component.html',
  styleUrls: ['./bill-claiming.component.css']
})
export class BillClaimingComponent implements OnInit {
  billList: any = [];
  allbillList: any = [];
  filtrParams: any = {};
  checkbxParams: any = { numberOfChecked: 0 };
  tableParams: any = { colSpan: false };
  searchParam = "";
  mapOfCheckedId: { [key: string]: boolean } = {};
  colCheckboxes = [
    { id: 1, label: "Bill Number", check: true, disable: false },
    { id: 2, label: "Title Of Bill", check: true, disable: false },
    { id: 3, label: "Type Of Bill", check: true, disable: false },
    { id: 4, label: "Nature of Bill", check: true, disable: false },
    { id: 5, label: "Language", check: true, disable: false },
    { id: 6, label: "Hon'ble Minister", check: true, disable: false },
    { id: 7, label: "Department", check: true, disable: false },
    { id: 8, label: "Status", check: true, disable: false },
    { id: 9, label: "Act Reference", check: false, disable: true },
    { id: 10, label: "Old Act Reference", check: false, disable: true },
    { id: 11, label: "Ordinance", check: false, disable: true },
    { id: 12, label: "Governers Recommondation", check: false, disable: true },
    { id: 13, label: "Article No", check: false, disable: true },
    { id: 14, label: "subject", check: true, disable: false },
  ];
  billId;
  showClaimPopup = false;
  committeeForm: FormGroup;
  user: any;
  assemblySessionObj = {
    assembly: [],
    session: [],
    currentAssembly: "",
    currentSession: "",
    currentAssemblyLbl: "",
  };
  subjectData: any = [];
  tempSubjectData = [];
  mainCommiteeData : any = [];
  assistantList = [];
  checkedCommIds = new Set<any>();
  constructor(
    private commiteeService: CommitteeService,
    private notification: NzNotificationService,
    private commonService: CommitteecommonService,
    private fb: FormBuilder,

    @Inject("authService") private AuthService
  ) {
    this.user = AuthService.getCurrentUser();
    this.commonService.setCommitteePermissions(this.user.userId);
    this._setFilter();
  }
  ngOnInit() {
    this. getAssemblySession();
    this.committeeForm = this.fb.group({
      parentCommittee: [null, Validators.required],
      userId: [0]
    });
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: "Bill Number", key: "billNumber" },
      { label: "Title Of Bill", key: "title" },
      { label: "Type Of Bill", key: "type" },
      { label: "Nature of Bill", key: "natureOfBill" },
      { label: "Language", key: "language" },
      { label: "Hon'ble Minister", key: "minister" },
      { label: "Department", key: "department" },
      { label: "Status", key: "status" }, 
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
    this.filtrParams.rowFilter = false;
    this.filtrParams.showPriorityPopup = false;
  }
  showFilter(type) {
    this.filtrParams.rowFilter = type === "row" ? true : false;
  }
  _confrmFilter(): void {
    if (this.filtrParams.rowFilter) {
      this._filterRows();
    }
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
          case "title":
            this.allbillList.forEach((value) => {
              element.data.push(value.title);
            });
            break;
          case "billType":
            this.allbillList.forEach((value) => {
              element.data.push(value.billType);
            });
            break;
          case "date":
            this.allbillList.forEach((value) => {
              element.data.push(value.date);
            });
            break;
          case "numberOfErrata":
            this.allbillList.forEach((value) => {
              element.data.push(value.numberOfErrata);
            });
            break;
          case "status":
            this.allbillList.forEach((value) => {
              element.data.push(value.status);
            });
            break;
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
  searchonErrata() {
    this.billList = this.allbillList;
    if (this.searchParam) {
      this.billList = this.allbillList.filter(
        (element) =>
          (element.title &&
            element.title
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.billType &&
            element.billType
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.date &&
            element.date
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.numberOfErrata &&
            element.numberOfErrata ==
              this.searchParam) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.billList = this.allbillList;
    }
  }
  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.billList = this.allbillList;
    } else {
      this.billList = this.allbillList.filter((item: any) =>
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
        }
      }
    }
    return true;
  }
  _checkAllRows(value: boolean): void {
    this.allbillList.forEach((item) => (this.mapOfCheckedId[item.billId] = value));
    this.refreshStatus(null);
  }
  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.allbillList.filter(
      (item) => this.mapOfCheckedId[item.billId]
    ).length;
    this.checkbxParams.allDtCheckd = this.allbillList.every(
      (item) => this.mapOfCheckedId[item.billId]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.billList.forEach((element) => {
        element.viewLinks = false;
      });
    }
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
  sort(sort: { key: string; value: string }): void {
    const data = this.allbillList.filter((item) => item);
    if (sort.key && sort.value) {
      this.billList = data.sort((a, b) =>
        sort.value === "ascend"
          ? (a[sort.key!] && a[sort.key!].toLowerCase()) >
            (b[sort.key!] && b[sort.key!].toLowerCase())
            ? 1
            : -1
          : (b[sort.key!] && b[sort.key!].toLowerCase()) >
            (a[sort.key!] && a[sort.key!].toLowerCase())
          ? 1
          : -1
      );
    } else {
      this.billList = data;
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
  getAssemblySession() {
    forkJoin(
      this.commonService.getAllAssembly(),
      this.commonService.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblySessionObj.assembly = assembly as Array<any>;
      const res = this.assemblySessionObj.assembly.map((x) => x.id);
      this.assemblySessionObj.currentAssembly = Math.max.apply(null, res);
      const labels = this.assemblySessionObj.assembly.map((x) => x.assemblyId);
      this.assemblySessionObj.currentAssemblyLbl = Math.max.apply(null, labels);
      this.assemblySessionObj.session = session as Array<any>;
      const response = this.assemblySessionObj.session.map((x) => x.id);
      this.assemblySessionObj.currentSession = Math.max.apply(null, response);
      this.getbillList()
      this.getSubjectCommitteeList();
      this.getSubjectCommitteeBysection();
      this.getAssistantList();
    });
  }
  getbillList() {
    let body ={
      assemblyId:this.assemblySessionObj.currentAssembly,
      sessionId : this.assemblySessionObj.currentSession
    }    
    this.commonService.getUnclaimedBills(body).subscribe((arg: any) => {
      this.billList = this.allbillList = arg;
    });
    this.billList.forEach((element) => {
      element.viewLinks = false;
    });
  }
  showLinks(id) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.billList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      }
      else{
        element.viewLinks = false;
      }
    });
  }
  claimBill(list){
    this.showClaimPopup = true;
    this.billId = list.id;
  }
  cancelClaim(){
    this.showClaimPopup = false;
    this.billId = null;
  }
  subjectCommitteeOk() {
    // tslint:disable-next-line:forin
    for (const i in this.committeeForm.controls) {
        this.committeeForm.controls[i].markAsDirty();
        this.committeeForm.controls[i].updateValueAndValidity();
    }
    if (this.committeeForm.valid) {
      const body = {
        joinCommittees: [
          ...this.checkedCommIds
        ],
        parentCommitteeId: this.committeeForm.value.parentCommittee,
        forwardedDate: "",
        committeeCode: "SUBJECT_COMMITTEE",
        userId: this.committeeForm.value.userId
      };
      this.commonService.claimToCommittee(this.billId, body).subscribe((res: any) => {
        let notificationTxt = this.committeeForm.value.userId == 0 ? 'Bill Claimed Successfully' : 'Bill Claimed and Assigned to Assistant Successfully'
        this.notification.success('Success', notificationTxt);
        this.cancelClaim();
        this.getbillList()
      });
    }
  }
  getSubjectCommitteeList() {
    const body =  {
        assemblyId: this.assemblySessionObj.currentAssembly,
        categoryId: 1,
        isActive: true,
        status: 'APPROVED',
        subjectId: null
      };
    this.commonService.getSubjectCommitteeList(body).subscribe(Res => {
        this.subjectData = Res;
        this.tempSubjectData = this.subjectData;
      });
  }
  getSubjectCommitteeBysection() {
    this.commonService.getcommitteeListBySectionId(this.user.correspondenceCode.id).subscribe(Res => {
        this.mainCommiteeData = Res;
      });
  }
  onCommChecked(id: number, checked: boolean) {
    if (checked) {
      this.checkedCommIds.add(id);
    } else {
      this.checkedCommIds.delete(id);
    }
  }
  filtersubjectData() {
    if (this.committeeForm.value.parentCommittee) {
      this.subjectData = this.tempSubjectData.filter(x => x.id !== this.committeeForm.value.parentCommittee);
    }
  }
  getAssistantList() {
    const body = {
      klaDesignatoinId: 10,
      klaSectionId: this.user.correspondenceCode.id
    };
    this.commiteeService.getAssisstantList(body).subscribe((Res: any) => {
    this.assistantList = Res;
    });
  }
  changeAssistnat(event){
   if(event == null){
    this.committeeForm.patchValue({
      userId: 0
    });
   }
  }
}
