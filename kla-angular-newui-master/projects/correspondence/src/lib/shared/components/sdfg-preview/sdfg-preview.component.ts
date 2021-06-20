import { Component, OnInit, Input } from '@angular/core';
import { CorrespondenceService } from "../../services/correspondence.service";

@Component({
  selector: 'budget-sdfg-preview',
  templateUrl: './sdfg-preview.component.html',
  styleUrls: ['./sdfg-preview.component.scss']
})
export class SdfgPreViewComponent implements OnInit {
  @Input() sdfgId;
  @Input() selsdgegId;
  sdfgListById;
  
  constructor(private correspondence: CorrespondenceService) {}
  ngOnInit() {
    if (this.sdfgId) {
      this.getSavedSDFG()
    }
    if(this.selsdgegId){
      this.getSDGEGById()
    }
  }
  getSavedSDFG() {
    this.correspondence.getSDFGByLinesId(this.sdfgId).subscribe((res: any) => {
      this.sdfgListById = (res && res.lines) ? res.lines : [];
    });
  }
  getSDGEGById(){
    this.correspondence.getSDGEGById(this.selsdgegId).subscribe((res: any) => {
      this.sdfgListById =  (res && res.lines) ? res.lines : [];
      console.log(this.sdfgListById);
    });
  }
}
