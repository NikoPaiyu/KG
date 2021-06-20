import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Attachment } from '../../../models/auction.model';
import {saveAs} from "file-saver";
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @ViewChild('pdfViewerOnDemand',{static: false}) pdfViewerOnDemand;

  @Input() fileList = [];
  @Input() type: string;
  @Input() attachmentDisabled: boolean;
  @Output() fileListEvent = new EventEmitter();

  finalUrl;
  pdfViewer: boolean = false;
  isVisible: boolean = false;
  /* Pdf Src */
  pdfSrc: string;

  

  constructor() { }

  ngOnInit() {
  }

    /*
    Go to auction
  */
    public downloadFile(attachmentInfo: Attachment){
      FileSaver.saveAs(attachmentInfo.auctionAttachment, attachmentInfo.attachmentName);
    }

    public mousehover(icon: HTMLElement){
      icon.style.display = 'block';
    }

    public deleteFile(index: number){
      this.fileList.splice(index,1);
      this.fileListEvent.emit(this.fileList);
    }

    public onUpload(files: FileList){
      this.processFile(files.item(0),this.type);
    }

    handleCancel(){
      this.isVisible = false;
    }

    
    /*
        Processing File
    */
    public processFile(file: File,type: string): void{
      const reader = new FileReader();
      reader.onload = () => {
      const data = reader.result;
      const attachment = new Attachment(file.name,data,type);
      this.fileList.push(attachment);
      this.fileListEvent.emit(this.fileList);
      }
    reader.readAsDataURL(file);
  }

}
