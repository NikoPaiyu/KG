import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-ballot-list-view',
  templateUrl: './ballot-list-view.component.html',
  styleUrls: ['./ballot-list-view.component.scss']
})
export class BallotListViewComponent implements OnInit {
  @Input() ballotList;
  @Input() assembly;
  @Input() session;
  @Input() billTitle;
  @Input() showHeader;
  @Input() listNumber;
  @Input() details;
  fullScreenMode = false;
  constructor() { }

  ngOnInit() {
  }
  formatDate(dateString) {
    if (dateString) {
      const date = new Date(dateString);
      const monthML = [
        'ജനുവരി',
      'ഫെബ്രുവരി',
      'മാർച്ച്' ,
      'ഏപ്രിൽ' ,
      'മെയ്' ,
      'ജൂൺ' ,
      'ജൂലൈ' ,
      'ഓഗസ്റ്റ്' ,
      'സെപ്റ്റംബർ' ,
      'ഒക്ടോബർ' ,
      'നവംബർ' ,
      'ഡിസംബർ'];
      return date.getFullYear() + ' ' + monthML[date.getMonth()] + ' ' + date.getDate();
    }
  }

  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
  pageSizeChanged(PageIndex){
    console.log(PageIndex)
    this.showHeader=false;
    if(PageIndex=='1'){
      this.showHeader=true;
    }
  }
  isLastPage(currentPage) {
    return currentPage == Math.ceil(this.ballotList.length/10);
  }
}
