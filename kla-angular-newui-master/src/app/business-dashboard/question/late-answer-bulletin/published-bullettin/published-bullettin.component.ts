import { Component, OnInit } from '@angular/core';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { CalenderofsittingService } from 'src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service';
import { QuestionService } from '../../shared/question.service';

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
    private question : QuestionService,
    private cos: CalenderofsittingService,
    private notify: NotificationCustomService,
    public auth: AuthService,
  ) { 
    this.getAssemblyandSession(); 
  }

  ngOnInit() {
  }
  getAssemblyandSession() {
    this.cos.getAllAssembly().subscribe((res) => {
      this.assemblyList = res;
      const ids = this.assemblyList.map( x => x.id);
      this.assemblyId = Math.max(...ids);
      this.cos.getAllSession().subscribe((data) => {
        this.sessionList = data;
        const id = this.sessionList.map( x => x.id);
        this.sessionId = Math.max(...id);
        this.getBullettinList();
      });
    });
  }
  getBullettinList() {
    this.question.getBullettinList().subscribe( res => {
      if(res) {
        this.bullettinList = res;
      }
    });
  }
  getPDF() {
    if(this.displayData){
      let body={
          htmlString: this.displayData
      }
      var mediaType = "application/pdf";
      this.question.downloadReport(body).subscribe((response) => {
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
  }
}
