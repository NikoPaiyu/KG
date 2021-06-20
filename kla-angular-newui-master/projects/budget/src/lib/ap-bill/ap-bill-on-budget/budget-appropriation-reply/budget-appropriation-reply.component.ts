import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetCommonService } from '../../../shared/services/budgetcommon.service';

@Component({
  selector: 'budget-budget-appropriation-reply',
  templateUrl: './budget-appropriation-reply.component.html',
  styleUrls: ['./budget-appropriation-reply.component.css']
})
export class BudgetAppropriationReplyComponent implements OnInit {
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
