import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { RulesAndDirectionsService } from '../shared/service/rules-and-directions.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  listOfRules: [];
  constructor(private rulesanddirectionsservice: RulesAndDirectionsService) { }

  ngOnInit() {
    this.getListOfRules();
  }
  getListOfRules() {
    this.rulesanddirectionsservice.getListOfRulesAndDirections('rules').subscribe((res: any) => {
      this.listOfRules = res;
    });
  }
}
