import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PmbrCommonService } from '../../shared/services/pmbr-common.service';

@Component({
  selector: 'pmbr-bill-register-list',
  templateUrl: './bill-register-list.component.html',
  styleUrls: ['./bill-register-list.component.css']
})
export class BillRegisterListComponent implements OnInit {
  tempRegisteredBills: any = [];
  registeredBills: any = [];
  search = null;
  viewLinks = false;
  colCheckboxes = [
    { id: 0, label: 'Name of Bill', check: true, disable: false },
    { id: 1, label: 'Bill No', check: true, disable: false },
    { id: 2, label: 'Honable Member', check: true, disable: false },
    { id: 3, label: 'File No', check: true, disable: false },
    { id: 4, label: 'Date of Pre', check: true, disable: false },
    { id: 5, label: 'Minister', check: true, disable: false },
    { id: 6, label: 'status', check: true, disable: false },

  ];
  constructor(private router: Router,  
    private pmbrCommonService: PmbrCommonService,) { }

    disableCheckBox() {
      let count = 0;
      for (const box of this.colCheckboxes) {
        if (box.check) {
          count++;
        }
      }
  
      if (count === 6) {
        for (const box of this.colCheckboxes) {
          if (!box.check) {
            box.disable = true;
          }
        }
      } else {
        for (const box of this.colCheckboxes) {
          box.disable = false;
        }
      }
    }
  ngOnInit() {
    this.getRegisteredBills();
  }
  searchList() {
    if (this.search) {
      this.registeredBills = this.tempRegisteredBills.filter(
        (element) =>
          (element.pmBill.title &&
            element.pmBill.title
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.pmBill.billNumber &&
            element.pmBill.billNumber
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.memberName &&
            element.memberName
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.pmBill.fileNumber &&
            element.pmBill.fileNumber
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
          (element.pmBill.status &&
            element.pmBill.status
              .toLowerCase()
              .includes(this.search.toLowerCase()))
      );
    } else {
      this.registeredBills = this.tempRegisteredBills;
    }
  }
  

 
 
  sort(sort: { key: string; value: string }): void {
    const data = this.tempRegisteredBills.filter((item) => item);
    if (sort.key && sort.value) {
      this.registeredBills = data.sort((a, b) =>
        sort.value === "ascend"
          ? a[sort.key!].toLowerCase() > b[sort.key!].toLowerCase()
            ? 1
            : -1
          : b[sort.key!].toLowerCase() > a[sort.key!].toLowerCase()
            ? 1
            : -1
      );
    } else {
      this.registeredBills = data;
    }
  }
  
  viewBill(id) {
    this.router.navigate(['business-dashboard/pmbr/bill-register-view/', id]);
  }
  getRegisteredBills(){
    this.pmbrCommonService.registeredBills().subscribe((Res) => {
      this.registeredBills = this.tempRegisteredBills = Res;
      // console.log( this.registeredBills);
  });
} 
viewFile(id) {
  this.router.navigate(['business-dashboard/pmbr/file-view/', id]);
}
}
