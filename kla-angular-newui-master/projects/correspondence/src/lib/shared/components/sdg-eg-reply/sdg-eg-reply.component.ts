import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CorrespondenceService } from '../../services/correspondence.service';

@Component({
  selector: 'Correspondence-sdg-eg-reply',
  templateUrl: './sdg-eg-reply.component.html',
  styleUrls: ['./sdg-eg-reply.component.css']
})
export class SdgEgReplyComponent implements OnInit {
  showPreview = false;
  sdgegPreview = false;
  sdgEGList = [];
  selsdgegId = null
  @Input() businessData: FormGroup;
  @Input() isSubmit = false;
  @Input() masterLetter;
  constructor(
    private correspondenceService: CorrespondenceService,
  ) { }

  ngOnInit() {
    this.getAllSDGEG();
  }
  selectSDGEG(event){
      this.showPreview = true;
      this.selsdgegId = event;
  }
  getAllSDGEG(){
    this.correspondenceService.getAllSDGEG(this.masterLetter).subscribe((res: any) => {
      if(res && res.content) {
        this.sdgEGList = res.content.filter((el) => el.stage === 'CREATED');
      }
    });
  }
}
