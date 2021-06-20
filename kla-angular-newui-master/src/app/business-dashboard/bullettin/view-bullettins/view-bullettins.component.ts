import { Component, OnInit } from '@angular/core';
import { BullettinService } from '../shared/services/bullettin.service';
import { Router, ActivatedRoute } from '@angular/router';

interface ItemData {
  id: number;
  bullettinTitle: string;
  type: string;
  date: string;
  status: string;
}
@Component({
  selector: 'app-view-bullettins',
  templateUrl: './view-bullettins.component.html',
  styleUrls: ['./view-bullettins.component.scss']
})
export class ViewBullettinsComponent implements OnInit {
  listOfData: any;
  constructor(private bullettin: BullettinService,
              private router: Router,
              private route: ActivatedRoute) { }


  getAllBullettinList() {
    this.bullettin.getAllBullettinList().subscribe(Response => {
      if (Response) {
        this.listOfData = Response;
        console.log(this.listOfData);
      }
    });
  }
  openFile(id) {
    this.router.navigate(["details", id], {
       relativeTo: this.route.parent
    });
  }
  ngOnInit() {
    this.getAllBullettinList();
  }

}
