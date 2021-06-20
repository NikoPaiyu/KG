import { Component, Inject, Input, OnInit } from '@angular/core';
import { FileServiceService } from '../../shared/services/file-service.service';

@Component({
  selector: 'tables-panel-chairman-list',
  templateUrl: './panel-chairman-list.component.html',
  styleUrls: ['./panel-chairman-list.component.css']
})
export class PanelChairmanListComponent implements OnInit {
  @Input() fileId;
  userId;
  fileDetails: any = null;
  panelOfChairmanDtoList: any = null;

  constructor(private file: FileServiceService,
              @Inject("authService") private auth,) {
    this.userId = auth.getCurrentUser().userId;
  }

  ngOnInit() {
   this.getFileByElectionFileId();
  }
  
  getFileByElectionFileId(){
    this.file.getFileByElectionFileId(this.fileId, this.userId).subscribe((res:any)=>{
      this.fileDetails = res;
      this.panelOfChairmanDtoList = this.fileDetails.panelOfChairmanDtoList;
    })
  }
}
