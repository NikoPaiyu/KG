import { Component, Inject, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CommitteeService } from '../../shared/services/committee.service';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'committee-business-listing',
  templateUrl: './business-listing.component.html',
  styleUrls: ['./business-listing.component.scss']
})
export class BusinessListingComponent implements OnInit {
  filtrParams: any = {};
  tempBusinessList: any;
  businessList: any;
  tempFilteredBusiness: any;
  filteredBusiness: any;
  searchParam: any;
  colCheckboxes = [
    { id: 1, label: 'Reference Number', check: true, disable: false },
    { id: 2, label: 'Reference Title', check: true, disable: false },
    { id: 3, label: 'Reference Type', check: true, disable: false },
    { id: 4, label: 'Parent Committee', check: true, disable: false },
    { id: 5, label: 'Language', check: true, disable: false },
    { id: 6, label: 'Joint Meeting', check: true, disable: false },
    { id: 7, label: 'Status', check: true, disable: false }
  ];
  checkbxParams: any = { numberOfChecked: 0 };
  mapOfCheckedId: { [key: string]: boolean } = {};
  tableParams: any = {
                      colSpan: false,
                      tableDto: []
                     };
  assignAssistant = {
    visible: false,
    businessIds: [],
    searchPerson: null,
    assigneeId: null,
    assistantList: [],
    listofAssistants: []
  };
  user: any;
  permissions = {
    assignToAssistant: false
  };
  businessStatus = [];

  constructor(private notification: NzNotificationService,
              private committeeService: CommitteeService,
              @Inject('authService') private AuthService,
              private router: Router,
              public common: CommitteecommonService) {
                this.user = AuthService.getCurrentUser();
                this.common.setCommitteePermissions(this.user.rbsPermissions);
                this._setFilter();
               }

  ngOnInit() {
    this.loadPermissions();
  }

  getBusinessForAction() {
    this.businessList = this.tempBusinessList = [];
    this.clearFilter();
    this.searchParam = null;
    this.tableParams.colSpan = null;
    this.mapOfCheckedId = {};
    const body = {
      agendaIds: [
      ],
      committeeIds: [
      ],
      status: this.businessStatus
    };
    this.committeeService.getAllBusiness(body).subscribe((res: any) => {
      this.businessList = res;
      this.tempBusinessList = this.businessList;
    });
  }

  showFilter(type) {
    this.filtrParams.rowFilter = type === 'row' ? true : false;
  }

  clearFilter() {
    this._setFilter();
    this.searchCol();
    this._loadSelectedfilterData();
  }

