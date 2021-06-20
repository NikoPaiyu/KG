import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import { FormControl } from '@angular/forms';
import { BillManagementService } from '../../shared/services/bill-management.service';
import { BillContentService } from "../shared/bill-content.service";
import { HtmdiffService } from '../shared/htm-version.service';

@Component({
  selector: "app-bill-content",
  templateUrl: "./bill-content.component.html",
  styleUrls: ["./bill-content.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BillContentComponent implements OnInit {
  @Input() blocks;
  @Input() block;
  @Input() versionDetails = [];
  @Input() billId;
  @Input() billDetails;
  htmlContent = null;
  fullScreenMode = false;
  versionNumber;
  finalBillContent = [];
  constructor(private billcontent: BillContentService, private bill: BillManagementService,
    private diff: HtmdiffService) { }

  ngOnInit() {
    if (this.blocks && this.blocks.length > 0) {
      this.blocks.forEach(async (el, i) => {
        setTimeout(async () => {
          const data = await this.billcontent.processBillContent([el]);
          this.finalBillContent.push(data);
        }, 100);
        this.htmlContent = null;
      });
    }
    if (this.block && this.block.length > 0) {
      this.block.forEach(async (el, i) => {
        setTimeout(async () => {
          const data = await this.billcontent.processBillContent([el]);
          this.finalBillContent.push(data);
        }, 100);
      });
      this.htmlContent = null;
    }
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
      if (!this.versionNumber) {
        const versions = item.map(x => Number(x.version));
        if (versions && versions.length > 0) {
          this.versionNumber = Math.max(...versions);
        }
      }
    }
    return item;
  }
  getVersionByVersionNumber(version) {
    this.bill.getBillVersionDetails(version, this.billId).subscribe(async data => {
      const newContent = await this.billcontent.processBillContent((data as any).bill.blocks);
      // this.htmlContent = this.diff.htmlDiff(this.finalBillContent.join(''), newContent);
      this.htmlContent = newContent.join('');
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
