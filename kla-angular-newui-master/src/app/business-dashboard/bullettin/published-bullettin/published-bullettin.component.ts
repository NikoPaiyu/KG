import { Component, OnInit } from '@angular/core';
import { BulletinService } from '../shared/bulletin.service';
import { CalenderofsittingService } from '../../calender-of-sitting/shared/services/calenderofsitting.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import * as jsPdf from 'jspdf';

@Component({
  selector: 'app-published-bullettin',
  templateUrl: './published-bullettin.component.html',
  styleUrls: ['./published-bullettin.component.scss']
})
export class PublishedBullettinComponent implements OnInit {

  bullettinList: any =[];
  assemblyId = null;
  assemblyList = [];
  sessionId = null;
  sessionList = null;
  finalUrl;
  loading = false;
  isVisible = false;
  displayData: any;

  constructor(
    private bulletin: BulletinService,
    private cos: CalenderofsittingService,
    private notify: NotificationCustomService,
    public auth: AuthService,
  ) { 
    
  }

  ngOnInit() {
    this.getAssemblyandSession(); 
  }
  getAssemblyandSession() {
    this.cos.getAssemblySessionDetails().subscribe(data => {
      this.assemblyList = data.assemblySession;
      this.assemblyId = data.activeAssemblySession.assemblyId;
      this.filterAssembly();
      this.sessionId = data.activeAssemblySession.sessionId;
      this.getBullettinList();
    });
  }
  
  filterAssembly() {
    const assemblyDetail = this.assemblyList.find(x => x.id === this.assemblyId);
    this.sessionId = null;
    this.sessionList = assemblyDetail.session;
    this.bullettinList = [];
  }
  getBullettinList() {
    console.log(this.assemblyId, this.sessionId);
    this.bulletin.getBullettinList().subscribe( res => {
      if(res) {
        this.bullettinList = (res as any).filter(x => x.assemblyId == this.assemblyId && x.sessionId == this.sessionId);
      }
    });
  }
  getPDF() {
    if(this.displayData){
      let body={
          htmlString: this.displayData
      }
      var mediaType = "application/pdf";
      this.bulletin.downloadReport(body).subscribe((response) => {
        if (response) {
          var blob = new Blob([response], { type: mediaType });
          this.finalUrl = URL.createObjectURL(blob);
        if(this.finalUrl) {
            this.isVisible = true;
      }
  }  else { this.notify.showWarning('PDF not avilable!', '') }
});
}
  }
  showPdfModal(data) {
    if(data) {
      this.displayData = data;
      this.getPDF();
    } else { this.notify.showWarning('PDF not avilable!', '') }
    
  }
  handleCancel() {
    this.isVisible = false;
    this.displayData = null;
    this.finalUrl = null;
  }
}
