import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';
@Component({
  selector: 'pmbr-bill-register-view',
  templateUrl: './bill-register-view.component.html',
  styleUrls: ['./bill-register-view.component.css']
})
export class BillRegisterViewComponent implements OnInit {
  billId;
  registeredBill: any = [];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private pmbrCommonService: PmbrCommonService) { 
    this.billId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.getRegisteredBill();
  }
getRegisteredBill(){
  const body = {
    billId: this.billId
  }
  this.pmbrCommonService.getregisteredBillById(body).subscribe((Res) => {
    this.registeredBill = Res;
    console.log(this.registeredBill);
  });
}
}
