import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PmbrScheduleService } from '../../services/pmbr-schedule.service';

@Component({
  selector: 'pmbr-create-bullettin-form',
  templateUrl: './create-bullettin-form.component.html',
  styleUrls: ['./create-bullettin-form.component.css']
})
export class CreateBullettinFormComponent implements OnInit {
  
  @Input() bulletinData;
  @Output() afterCreate = new EventEmitter<any>();

  constructor(private pmbrScheduleService : PmbrScheduleService) { }

  ngOnInit() {
  }
  cancel() {
    this.afterCreate.emit(false);
  }
  create() {
    this.pmbrScheduleService.createBullettin(this.bulletinData).subscribe((res: any) => {
      this.afterCreate.emit(true);
    });
  }
}
