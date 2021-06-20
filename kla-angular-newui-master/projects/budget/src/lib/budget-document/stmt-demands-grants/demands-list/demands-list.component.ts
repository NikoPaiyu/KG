import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';
@Component({
  selector: 'budget-demands-list',
  templateUrl: './demands-list.component.html',
  styleUrls: ['./demands-list.component.scss']
})
export class DemandsListComponent implements OnInit {

  isVisibleFilter = false;
  listOfData = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchParam = '';
  searchAddress: string;
  listOfSearchName: string[] = [];
  isReordered = false;
  constructor(
    private sdfg: StmtDemandsGrantsService,
  ) {
  }
  ngOnInit() {
    this.getDemandsList();
  }
  getDemandsList() {
    this.sdfg.getAllDemands().subscribe((res: any) => {
      this.listOfData = res;
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
  onSearchUser() {
    this.inputSearch();
  }
  inputSearch() {
    if (this.searchParam) {
      this.listOfData = this.listOfData.filter(
        (element) =>
          (element.demandNameMal &&
            element.demandNameMal
              .toLowerCase()
              .includes(this.searchParam.toLowerCase())) ||
          (element.demandNameEng &&
            element.demandNameEng
              .toLowerCase()
              .includes(this.searchParam.toLowerCase()))
      );
    }
  }
  listSorted(orderedDemands) {
    this.isReordered = true;
    // for (let i = 0; i < orderedClause.length; i++) {
    //   this.validateForm.controls.clauses.value[i] = orderedClause[i].value;
    // }
  }
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listOfData, event.previousIndex, event.currentIndex);
  }
}