  _setFilter() {
    this.filtrParams.tableDto = [];
    const tableDataMdl = [
      { label: 'Reference Number', key: 'refrenceNumber' },
      { label: 'Reference Title', key: 'refernceTitle' },
      { label: 'Reference Type', key: 'refrenceType' },
      { label: 'Parent Committee', key: 'parentCommitteeId' },
      { label: 'Status', key: 'status' },
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
  }

  searchCol() {
    if (!this.filtrParams.tableDto) {
      this.businessList = this.tempBusinessList;
    } else {
      this.businessList = this.tempBusinessList.filter((item: any) =>
        this.applyFilter(item, this.filtrParams.tableDto)
      );
      this.filteredBusiness = this.businessList;
      this.tempFilteredBusiness = this.businessList;
    }
  }

  applyFilter(element: any, filter: any) {
    for (const field in filter) {
      if (filter[field].selValue) {
        if (typeof filter[field].selValue === 'string') {
          if (
            !element[filter[field].key] ||
            element[filter[field].key].toLowerCase() !==
            filter[field].selValue.toLowerCase()
          ) {
            return false;
          }
        } else if (typeof filter[field].selValue === 'number') {
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

  _loadSelectedfilterData() {
    let count = 0;
    this.filtrParams.tableDto.forEach((element) => {
      count++;
      if (element.filtersel) {
        switch (element.key) {
          case 'refrenceNumber':
            this.tempBusinessList.forEach((value) => {
              element.data.push(value.refrenceNumber);
            });
            break;
          case 'refernceTitle':
            this.tempBusinessList.forEach((value) => {
              element.data.push(value.refernceTitle);
            });
            break;
          case 'refrenceType':
              this.tempBusinessList.forEach((value) => {
                element.data.push(value.refrenceType);
              });
              break;
          case 'parentCommitteeId':
              this.tempBusinessList.forEach((value) => {
                element.data.push(value.parentCommitteeId);
              });
              break;
          case 'status':
            this.tempBusinessList.forEach((value) => {
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

  searchBusiness() {
    const checkArray: any = [];
    for (const check of this.filtrParams.tableDto) {
      checkArray.push(check.checked);
    }
    if (!checkArray.includes(true)) {
      this.filteredBusiness = this.tempBusinessList;
      this.tempFilteredBusiness = this.tempBusinessList;
    }
    if (this.searchParam) {
      this.businessList = this.filteredBusiness.filter(
        (element) =>
          (element.refrenceNumber &&
            element.refrenceNumber.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.refernceTitle &&
            element.refernceTitle
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.refrenceType  &&
            element.refrenceType.toString()
                  .includes(this.searchParam.toLowerCase())) ||
          (element.parentCommitteeId &&
            element.parentCommitteeId.toString()
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.status &&
            element.status
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    } else {
      this.businessList = this.tempFilteredBusiness;
    }
  }


  disableCheckBox() {
    let count = 0;
    for (const box of this.colCheckboxes) {
      if (box.check) {
        count++;
      }
    }

    if (count === 8) {
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

  get checkedFilters() {
    return this.filtrParams.tableDto.filter(ele => ele.filtersel);
  }

  disableFilter(filter) {
    filter.filtersel = false;
    filter.checked = false;
    filter.data = [];
    filter.selValue = null;
    this.searchCol();
    this._loadSelectedfilterData();
  }

  _checkAllRows(value: boolean): void {
    this.tempBusinessList.forEach((item) => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus(null);
  }

  refreshStatus(list): void {
    this.checkbxParams.numberOfChecked = this.tempBusinessList.filter(
      (item) => this.mapOfCheckedId[item.id]
    ).length;
    this.checkbxParams.allDtCheckd = this.tempBusinessList.every(
      (item) => this.mapOfCheckedId[item.id]
    );
    this.tableParams.colSpan =
      this.checkbxParams.numberOfChecked > 0 ? true : false;
    if (this.tableParams.colSpan) {
      this.businessList.forEach((element) => {
        element.viewLinks = false;
      });
    }
  }

  sort(sort: { key: string; value: string }): void {
    const data = this.tempBusinessList.filter((item) => item);
    if (sort.key && sort.value) {
      this.businessList = data.sort((a, b) =>
        sort.value === 'ascend'
        ? (typeof a[sort.key!] === 'number'
        ? a[sort.key!]
        : a[sort.key!].toLowerCase()) >
      (typeof b[sort.key!] === 'number'
        ? b[sort.key!]
        : b[sort.key!].toLowerCase())
      ? 1
      : -1
    : (typeof b[sort.key!] === 'number'
        ? b[sort.key!]
        : b[sort.key!].toLowerCase()) >
      (typeof a[sort.key!] === 'number'
        ? a[sort.key!]
        : a[sort.key!].toLowerCase())
    ? 1
    : -1
      );
    } else {
      this.businessList = data;
    }
  }

  assignToAssistant() {
    this.assignAssistant.visible = true;
  }

  showLinks(id, status) {
    if (this.tableParams.colSpan) {
      return;
    }
    this.businessList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = true;
      } else {
        element.viewLinks = false;
      }
    });
  }

  hideLinks(id) {
    this.businessList.forEach((element) => {
      if (element.id === id) {
        element.viewLinks = false;
      }
    });
  }

  _chooseFilter(box) {
    box.checked = !box.checked;
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

  getAssistantList() {
    const body = {
      klaDesignatoinId: 10,
      klaSectionId: this.user.correspondenceCode.id
    };
    this.committeeService.getAssisstantList(body).subscribe((Res: any) => {
    this.assignAssistant.assistantList = Res;
    this.assignAssistant.listofAssistants = this.assignAssistant.assistantList;
    });
  }

  getAssisstantCode() {
    if (this.user.correspondenceCode.code === 'SUBJECT_COMMITTEE_A_SECTION') {
      return 'SUBJECT_COMMITTEE_A_ASSISTANT';
    } else if (this.user.correspondenceCode.code === 'SUBJECT_COMMITTEE_B_SECTION') {
      return 'SUBJECT_COMMITTEE_B_ASSISTANT';
    } else {
      return null;
    }
  }

  personSearch() {
    if (this.assignAssistant.searchPerson) {
      this.assignAssistant.assistantList = this.assignAssistant.listofAssistants.filter(
        (element) =>
          element.fullName &&
          element.fullName
            .toLowerCase()
            .includes(this.assignAssistant.searchPerson.toLowerCase())
      );
    } else {
      this.assignAssistant.assistantList = this.assignAssistant.listofAssistants;
    }
  }

  onCancelAssistant() {
    this.assignAssistant.visible = false;
  }

  onSubmitAssistant() {
    let checkedArray = [];
    checkedArray = this.tempBusinessList.filter(
      (item) => this.mapOfCheckedId[item.id]
    );
    checkedArray.forEach(element => {
      if (element.id) {
        this.assignAssistant.businessIds.push(element.id);
      }
    });
    const body = this.assignAssistant.businessIds;
    this.committeeService.assignToAssistant(body, this.assignAssistant.assigneeId).subscribe((res: any) => {
      this.notification.create('success', 'Success', '');
      this.assignAssistant.visible = false;
      this.assignAssistant.businessIds = [];
      this.assignAssistant.assigneeId = null;
      this.getBusinessForAction();
    });
  }

  loadPermissions() {
    if (this.common.doIHaveAnAccess('ASSIGN_BUSINESS_TO_ASSISSTANT', 'READ')) {
      this.permissions.assignToAssistant = true;
      this.businessStatus = ['PENDING'];
      this.getAssistantList();
    }
    this.getBusinessForAction();
  }
  view(billId){
    console.log('clicked')
    this.router.navigate(["business-dashboard/bill/bill-view", billId])
  }

}
