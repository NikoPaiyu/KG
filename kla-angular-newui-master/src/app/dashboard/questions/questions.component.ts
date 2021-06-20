import { Component, OnInit } from '@angular/core';
import { FileuploadService } from "src/app/business-dashboard/fileupload/shared/services/fileupload.service";
import { NzDrawerService } from "ng-zorro-antd";
import { PdfViewerComponent } from "src/app/shared/components/pdf-viewer/pdf-viewer.component";
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  FileUpalodDetails;
  constructor( private drawerService: NzDrawerService,
    private fileuploadservice: FileuploadService,
    private router: Router,
    private activeroute:ActivatedRoute
  ){}

  ngOnInit() {
  }

  openStarredQuesTemplate(){
   
    this.router.navigate(["../../questions/starred-questions"],{ relativeTo:this.activeroute})
  }

  openUnStarredQuesTemplate(){
   
    this.router.navigate(["../../questions/unstarred-questions"],{ relativeTo:this.activeroute})
  }

}
