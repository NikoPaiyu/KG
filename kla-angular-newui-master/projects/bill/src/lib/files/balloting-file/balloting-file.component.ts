import { Component, OnInit,Input,} from '@angular/core';

@Component({
  selector: 'lib-balloting-file',
  templateUrl: './balloting-file.component.html',
  styleUrls: ['./balloting-file.component.scss']
})
export class BallotingFileComponent implements OnInit {
  @Input()ballotresponse;
  noticeType;
  listballotData;
  ballotStatus
  constructor() { }

  ngOnInit() {
    console.log(this.ballotresponse)
    this.noticeType=this.ballotresponse.noticeType
    //console.log(this.ballotresponse.noticeType);
    this.listballotData=this.ballotresponse.ballotedList;
    this.ballotStatus=this.ballotresponse.ballotStatus;
  }

}
