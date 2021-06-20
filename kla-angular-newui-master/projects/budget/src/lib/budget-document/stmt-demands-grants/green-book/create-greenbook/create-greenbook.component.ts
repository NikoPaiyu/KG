import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetCommonService } from '../../../../shared/services/budgetcommon.service';
import { StmtDemandsGrantsService } from '../../../../shared/services/stmt-demands-grants.service';
import { GreenbkPreviewComponent } from '../greenbk-preview/greenbk-preview.component';

import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'budget-create-greenBook',
  templateUrl: './create-greenBook.component.html',
  styleUrls: ['./create-greenBook.component.scss']
})
export class CreateGreenBookComponent implements OnInit {
  @Input() id;
  @Input() isFrmFileView;
  grnBKData = {
    id: null, sdfgId: null, lines: [], submitDto: {
      id: null,
      lineDtos: [],
      sdfgId: null
    }
  };
  sortName: string | null = null;
  sortValue: string | null = null;
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  urlParams: any;
  minPortfolios;
  tempMinPortfolios;
  type;
  constructor(
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private common: BudgetCommonService,
    private sdfg: StmtDemandsGrantsService,
    @Inject('authService') public auth,
    private modalService: NzModalService,
    private router: Router
  ) {
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["mId"]) {
        this.grnBKData.sdfgId = params["mId"];
        this.getSDFGVOAById(null);
      }
      if (this.id) {
        this.grnBKData.id = this.id;
        this.getGreenBookById();
      }
    });
  }
  getGreenBookById() {
    this.sdfg.getGreenBookById(this.grnBKData.id).subscribe((res: any) => {
      this.grnBKData.sdfgId = res.sdfgId;
      this.getSDFGVOAById(res.linesDto);
    });
  }
  getSDFGVOAById(grnBKData) {
    this.sdfg.getSDFGByLinesId(this.grnBKData.sdfgId).subscribe((res: any) => {
      this.type = res.type;
      this.grnBKData.lines = res.lines;
      this.getAllWithMinisterName(grnBKData);
    });
  }
  getAllWithMinisterName(grnBKData) {
    this.common.getAllWithMinisterName().subscribe((res: any) => {
      this.minPortfolios = res;
      this.tempMinPortfolios = [...this.minPortfolios]
      if (this.grnBKData.id && grnBKData) {
        this.grnBKData.lines.forEach(element => {
          element.portfolioId = grnBKData.find((line) => line.demandId === element.demandId).portfolioId;
          element.portfolio = this.minPortfolios.find((line) => line.id === element.portfolioId).name;
          element.ministerName = this.minPortfolios.find((line) => line.id === element.portfolioId).ministerName;
        });
      }
    });
  }
  submit() {
    this._buildSubmitDto();
    this.sdfg.createGreenBook(this.grnBKData.submitDto).subscribe((res: any) => {
      let msg = 'green book submitted successfully';
      if(this.type === 'VOA') {
        msg = 'minister motion submitted successfully';
      }
      this.notify.success('Success', msg);
      this.router.navigate(['business-dashboard/budgets/files/bd-files']);
    });
  }
  update() {
    this._buildSubmitDto();
    this.sdfg.updateGreenBook(this.grnBKData.submitDto).subscribe((res: any) => {
      let msg = 'green book submitted successfully';
      if(this.type === 'VOA') {
        msg = 'minister motion submitted successfully';
      }
      this.notify.success('Success', msg);
      this.getGreenBookById();
    });
  }
  _buildSubmitDto() {
    this.grnBKData.lines.forEach(e => {
      let linesDtoObj =
      {
        demandId: null,
        id: null,
        portfolioId: null,
        revenue: "",
        sdfgId: null
      }
      this.grnBKData.submitDto.id = (this.grnBKData.id) ? this.grnBKData.id : null;
      this.grnBKData.submitDto.sdfgId = this.grnBKData.sdfgId;
      linesDtoObj.demandId = e.demandId;
      linesDtoObj.portfolioId = e.portfolioId;
      linesDtoObj.revenue = e.total;
      linesDtoObj.id = e.id ? e.id : null;
      this.grnBKData.submitDto.lineDtos.push(linesDtoObj);
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
    const data = this.grnBKData['lines'].filter((item) => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.grnBKData['lines'] = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
            ? 1
            : -1
      );
    } else {
      this.grnBKData['lines'] = data;
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
      this.grnBKData['lines'] = this.grnBKData['lines'].filter(
        (element) =>
        (element.demandNameEng &&
          element.demandNameEng
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.demandNumber &&
          element.demandNumber
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()) ||
          element.total &&
          element.total
            .toLowerCase()
            .includes(this.searchParam.toLowerCase()))
      );
    }
  }
  showPreview() {
    this.modalService.create({
      nzContent: GreenbkPreviewComponent,
      nzWidth: "600",
      nzFooter: null,
      nzTitle: 'Green Book',
      nzClosable: true,
      nzComponentParams: {
        grnBKData: this.grnBKData.lines
      },
    });
  }
  onChangeHead() {}
  // onChangeHead() {
  //   let selMinisterList = [];
  //   if (this.grnBKData.lines && this.grnBKData.lines.length > 0) {
  //     this.minPortfolios.forEach(minPortfolio => {
  //       this.grnBKData.lines.forEach(lines => {
  //         if (minPortfolio.id === lines.portfolioId) {
  //           selMinisterList.push(minPortfolio);
  //         }
  //       });
  //     });
  //     this.minPortfolios = this.filterDemands(this.tempMinPortfolios, selMinisterList);
  //   }
  // }
  // filterDemands = (List1, List2) => {
  //   return List1.filter(Item1 =>
  //     !List2.some(
  //       Item2 => Item1.id === Item2.id
  //     )
  //   );
  // };
}

