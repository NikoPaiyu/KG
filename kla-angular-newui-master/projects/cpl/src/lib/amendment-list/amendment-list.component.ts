import { Component, OnInit } from '@angular/core';
import { DocumentsService } from '../shared/services/documents.service';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Console } from 'console';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cpl-amendment-list',
  templateUrl: './amendment-list.component.html',
  styleUrls: ['./amendment-list.component.scss']
})
export class AmendmentListComponent implements OnInit {
  assemblyId = null;
  sessionId = null;
  laidDate = null;
  sroNumber = null;
  assemblyList: any = [];
  sessionList: any = [];
  searchText = null;
  sortName: string;
  sortValue: string;
  amendmentList: any = [];
  maxNumber = null;
  maxValue = null;
  sroNumbers: any = [];
  tempAmendmentList: any = [];
  mockData = [
    {
      key: '1',
      name: 'John Brown',
      date: 22,
      number: 45
    },
    {
      key: '2',
      name: 'Jim Green',
      date: 25,
      number: 78
    },
    {
      key: '3',
      name: 'Joe Black',
      date: 27,
      number: 67
    }
  ];
  constructor(private docService: DocumentsService, private router: Router, private route: ActivatedRoute,) { }

  ngOnInit() {
    forkJoin(
      this.docService.getAllAssembly(),
      this.docService.getAllSession()
    ).subscribe(([assembly, session]) => {
      this.assemblyList = assembly;
      const res = this.assemblyList.map(x => x.id);
      this.maxNumber = Math.max.apply(null, res);
      this.assemblyId = this.maxNumber;
      this.sessionList = session;
      const result = this.sessionList.map(x => x.id);
      this.maxValue = Math.max.apply(null, result);
      this.sessionId = this.maxValue;
    });
    this.getAssemblyList();
    this.getSessionList();
    this.getAmendmentList();
  }
  getAssemblyList() {
    this.docService.getAllAssembly().subscribe((Response) => {
      this.assemblyList = Response;
    });
  }

  getSessionList() {
    this.docService.getAllSession().subscribe((Response) => {
      this.sessionList = Response;
    });
  }
  resetFilter() {
    this.assemblyId = null;
    this.sessionId = null;
    // this.laidDate= null;
    this.sroNumber = null;
    this.amendmentList = this.tempAmendmentList;
  }
  sortDoc(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    const data = this.tempAmendmentList.filter((item) => item);
    if (this.sortName && this.sortValue) {
      this.amendmentList = data.sort((a, b) =>
        this.sortValue === "ascend"
          ? a[this.sortName].toLowerCase() > b[this.sortName].toLowerCase()
            ? 1
            : -1
          : b[this.sortName].toLowerCase() > a[this.sortName].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.amendmentList = data;
    }
  }
  getAmendmentList() {
    this.docService.getAmendmentList().subscribe((res) => {
      this.amendmentList = res;
      this.tempAmendmentList = res;
      this.sroNumbers = this.amendmentList.map(x => x.sroNumber);
    });
  }
  getListBySRO() {
    if (this.sroNumber) {
      this.amendmentList = this.tempAmendmentList.filter(
        (element) =>
          (element.sroNumber &&
            element.sroNumber
              .toLowerCase()
              .includes(this.sroNumber.toLowerCase()))
      );
    } else {
      this.amendmentList = this.tempAmendmentList;
    }
  }
  getAmendmentFilteredList() {
    if (this.searchText) {
      this.amendmentList = this.tempAmendmentList.filter(
        (element) =>
          (element.sroNumber &&
            element.sroNumber
              .toLowerCase()
              .includes(this.searchText.toLowerCase()))
        //   (element.count&&
        // element.count
        //   // .toLowerCase()
        //   .includes(this.searchText))
      );
    } else {
      this.amendmentList = this.tempAmendmentList;
    }
  }

  amendmentView(list) {
    this.router.navigate(["amendment-list-view", list.sroId],
    {relativeTo: this.route.parent});
  }
}
