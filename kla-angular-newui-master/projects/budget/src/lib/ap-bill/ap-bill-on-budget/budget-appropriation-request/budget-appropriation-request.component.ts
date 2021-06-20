import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetCommonService } from '../../../shared/services/budgetcommon.service';

@Component({
  selector: 'budget-budget-appropriation-request',
  templateUrl: './budget-appropriation-request.component.html',
  styleUrls: ['./budget-appropriation-request.component.css']
})
export class BudgetAppropriationRequestComponent implements OnInit {
  user;
  @Input() letterDetails;
  letterContent;
  constructor( private router: Router, 
    @Inject("authService") private auth,private budgetCommonService : BudgetCommonService

  ) { 
    this.user = auth.getCurrentUser();
  }

  ngOnInit() {
    if(this.letterDetails.currespondanceId){
      this.budgetCommonService
      .getCorrespondenceById(this.letterDetails.currespondanceId, this.user.correspondenceCode.code)
      .subscribe((Res:any) => {
        this.letterContent = Res.data
      });
      }
  }
  viewCorrespondence(id){
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      id,
    ]);
  }
}
