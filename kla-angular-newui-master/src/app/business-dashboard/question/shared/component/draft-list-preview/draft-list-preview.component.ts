import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-draft-list-preview',
  templateUrl: './draft-list-preview.component.html',
  styleUrls: ['./draft-list-preview.component.scss']
})
export class DraftListPreviewComponent implements OnInit {
  @Input() previewData;
  @Input() assembly;
  @Input() session;
  constructor() { }

  ngOnInit() {
   
  }

}
