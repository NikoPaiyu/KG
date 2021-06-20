import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetDocumentService } from '../../../shared/services/budget-document.service';
import { SdgEgService } from '../../../shared/services/sdg-eg.service';

@Component({
  selector: 'budget-dds-heads-gulletin',
  templateUrl: './dds-heads-gulletin.component.html',
  styleUrls: ['./dds-heads-gulletin.component.scss']
})
export class DdsHeadsGulletinComponent implements OnInit {
  @Input() fileId;
  @Input() demandDraftMasterId;
  @Input() demandVersionStatus;
  @Input() sdfgMasterId;
  @Input() DDSCreationType;
  @Input() isFileView = false;
  gulletinList;
  constructor(private router: Router, private budgetDocService: BudgetDocumentService, private sdgeg: SdgEgService
  ) { }

  ngOnInit() {
  }
  renderGulletin(gulletin) {
    this.gulletinList = gulletin;
  }
  gotoVersion() {
    if (this.DDSCreationType === 'SDGEG') {
      this.getDDSMateridsForSDGEG();
      return;

    }
    this.getDDSMaterids();
  }
  getDDSMateridsForSDGEG() {
    this.sdgeg.getDDSMaterids(this.fileId).subscribe((res: any) => {
      if (res) {
        this.router.navigate(['business-dashboard/budgets/sdgeg/dds/version', res.olMasterId, res.sectionMasterId], {
          state: {
            fileId: this.fileId,
            sdfgMasterId: this.sdfgMasterId
          }
        });
      }
    });
  }
  getDDSMaterids() {
    this.budgetDocService.getDDSMaterids(this.fileId).subscribe((res: any) => {
      if (res) {
        this.router.navigate(['business-dashboard/budgets/dds/version', res.olMasterId, res.sectionMasterId], {
          state: {
            fileId: this.fileId,
            sdfgMasterId: this.sdfgMasterId
          }
        });
      }
    });
  }
}
