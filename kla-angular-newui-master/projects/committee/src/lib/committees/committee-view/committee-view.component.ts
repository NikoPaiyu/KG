import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CommitteeService } from '../../shared/services/committee.service';
@Component({
  selector: 'committee-committee-view',
  templateUrl: './committee-view.component.html',
  styleUrls: ['./committee-view.component.css']
})
export class CommitteeViewComponent implements OnInit {
  dateofconstitution = "26/10/2010";
  @Input() isView  = false;
  constructor( 
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {  }
committeeEdit(){
  this.router.navigate([
    "business-dashboard/committee/committee-edit"
  ]);
}
}
