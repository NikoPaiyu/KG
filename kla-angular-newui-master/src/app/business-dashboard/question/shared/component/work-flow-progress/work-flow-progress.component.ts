import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-work-flow-progress',
  templateUrl: './work-flow-progress.component.html',
  styleUrls: ['./work-flow-progress.component.scss']
})
export class WorkFlowProgressComponent implements OnInit {
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
    this.file.checkQuestionWorkFlowStatus(this.processInfoId).subscribe(data => {
      this.stepStatusDetail = data;
      this.data.emit(data);
    }, error => {
      this.stepStatusDetail = null;
    });
  }
}
