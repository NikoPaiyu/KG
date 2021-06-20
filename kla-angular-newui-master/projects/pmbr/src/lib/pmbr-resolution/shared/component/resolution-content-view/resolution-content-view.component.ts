import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HtmdiffService } from 'projects/pmbr/src/lib/pmbr-bill/shared/services/htm-version.service';
import { PmbrResolutionContentService } from '../../services/pmbr-resolution-content.service';
import { PmbrResolutionService } from '../../services/pmbr-resolution.service';

@Component({
  selector: 'pmbr-resolution-content-view',
  templateUrl: './resolution-content-view.component.html',
  styleUrls: ['./resolution-content-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ResolutionContentViewComponent implements OnInit {
  @Input() blocks;
  @Input() block;
  @Input() versionDetails = [];
  @Input() billId;
  htmlContent = null;
  fullScreenMode = false;
  versionNumber = new FormControl(null);
  finalBillContent;
  constructor(private resolutionContent: PmbrResolutionContentService, private resolutionServices: PmbrResolutionService,
    private diff: HtmdiffService) { }

  ngOnInit() {
    if (this.blocks && this.blocks.length > 0) {
      this.finalBillContent = this.resolutionContent.processBillContent(this.blocks);
    }
    if (this.block && this.block.length > 0) {
      this.finalBillContent = this.resolutionContent.processBillContent(this.block);
    }
    this.htmlContent = this.finalBillContent;
    this.versionNumber.valueChanges.subscribe(data => {
      this.getVersionByVersionNumber(data);
    });
  }
  // fullscreen mode
  addClass() {
    this.fullScreenMode = !this.fullScreenMode;
  }
  getVersionDetails() {
    let item = Object.values(this.versionDetails);
    if (item && item.length > 0) {
      if (!this.versionNumber.value) {
        const versions = item.map(x => Number(x.version));
        if (versions && versions.length > 0) {
          this.versionNumber.setValue(Math.max(...versions));
        }
      }
    }
    return item;
  }
  getVersionByVersionNumber(version) {
    this.resolutionServices.getResolutionVersionDetails(version, this.billId).subscribe(data => {
      this.htmlContent = null;
      const newContent = this.resolutionContent.processBillContent((data as any).bill.blocks);
      this.htmlContent = this.diff.htmlDiff(this.finalBillContent, newContent);
      this.htmlContent = newContent;
    });
  }
  getRole(item) {
    if (item && item.length > 0) {
      return item[0].roleName;
    } else {
      return '';
    }
  }

}
