import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-ballot-file-view',
  templateUrl: './ballot-file-view.component.html',
  styleUrls: ['./ballot-file-view.component.scss']
})
export class BallotFileViewComponent implements OnInit {
  @Input() ballotList;
  @Input() assembly;
  @Input() session;
  @Input() billTitle;
  noticeType;
  listNumber;
  constructor() { }

  ngOnInit() {
  }

  setnoticetype(noticeType){
    if(noticeType=='GENERAL_AMENDMENT_II'){
      this.listNumber = 1;
      return this.noticeType="General Amendment II (Balloting for Report)"

    }
    if(noticeType=='GENERAL_AMENDMENT'){
      this.listNumber = 0;
      return this.noticeType="General Amendment I (Balloting for Bill)"

    }
    if(noticeType=='ORDINANCE_DISAPPROVAL'){
      return this.noticeType="Ordinance Disapproval"

    }
    
  }

}
