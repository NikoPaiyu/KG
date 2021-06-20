import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../shared/configuration.service';

@Component({
  selector: 'app-constituency-list',
  templateUrl: './constituency-list.component.html',
  styleUrls: ['./constituency-list.component.scss']
})
export class ConstituencyListComponent implements OnInit {
  search = null;
  constituencyList: any = [];
  tempconstituencyList: any = [];
  list:any = [];
  constructor(private config: ConfigurationService) { }
  
  getConstituency(){
    const body = {
      constituency:true,
      party:false,
      memberDesignation:false,
      section:false,
      officeDesignation:false,
      rules:false,
      directions:false,
      partyFront:false,
      country:false,
      state:false,
      district:false,
      taluk:false
    }
    this.config.getConstituency(body).subscribe((res:any)=>{
      this.list =  res;
      this.constituencyList = this.tempconstituencyList = this.list.constituency;
    })
  }
  ngOnInit() {
    this.getConstituency();
  }

  onSearch(){
    if (this.search) {
      this.constituencyList = this.tempconstituencyList.filter(
        (element) =>
          (element.kerelaContituencyCode &&
            element.kerelaContituencyCode.toString()
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.kerelaContituencyName &&
            element.kerelaContituencyName
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.constituencyList = this.tempconstituencyList;
    }
  }

}
