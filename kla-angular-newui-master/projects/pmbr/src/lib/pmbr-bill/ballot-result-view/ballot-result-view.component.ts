import { Component, Inject, Input, OnInit } from '@angular/core';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-ballot-result-view',
  templateUrl: './ballot-result-view.component.html',
  styleUrls: ['./ballot-result-view.component.scss']
})
export class BallotResultViewComponent implements OnInit {
  @Input() ballotId;
  @Input() assemblyList;
  @Input() sessionList;
  ballotResult: any = null;
  assemblyId: any = null;
  sessionId: any = null;
  showDropDown = false;
  billList: any = [];
  user: any = null;
  choosedBill: any = null;
  ballotToUpdate: any = null;

  constructor(private pmbrCommonService: PmbrCommonService,
              @Inject('authService') private AuthService) {
                this.user = AuthService.getCurrentUser();
               }

  ngOnInit() {
    if (this.ballotId) {
      this.ballotResultById();
    }
  }

  ballotResultById() {
    const body = {
      id: this.ballotId
    };
    this.pmbrCommonService.getBallotResultById(body).subscribe((res: any) =>{
      this.ballotResult = res;
      this.getAssemblySession();
    });
  }

  getAssemblySession() {
    this.assemblyId = this.assemblyList.find(x  => x.id === this.ballotResult.assemblyId).assemblyId;
    this.sessionId = this.sessionList.find(x  => x.id === this.ballotResult.sessionId).sessionId;
  }

  chooseBill() {
    this.ballotToUpdate = this.ballotResult.pmbrBillLottingResultDto.find(b => b.userId == this.user.userId);
    this.pmbrCommonService.getBillListToChoose(this.ballotToUpdate).subscribe((res: any) => {
      this.billList = res;
      this.showDropDown = true;
    });
  }

  cancelChoose() {
    this.showDropDown = false;
    this.billList = [];
  }

  updateResult() {
    this.ballotToUpdate.billId = this.choosedBill.bill.id;
    this.pmbrCommonService.updateBallotResult(this.ballotToUpdate).subscribe((res: any) => {
      this.ballotResultById();
      this.cancelChoose();
    });
  }

}
