import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';

@Component({
  selector: 'committee-subject-committee-fileview',
  templateUrl: './subject-committee-fileview.component.html',
  styleUrls: ['./subject-committee-fileview.component.css']
})
export class SubjectCommitteeFileviewComponent implements OnInit {
@Input() memberDetailDto;
@Input() userDetails;
@Input() isFileView = false;
@Input() category;
@Input() assignee = null
user;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject("authService") private AuthService,
    private committeeCommonService: CommitteecommonService,
  ) {
    this.user = AuthService.getCurrentUser();
    this.committeeCommonService.setCommitteePermissions(this.user.rbsPermissions);
   }

  ngOnInit() {
  } 
  viewCommitteDetails(id,purpose){
    if(this.category == 'SUBJECT_COMMITTEE'){
    this.router.navigate(["business-dashboard/committee/subject-nominee/",purpose,id]);
    }
  }
}
