import { Component, Input, OnInit } from '@angular/core';
import { BillContentService } from '../shared/bill-content.service';
import { BillViewService } from '../shared/bill-view.service';
import { HtmlVersionService } from '../shared/html-version.service';

@Component({
  selector: 'budget-bill-content',
  templateUrl: './bill-content.component.html',
  styleUrls: ['./bill-content.component.css']
})
export class BillContentComponent implements OnInit {
  @Input() blocks;
  @Input() block;
  @Input() versionDetails = [];
  @Input() billId;
  @Input() billDetails;
  @Input() isFileView = false;
  htmlContent = null;
  fullScreenMode = false;
  versionNumber;
  finalBillContent = [];
  constructor(private billcontent: BillContentService,private billViewService : BillViewService,
    private diff: HtmlVersionService) { }

  ngOnInit() {
    if(this.isFileView){
      this.billViewService.getBillByBillId(this.billId).subscribe((res) => {
        this.billDetails = res as any;
        if(this.billDetails.blocks.length > 0){
          this.blocks = this.billDetails.blocks;
          this.versionDetails = this.billDetails.versionMap;
          this.setContent();
        }
      });
    }else{
      this.setContent();
    }
    
  }
  setContent(){
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
    this.billViewService.getBillVersionDetails(version, this.billId).subscribe(async data => {
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
