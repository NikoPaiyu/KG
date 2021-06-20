import { Component, OnInit } from '@angular/core';
import { AssemblyManagementService } from '../../shared/service/assembly-management.service';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss']
})
export class SectionListComponent implements OnInit {
  sectionList: any = [];
  tempSectionList: any = [];
  search = null;
  constructor(private assembly: AssemblyManagementService ) { }

  ngOnInit() {
    this.getSections();
  }
  getSections() {
    this.assembly.getKlaSections().subscribe((res:any)=>{
      this.sectionList = this.tempSectionList = res;
    })
  }
  onSearch(){
    if (this.search) {
      this.sectionList = this.tempSectionList.filter(
        (element) =>
          (element.klaSectionId &&
            element.klaSectionId.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.klaSectionName &&
            element.klaSectionName
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
              (element.code &&
                element.code
                  .toLowerCase()
                  .includes(this.search.toLowerCase()))
      );
    } else {
      this.sectionList = this.tempSectionList;
    }
  }

}
