import { Component, OnInit, ViewChild,
  ElementRef } from '@angular/core';
import * as jsPdf from "jspdf";
import "jspdf-autotable";
@Component({
  selector: 'committee-committee-chart',
  templateUrl: './committee-chart.component.html',
  styleUrls: ['./committee-chart.component.scss']
})
export class CommitteeChartComponent implements OnInit {
  @ViewChild("htmlData", { static: false }) htmlData: ElementRef;
  printable = false;
  constructor() { }

  ngOnInit() {
  }
  public openPDF(): void {
    let neVal = this.htmlData.nativeElement.querySelectorAll(".table_blkp");
    let doc = new jsPdf("p", "pt");
    let pdf;
    let i = 0;
    let totalCount = neVal.length;
    doc.autoTable({ html: "#head1" });
    neVal.forEach(function (value) {
      doc.autoTable({ html: "#head_" + i });
      doc.autoTable({ html: "#table_" + i });
      i++;
      if (i === totalCount) {
       
        doc.output("dataurlnewwindow");
      }
    });
  }

  public downloadPDF(): void {
    let DATA = this.htmlData.nativeElement;
    let doc = new jsPdf("p", "pt", "a4");
    let handleElement = {
      "#editor": function (element, renderer) {
        return true;
      },
    };
    doc.fromHTML(DATA.innerHTML, 30, 30, {
      width: 300,
      elementHandlers: handleElement,
    });
    doc.save("angular-demo.pdf");
  }
  cancelPrint() {
    this.printable = false;
  }
  printableScreen() {
    this.printable = true;
  }
 

}
