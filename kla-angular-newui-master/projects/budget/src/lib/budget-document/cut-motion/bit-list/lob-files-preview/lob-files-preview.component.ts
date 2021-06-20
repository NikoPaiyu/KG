import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { StmtDemandsGrantsService } from '../../../../shared/services/stmt-demands-grants.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'budget-lob-files-preview',
  templateUrl: './lob-files-preview.component.html',
  styleUrls: ['./lob-files-preview.component.scss']
})
export class LobFilesPreviewComponent implements OnInit {
  @Input() bitListMasterId;
  @Input() sdfgId;
  @Input() type;
  bitListdates;
  docUrl;
  showPDF = false;
  cosDate;
  constructor(
    @Inject('authService') public auth,
    private sdfg: StmtDemandsGrantsService,
    private notify: NzNotificationService,
    private sanitizer: DomSanitizer
  ) {
  }
  ngOnInit() {
    this.getCosDatesForSdfgId();
  }
  getCosDatesForSdfgId() {
    if(this.sdfgId) {
      this.sdfg.getCosDatesForSdfgId(this.sdfgId).subscribe((dates) => {
        this.bitListdates = dates;
      })
    }
  }
  showPdf(data) {
    this.sdfg.getPdfUrlByDemandDraftIdAndType(data.key, this.type).subscribe((res) => {
      this.showPDF = false;
      if(!res) {
        this.notify.info('Info', 'No Document Found !!');
        return;
      }
      this.showPDF = true;
      this.docUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
    })
  }
}
