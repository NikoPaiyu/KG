import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-booklet-preview',
  templateUrl: './booklet-preview.component.html',
  styleUrls: ['./booklet-preview.component.scss']
})
export class BookletPreviewComponent implements OnInit {
  @Input() previewData;
  @Input() assembly;
  @Input() session;
  @Input() hidePrint;
  clauseNo = ["എ", "ബി", "സി", "ഡി", "ഇ", "എഫ്", "ജി", "എച്ച്"];
  constructor() { }

  ngOnInit() {
    let bodyControl = document.getElementsByTagName("body")[0];
    bodyControl.classList.add("questionbooklet");
    // console.log(this.previewData);
  }

}
