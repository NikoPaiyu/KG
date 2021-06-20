import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ElectionService } from '../../services/election.service';

@Component({
  selector: 'tables-panel-view',
  templateUrl: './panel-view.component.html',
  styleUrls: ['./panel-view.component.scss']
})
export class PanelViewComponent implements OnInit {
@Input() assembly;
@Input() session;
@Input() memberList;
@Input() assemblyId;
@Input() sessionId;
@Output() closePopup = new EventEmitter<any>();
fileDetails: any = null;

  constructor(private electionService: ElectionService,
              private notification: NzNotificationService) {}

  handlePreviewCancel() {
    this.closePopup.emit();
  }
  ngOnInit() {
  }
}
