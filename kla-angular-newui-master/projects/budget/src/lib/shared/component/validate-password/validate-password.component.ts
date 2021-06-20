import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { BudgetCommonService } from '../../services/budgetcommon.service';

@Component({
  selector: 'budget-validate-password',
  templateUrl: './validate-password.component.html',
  styleUrls: ['./validate-password.component.css']
})
export class ValidatePasswordComponent implements OnInit {
  password = null;
  @Input() id;
  @Input() type;
  @Input() budgetDto;
  @Output() onCancel = new EventEmitter<any>();

  constructor(
    private router: Router,
    // private route: ActivatedRoute,
    private notify: NzNotificationService,
    private common: BudgetCommonService,
  ) { }

  ngOnInit() {
    this.type == 'budgetDocument' ? this.type = 'DOC'  : this.type ='SPEECH';
  }
  proceed(){
    if(this.password == null){
      this.notify.create("error","Error",'Please enter Password'); 
      return;
    }
     this.common.validatePassword(this.budgetDto.id,this.type,this.password).subscribe((res:any) => {
      if(res.length != 0){
        this.onCancel.emit(res);
        this.notify.create("Succes","Success",'');
      }else{
        this.notify.create("error","Error",'Wrong Password'); 
      }  
     })
  }
  cancel(){ 
    this.onCancel.emit(null);
  }
}
