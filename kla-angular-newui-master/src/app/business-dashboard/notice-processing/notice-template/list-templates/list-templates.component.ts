import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NoticeTemplateService } from '../../shared/services/notice-template.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-templates',
  templateUrl: './list-templates.component.html',
  styleUrls: ['./list-templates.component.scss']
})
export class ListTemplatesComponent implements OnInit {
  // noticeTemplate: FormGroup = this.fb.group({
  //   searchText: ['', Validators.required]
  // });
  templateList: any = [];
  filteredTemplateList: any = [];
  sortName: string | null = null;
  sortValue: string | null = null;
  searchNotice = '';
  dataList: any = [];
  listOfSearchName = [] ;

  constructor(private fb: FormBuilder,
              private templateService: NoticeTemplateService,
              public router: Router) { }

  ngOnInit() {
    this.listTemplates();
  }

  listTemplates() {
    this.templateService.getAllTemplates().subscribe(res => {
      this.templateList = res;
      this.filteredTemplateList  = res;
    });
  }

  searchTemplates() {
    this.filteredTemplateList = this.templateList
                                .filter( x => x.name.toLowerCase().includes(this.searchNotice.toLowerCase()));
  }

  onSearchNotice() {
    this.filteredTemplateList = this.templateList
                                .filter( x => x.name.toLowerCase().includes(this.searchNotice.toLowerCase()));
  }

  sort(sort: { key: string; value: string} ): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.sortData();
    console.log('name', this.sortName);
    console.log('value', this.sortValue);
  }

  filter(listOfSearchName: string[]): void {
    this.listOfSearchName = listOfSearchName;
    this.sortData();
  }
  sortData(): void {
    const filterFunc = (item: { name: string; status: string;}) =>
    (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true);
    const data = this.templateList.filter(item => filterFunc(item));

    if (this.sortName && this.sortValue) {
      this.filteredTemplateList = data.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    }
  }
  goToCreate(){
    setTimeout(() => {
    this.router.navigate(['business-dashboard/notice/template/create']);
  }, 1500);
  }
}
