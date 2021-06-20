import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig, statusConfig } from '../../field.interface';
import { differenceInCalendarDays } from 'date-fns';
// import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sro-number',
  templateUrl: './sro-number.component.html',
  styleUrls: ['./sro-number.component.scss']
})
export class SroNumberComponent implements OnInit {
  textdata: any = '';
  field: FieldConfig;
  group: FormGroup;
  today = new Date();
  Url: any = '';
  isurl = true;
  showPdfModal = false;
  Formdata;
  label
  canEditSRO: boolean;
  status: statusConfig;
  constructor(
    // private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.field.options = this.field.options.map(x => {
      if (x.url) {
        x.url;
      }
      return x;
    });
    if (this.field.value.url) {
      this.isurl = false;
    }
    this.label = this.field.label;
    if (this.label) {
      this.label = this.label.replace('[', '');
      this.label = this.label.replace(']', '');
    }
    if(this.status === 'SUBMITTED') {
      this.canEditSRO = true;
    } else { this.canEditSRO = false; }
  }
  getUrl(data) {
    if (data.url) {
      this.isurl = false;
      this.Url = data.url;
      }
  }
  onView() {
     this.showPdfModal = true;
     if (this.field.value.url) {
        this.getUrl(this.field.value);
     }
    // this.modalService.create({
    //   nzContent: SroPreviewComponent,
    //   nzWidth: "800",
    //   nzFooter: null,
    //   nzComponentParams: {
    //     url:this.Url
    //   },
    // });
  }
  hideModal() {
    this.showPdfModal = false;
  }

onAddData() {
  let options = [];
  if (this.Formdata && this.Formdata.length > 0) {
      const amendmentData = this.Formdata.find(x => x.type === 'amendment');
      if (amendmentData) {
        console.log(amendmentData );
        const atLabel = amendmentData.label;
        const data = this.textdata;
        console.log(atLabel, data);
        if (data) {
          // const atValue = data[atLabel];
          // console.log(atValue);
          this.group.get(atLabel).setValue(data);
          this.showPdfModal = false;
          this.textdata = '';
        }
      }
    }
  }
}
