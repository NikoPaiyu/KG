import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FieldConfig } from './shared/field.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notice-processing',
  templateUrl: './notice-processing.component.html',
  styleUrls: ['./notice-processing.component.scss']
})
export class NoticeProcessingComponent implements OnInit {
  FinalcomponentArray: FieldConfig[] = [];
  constructor(private translate: TranslateService) {
    //this.translate.setDefaultLang('en');
  }

  ngOnInit() {
  }


}
