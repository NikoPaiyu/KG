import { Component, OnInit } from '@angular/core';
import { SoaService } from '../shared/services/soa.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { AssemblyList, SessionList } from '../../calender-of-sitting/shared/models/cobmodel';
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';

@Component({
  selector: 'app-approved-soa',
  templateUrl: './approved-soa.component.html',
  styleUrls: ['./approved-soa.component.scss']
})
export class ApprovedSoaComponent implements OnInit {
  assemblyId = null;
  sessionId = null;
  assemblyList: AssemblyList[];
  sessionList: SessionList[];
  listOfData = [];
  constructor(private service: SoaService, private user: AuthService, private cos: CalenderofsittingService) { }

  ngOnInit() {
    this.getAssemlySessionDetails();
  }
  getAssemlySessionDetails() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.assemblyId = data.activeAssemblySession.assemblyId;
      this.filterAssembly();
      this.sessionId = data.activeAssemblySession.sessionId;
      this.getSoa();
    });
  }
  filterAssembly() {
    const assembly = this.assemblyList.find(x => x.id == this.assemblyId);
    if (assembly) {
      this.sessionList = (assembly as any).session;
    }
    this.sessionId = null;
    this.listOfData = [];
  }
  getSoa() {
    if (this.assemblyId && this.sessionId) {
      this.service.getSoaData(this.assemblyId, this.sessionId, this.user.getCurrentUser().userId)
      .subscribe(data => {
        if (data.scheduleDates && data.scheduleDates.length > 0) {
          this.listOfData = data.scheduleDates;
        } else {
          this.listOfData = [];
        }
      });
    }
  }
}
