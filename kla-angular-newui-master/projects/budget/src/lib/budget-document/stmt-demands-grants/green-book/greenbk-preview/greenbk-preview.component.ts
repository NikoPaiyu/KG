import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { StmtDemandsGrantsService } from '../../../../shared/services/stmt-demands-grants.service';

@Component({
  selector: 'budget-greenbk-preview',
  templateUrl: './greenbk-preview.component.html',
  styleUrls: ['./greenbk-preview.component.scss']
})
export class GreenbkPreviewComponent implements OnInit {
  @Input() grnBKData;
  grnBkDto;
  constructor(
    @Inject('authService') public auth,
    private sdfg: StmtDemandsGrantsService
  ) {
  }
  ngOnInit() {
    console.log(this.grnBKData);
  }
}
