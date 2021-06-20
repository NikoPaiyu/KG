import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillBulletinService } from '../../services/bill-bulletin.service';

@Component({
  selector: 'lib-create-bulletin-form',
  templateUrl: './create-bulletin-form.component.html',
  styleUrls: ['./create-bulletin-form.component.css']
})
export class CreateBulletinFormComponent implements OnInit {
  @Input() bulletinData;
  @Output() afterCreate = new EventEmitter<any>();
  constructor(private bulletinService: BillBulletinService) { }

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
