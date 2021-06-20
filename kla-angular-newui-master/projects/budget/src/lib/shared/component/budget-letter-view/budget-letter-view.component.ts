import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetCommonService } from '../../services/budgetcommon.service';

@Component({
  selector: 'budget-letter-view',
  templateUrl: './budget-letter-view.component.html',
  styleUrls: ['./budget-letter-view.component.css']
})
export class BudgetLetterViewComponent implements OnInit {
  user;
  @Input() correspondenceId;
  letterContent;
  constructor(private router: Router,
    @Inject("authService") private auth, private budgetCommonService: BudgetCommonService
  ) {
    this.user = auth.getCurrentUser();
  }

  ngOnInit() {
    if (this.correspondenceId) {
      this.budgetCommonService
        .getCorrespondenceById(this.correspondenceId, this.user.correspondenceCode.code)
        .subscribe((Res: any) => {
          this.letterContent = Res.data
        });
    }
  }
  viewCorrespondence(id) {
    this.router.navigate([
      'business-dashboard/correspondence/correspondence',
      'view',
      id,
    ]);
  }
}
