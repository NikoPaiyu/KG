import { Component, OnInit } from '@angular/core';
import { AodService} from '../shared/service/aod.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/shared/services/auth.service';

@Component({
  selector: 'app-ministergroup-list',
  templateUrl: './ministergroup-list.component.html',
  styleUrls: ['./ministergroup-list.component.scss']
})
export class MinistergroupListComponent implements OnInit {
  filter: any = {
    sessionId: 0,
    assemblyId: 0
  };
  aodList :any =[];
  constructor(
    private aod: AodService,
    private router: Router,
    private user: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getList();
  }
  getList() {
    if (this.filter.assemblyId && this.filter.sessionId) {
      // const Type = 'AOD';
      this.aod.getAllFiles(this.filter.assemblyId, this.filter.sessionId, this.user.getCurrentUser().userId).subscribe((Response) => {
        if (Response) {
          this.aodList = Response;
        }
      });
    }
  }

  viewFile(fileId) {
    this.router.navigate(['/business-dashboard/aod/aod-file', fileId, this.filter.assemblyId, this.filter.sessionId]);
  }

}
