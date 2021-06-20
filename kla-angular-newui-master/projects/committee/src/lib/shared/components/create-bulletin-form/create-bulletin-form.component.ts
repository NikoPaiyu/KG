import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BulletinServiceService } from '../../services/bulletin-service.service';

@Component({
  selector: 'committee-create-bulletin-form',
  templateUrl: './create-bulletin-form.component.html',
  styleUrls: ['./create-bulletin-form.component.css']
})
export class CreateBulletinFormComponent implements OnInit {
  @Input() bulletinData;
  @Output() afterCreate = new EventEmitter<any>();
  constructor(private bulletinService: BulletinServiceService) { }

  ngOnInit() {
  }

  cancel() {
    this.afterCreate.emit(false);
  }
  create() {
    this.bulletinService.createBulletin(this.bulletinData).subscribe((res: any) => {
      this.afterCreate.emit(true);
    });
  }
}
