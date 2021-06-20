import { Component, OnInit } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'cpl-cpl',
  template: `
  `,
  styles: []
})
export class CplComponent implements OnInit {

  constructor(private translate: TranslateService,) { 
    //this.translate.setDefaultLang("en");
    this.translate.use("en");
  }

  ngOnInit() {
  }

}
