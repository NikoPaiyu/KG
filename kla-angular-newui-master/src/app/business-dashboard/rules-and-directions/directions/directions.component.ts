import { Component, OnInit } from '@angular/core';
import { RulesAndDirectionsService } from '../shared/service/rules-and-directions.service';

@Component({
  selector: 'app-directions',
  templateUrl: './directions.component.html',
  styleUrls: ['./directions.component.scss']
})
export class DirectionsComponent implements OnInit {
  listOfDirections: [];
  constructor(private rulesanddirectionsservice: RulesAndDirectionsService) { }

  ngOnInit() {
    this.getDirections();
  }
  getDirections() {
    this.rulesanddirectionsservice.getListOfRulesAndDirections('directions').subscribe((res: any) => {

      this.listOfDirections = res;
    });
  }


}
