import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BudgetCommonService } from '../../../shared/services/budgetcommon.service';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
import { SdgEgService } from '../../../shared/services/sdg-eg.service';

@Component({
  selector: 'budget-sdfg-voa-creation',
  templateUrl: './sdfg-voa-creation.component.html',
  styleUrls: ['./sdfg-voa-creation.component.scss']
})
export class SdfgOrVOACreationComponent implements OnInit {
  SDFGVOAData = {id: null, title: '', type: 'SDFG' };
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
    private sdgeg:SdgEgService
  ) {
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }
  ngOnInit() {
    if (this.urlParams && this.urlParams.id) {
      this.SDFGVOAData.id = this.urlParams.id;
    }
    if (this.urlParams && this.urlParams.type) {
      this.SDFGVOAData.type = this.urlParams.type;
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
        });
      });
    });
  }
  getDemandsList() {
    this.sdfg.getAllDemands().subscribe((demands: any) => {
      this.demandsList = demands;
      if (this.SDFGVOAData.id) {
        this.getSavedSDFG();
        return;
      }
      this.initializeSDFG();
    });
  }
  getSavedSDFG() {
    if(this.urlParams.type == 'SDG' || this.urlParams.type == 'EG' ){
      this.sdgeg.getSDGEGById(this.SDFGVOAData.id).subscribe((res: any) => {
        this.sdfgListById = res.lines;
        this.SDFGVOAData.title = res.title;
        this.SDFGVOAData.type = res.type;
        this.initializeSDFG();
      });
    }else{
    this.sdfg.getSDFGByLinesId(this.SDFGVOAData.id).subscribe((res: any) => {
      this.sdfgListById = res.lines;
      this.SDFGVOAData.title = res.title;
      this.SDFGVOAData.type = res.type;
      this.initializeSDFG();
    });
   } 
  }
  initializeSDFG() {
    let sdfgdto;
    this.SDFGVOAData['sdfgLines'] = [];
    this.demandsList.forEach(element => {
      if (this.SDFGVOAData.id) {
        sdfgdto = this.sdfgListById.find(
          (item) => item.demandId === element.id
        );
      }
      this.SDFGVOAData['sdfgLines'].push(
        {
          "capital": (sdfgdto && sdfgdto.capital) ? sdfgdto.capital : null,
          "demandId": (sdfgdto && sdfgdto.demandId) ? sdfgdto.demandId : element.id,
          "demandNameEng": (sdfgdto && sdfgdto.demandNameEng) ? sdfgdto.demandNameEng : element.demandNameEng,
          "demandNameMal": (sdfgdto && sdfgdto.demandNameMal) ? sdfgdto.demandNameMal : element.demandNameMal,
          "demandNumber": (sdfgdto && sdfgdto.demandNumber) ? sdfgdto.demandNumber : element.demandNumber,
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
    const data = this.SDFGVOAData['sdfgLines'].filter((item) => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.SDFGVOAData['sdfgLines'] = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.SDFGVOAData['sdfgLines'] = data;
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
      this.SDFGVOAData['sdfgLines'] = this.SDFGVOAData['sdfgLines'].filter(
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
    this.sdfg.saveSDFG(line).subscribe((res: any) => {
      this.notify.success('Success', this.SDFGVOAData.type + ' saved successfully');
    });
  }
  deleteSDFGLine(demandId) {
    this.sdfg.DeleteDemands(demandId).subscribe((res: any) => {
      this.notify.success('Success', this.SDFGVOAData.type + ' Deleted successfully');
    });
  }
  saveSDFG() {
    if (this.validateSDFG(false)) {
      this._unLinkProperties();
      if(this.urlParams.type == 'SDG' || this.urlParams.type == 'EG' ){
        this.sdgeg.saveSDGEG(this.SDFGVOAData).subscribe((res: any) => {
          this.notify.success('Success', this.SDFGVOAData.type + ' Saved successfully');
          this.router.navigate(['business-dashboard/budgets/sdgeg/list']);
        });
      }else{
      this.sdfg.saveAllSDFG(this.SDFGVOAData).subscribe((res: any) => {
        this.notify.success('Success', this.SDFGVOAData.type + ' saved successfully');
        this.goBack();
      });
    }
    }
  }
  _unLinkProperties() {
    this.SDFGVOAData['sdfgLines'].forEach(e => { delete e.canEdit });
    this.SDFGVOAData['sdfgLines'] = this.SDFGVOAData['sdfgLines'].filter(
      (item) => item.revenue || item.capital || item.total);
  }
  submitSDFG() {
    if (this.validateSDFG(true)) {
      this._unLinkProperties();
      if(this.urlParams.type == 'SDG' || this.urlParams.type == 'EG' ){
        this.sdgeg.submitSDGEG(this.SDFGVOAData).subscribe((res: any) => {
          this.notify.success('Success', this.SDFGVOAData.type + ' submitted successfully');
          this.router.navigate(['business-dashboard/budgets/sdgeg/list']);
        });
      }else{
      this.sdfg.submitSDFG(this.SDFGVOAData).subscribe((res: any) => {
        this.notify.success('Success', this.SDFGVOAData.type + ' submitted successfully');
        this.goBack();
      });
    }
   }
  }
  validateSDFG(isSubmit) {
    let counter = 0;
    let status = true;
    if (!this.SDFGVOAData.title) {
      this.notify.warning("Warning", "Please enter " + this.SDFGVOAData.type + " title....");
      status = false;
    }
    let selectedSDFG = this.SDFGVOAData['sdfgLines'].filter((item) => item.revenue || item.capital);
    if (selectedSDFG.length === 0) {
      this.notify.warning("Warning", "Please give Atleast One Head....");
      status = false;
    }
    if (isSubmit) {
      selectedSDFG.forEach(sdfg => {
        counter++;
        if (!sdfg.revenue || !sdfg.capital) {
          this.notify.warning("Warning", "Please fill all the required fields...");
          status = false;
        }
      });
    }
    return status;
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
    moveItemInArray(this.SDFGVOAData['sdfgLines'], event.previousIndex, event.currentIndex);
  }
  isDisable() {
    if (typeof this.urlParams === 'undefined') {
      return false
    } else if (this.urlParams) {
      if(!this.getstatusARR().includes(this.urlParams.status)) {
        return false
      }
    }
    return true
  }
  getstatusARR() {
    return ['SUBMITTED', 'APPROVED', 'PUBLISHED']
  }
  removeUnderScore(element) {
    return element.replace(/_/g, " ");
  }
}
