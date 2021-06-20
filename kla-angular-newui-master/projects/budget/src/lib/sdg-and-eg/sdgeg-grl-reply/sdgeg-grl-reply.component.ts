import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { SdgEgService } from '../../shared/services/sdg-eg.service';
@Component({
  selector: 'budget-sdgeg-grl-reply',
  templateUrl: './sdgeg-grl-reply.component.html',
  styleUrls: ['./sdgeg-grl-reply.component.css']
})
export class SdgegGrlReplyComponent implements OnInit {
  @Input() sectionMode;
  @Input() grlReply;
  content;
  editMode = false;
  constructor(private notify: NzNotificationService,
    private SdgEgService: SdgEgService,
    ) { }
  
  ngOnInit() {debugger;
   this.content = this.grlReply.editedContent;
   console.log(this.sectionMode);
  }
  onSave(){
    if(!this.content){
      this.notify.create('warning', 'Content Required!!!', '');
      return;
    }
   let body =  {
      content: this.content,
      letterId: this.grlReply.id
    }
    this.SdgEgService.editGRLBulletin(body).subscribe((res: any) => {
      this.notify.create('success', 'Success', 'Success');
      this.editMode=false;
    });
  }
  onCancel(){
    this.editMode=false;
    this.content = this.grlReply.editedContent;
  }
}
