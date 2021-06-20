import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteecommonService } from '../../shared/services/committeecommon.service';

@Component({
  selector: 'committee-select-committee-fileview',
  templateUrl: './select-committee-fileview.component.html',
  styleUrls: ['./select-committee-fileview.component.css']
})
export class SelectCommitteeFileviewComponent implements OnInit {
  @Input() memberDetailDto;
  @Input() userDetails;
  @Input() isFileView = false;
  @Input() category;
  @Input() assignee = null
  user;
  rbsPermission={
    addChairman:false
  }
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
      this.loadPermissions();
    }
    loadPermissions() {
      if (this.committeeCommonService.doIHaveAnAccess('ADD_SELECT_COMMITEE_CHAIRMAN', 'UPDATE')) {
        this.rbsPermission.addChairman = true;
      }
    } 
    viewCommitteDetails(id){
      if(this.category == 'SELECT_COMMITTEE'){
        this.router.navigate(["business-dashboard/committee/select-committee-members/",'edit',id]);
        }
    }

}
