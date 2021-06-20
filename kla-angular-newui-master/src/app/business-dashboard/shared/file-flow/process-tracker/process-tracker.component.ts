import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-process-tracker',
  templateUrl: './process-tracker.component.html',
  styleUrls: ['./process-tracker.component.scss']
})
export class ProcessTrackerComponent implements OnInit {
  @Input() processInfoId;
  @Output() data = new EventEmitter();
  stepStatusDetail = [];
  constructor(private file: FileService) { }

  ngOnInit() {
    this.getSteps();
  }
  getStatusByReason(reason) {
    if (reason) {
      if (reason === 'completed') {
        return 'finish';
      }
      if (reason === 'in progress') {
        return 'wait';
      }
    }
  }
  getSteps() {
    this.file.checkWorkFlowStatus(this.processInfoId).subscribe(data => {
      this.stepStatusDetail = data;
      this.data.emit(data);
    }, error => {
      this.stepStatusDetail = null;
    });
  }
}
