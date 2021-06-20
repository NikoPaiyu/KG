import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HtmdiffService } from '../../services/htm-version.service';
import { PmbrBillContentService } from '../../services/pmbr-bill-content.service';
import { PmbrBillService } from '../../services/pmbr-bill.service';

@Component({
  selector: 'pmbr-bill-content-view',
  templateUrl: './bill-content-view.component.html',
  styleUrls: ['./bill-content-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BillContentViewComponent implements OnInit {

  @Input() blocks;
  @Input() block;
  @Input() versionDetails = [];
  @Input() billId;
  htmlContent = null;
  fullScreenMode = false;
  versionNumber = new FormControl(null);
  finalBillContent;
  constructor(private billcontent: PmbrBillContentService, private bill: PmbrBillService,
    private diff: HtmdiffService) { }

  ngOnInit() {
    if (this.blocks && this.blocks.length > 0) {
      this.finalBillContent = this.billcontent.processBillContent(this.blocks);
    }
    if (this.block && this.block.length > 0) {
      this.finalBillContent = this.billcontent.processBillContent(this.block);
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
    // item = item.slice(Math.max(item.length - 2, 0));
    // if (item) {
    //   item.forEach((el, index) => {
    //     item[index].version = index + 1;
    //   });
    // }
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
    this.bill.getBillVersionDetails(version, this.billId).subscribe(data => {
      this.htmlContent = null;
      const newContent = this.billcontent.processBillContent((data as any).bill.blocks);
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
