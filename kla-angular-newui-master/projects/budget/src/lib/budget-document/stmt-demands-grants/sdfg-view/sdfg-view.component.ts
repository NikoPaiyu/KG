import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BudgetCommonService } from '../../../shared/services/budgetcommon.service';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
@Component({
  selector: 'budget-sdfg-preview',
  templateUrl: './sdfg-view.component.html',
  styleUrls: ['./sdfg-view.component.scss']
})
export class SdfgViewComponent implements OnInit {
  SDFGData = { budgetDocumentId: null, id: null, sdfgLines: [] };
  sortName: string | null = null;
  sortValue: string | null = null;
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  assemblySession: object = [];
  urlParams: any;
  demandsList;
  sdfgListById;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private common: BudgetCommonService,
    private budgetDoc: BudgetDocumentService,
    private sdfg: StmtDemandsGrantsService,
    @Inject('authService') public auth,
  ) {
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }
  ngOnInit() {
    if (this.urlParams && this.urlParams.id) {
      this.SDFGData.id = this.urlParams.id;
    }
    this.getAssemblySession();
  }
  getAssemblySession() {
    this.common.getAllAssembly().subscribe((assembly) => {
      this.common.getAllSession().subscribe((session) => {
        this.common.getCurrentAssemblyAndSession().subscribe((active) => {
          if (Array.isArray(session) && Array.isArray(assembly)) {
            this.assemblySession["assembly"] = assembly;
            this.assemblySession["session"] = session;
            this.assemblySession["assembly"].currentassembly = active['assemblyId'];
            this.assemblySession["session"].currentsession = active['sessionId'];
            this.assemblySession["assembly"].currentassemblyVal = active['assemblyValue'];
            this.assemblySession["session"].currentsessionVal = active['sessionValue'];
          }
          this.getDemandsList();
          this.getAllApprovedBudgetDoc();
        });
      });
    });
  }
  getDemandsList() {
    this.sdfg.getAllDemands().subscribe((demands: any) => {
      this.demandsList = demands;
      if (this.SDFGData.id) {
        this.getSavedSDFG();
        return;
      }
      this.initializeSDFG();
    });
  }
  getAllApprovedBudgetDoc() {
    this.budgetDoc.getAllApprovedBudgetDoc().subscribe((res: any) => {
      this.SDFGData.budgetDocumentId = (res.length > 0) ? res[0].id : null;
    });
  }
  getSavedSDFG() {
    this.sdfg.getSDFGByLinesId(this.SDFGData.id).subscribe((res: any) => {
      this.sdfgListById = res;
      this.initializeSDFG();
    });
  }
  initializeSDFG() {
    let sdfgdto;
    this.demandsList.forEach(element => {
      if (this.SDFGData.id) {
        sdfgdto = this.sdfgListById.find(
          (item) => item.demandId === element.id
        );
      }
      this.SDFGData.sdfgLines.push(
        {
          "capital": (sdfgdto && sdfgdto.capital) ? sdfgdto.capital : null,
          "demandId": (sdfgdto && sdfgdto.demandId) ? sdfgdto.demandId : element.id,
          "demandNameEng": (sdfgdto && sdfgdto.demandNameEng) ? sdfgdto.demandNameEng : element.demandNameEng,
          "demandNameMal": (sdfgdto && sdfgdto.demandNameMal) ? sdfgdto.demandNameMal : element.demandNameMal,
          "id": (sdfgdto && sdfgdto.id) ? sdfgdto.id : null,
          "order": (sdfgdto && sdfgdto.order) ? sdfgdto.order : element.order,
          "revenue": (sdfgdto && sdfgdto.revenue) ? sdfgdto.revenue : null,
          "total": (sdfgdto && sdfgdto.total) ? sdfgdto.total : null,
          "canEdit": false
        })
    });
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
    const data = this.SDFGData.sdfgLines.filter((item) => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.SDFGData.sdfgLines = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.SDFGData.sdfgLines = data;
    }
  }
  DoNothing() {
    return false;
  }
  onSearchUser() {
    this.inputSearch();
  }
  inputSearch() {
    if (this.searchParam) {
      this.SDFGData.sdfgLines = this.SDFGData.sdfgLines.filter(
        (element) =>
        (element.demandNameEng &&
          element.demandNameEng
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()))
      );
    }
  }
  findAssembly(assemblyId) {
    if (this.assemblySession["assembly"])
      return this.assemblySession["assembly"].find(o => o.id === assemblyId).assemblyId;
  }
  findSession(sessionId) {
    if (this.assemblySession["session"])
      return this.assemblySession["session"].find(o => o.id === sessionId).sessionId;
  }
  listSorted(id) { }
  saveSDFGLine(line) {

  }
  saveSDFG() {
    if (this.validateSDFG()) {
      this._unLinkProperties();
      this.sdfg.saveAllSDFG(this.SDFGData).subscribe((res: any) => {
        this.notify.success('Success', 'SDFG saved successfully');
        this.goBack();
      });
    }
  }
  _unLinkProperties() {
    this.SDFGData.sdfgLines.forEach(e => { delete e.canEdit });
    this.SDFGData.sdfgLines = this.SDFGData.sdfgLines.filter(
      (item) => item.revenue || item.capital || item.total);
  }
  submitSDFG() {
    if (this.validateSDFG()) {
      this._unLinkProperties();
      this.sdfg.submitSDFG(this.SDFGData).subscribe((res: any) => {
        this.notify.success('Success', 'SDFG submitted successfully');
        this.goBack();
      });
    }
  }
  validateSDFG() {
    if (!this.SDFGData.budgetDocumentId) {
      this.notify.info("Info", "No Budget Document Found"); return false;
    }
    return true;
  }
  goBack() {
    this.router.navigate(['business-dashboard/budgets/sdfg/list']);
  }
  onKeyOfSDFG(item) {
    if (item.revenue && item.capital) {
      item.total = item.revenue + item.capital;
    } else if (item.revenue) {
      item.total = item.revenue;
    } else if (item.capital) {
      item.total = item.capital;
    } else {
      item.total = null;
    }
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.SDFGData.sdfgLines, event.previousIndex, event.currentIndex);
  }
  isDisable() {
    if (typeof this.urlParams === 'undefined') {
      return false
    } else if (this.urlParams && this.urlParams.status === 'SAVED') {
      return false
    }
    return true
  }
  removeUnderScore(element) {
    return element.replace(/_/g, " ");
  }
}
