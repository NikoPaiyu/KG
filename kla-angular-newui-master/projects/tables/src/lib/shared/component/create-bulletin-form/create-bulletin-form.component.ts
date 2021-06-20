import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ElectionService } from '../../services/election.service';

@Component({
  selector: 'tables-create-bulletin-form',
  templateUrl: './create-bulletin-form.component.html',
  styleUrls: ['./create-bulletin-form.component.css']
})
export class CreateBulletinFormComponent implements OnInit {
  @Input() bulletinData;
  @Output() afterCreate = new EventEmitter<any>();
  constructor(private electionService: ElectionService) { }

  ngOnInit() {
  }

  cancel() {
    this.afterCreate.emit(false);
  }
  create() {
    this.electionService.createBulletin(this.bulletinData).subscribe((res: any) => {
      this.afterCreate.emit(true);
    });
  }
}
