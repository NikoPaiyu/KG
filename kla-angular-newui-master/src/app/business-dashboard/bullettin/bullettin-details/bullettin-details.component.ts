import { Component, OnInit } from '@angular/core';
import { BullettinService } from '../shared/services/bullettin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bullettin-details',
  templateUrl: './bullettin-details.component.html',
  styleUrls: ['./bullettin-details.component.scss']
})
export class BullettinDetailsComponent implements OnInit {
  type: String;
  id: any;
  titleCategory: any;
  listOfData: any;

  constructor(private bullettin: BullettinService, private route: ActivatedRoute) { 
    const id = this.route.snapshot.params.id;
    if (id) {
       this.getBullettinListById(id);
    }
  }

  getBullettinListById(id) {
    this.bullettin.getBullettinListById(id).subscribe(Response => {
      if (Response) {
        this.titleCategory = Response;
      }
    });
  }
  // getAllBullettinList() {
  //   this.bullettin.getAllBullettinList().subscribe(Response => {
  //     if (Response) {
  //       this.listOfData = Response;
  //       console.log(this.listOfData);
  //     }
  //   });
  // }
  ngOnInit() {
    // this.getAllBullettinList();
  }

}
