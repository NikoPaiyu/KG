import { Component, OnInit } from '@angular/core';
import { differenceInCalendarYears } from 'date-fns';
import { FileService } from 'src/app/shared/services/file.service';
import { CalenderofsittingService } from 'src/app/business-dashboard/calender-of-sitting/shared/services/calenderofsitting.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-current-number-list',
  templateUrl: './current-number-list.component.html',
  styleUrls: ['./current-number-list.component.scss']
})
export class CurrentNumberListComponent implements OnInit {
  assemblyList:any=[];
  assemblyId=null;
  sectionId=null;
  search=null;
  date=null;
  newYear=null;
  klaSections:any=[];
  currentList:any=[];
  tempCurrentList:any=[];
  constructor(private fileService : FileService,
              private cos: CalenderofsittingService,
              private datepipe: DatePipe) { }

  ngOnInit() {
    this.getAssembly();
    this.getKlaSections();
    this.getCurrentNumberList();
  }
  getKlaSections(){
    this.fileService.getKlaSections().subscribe((res:any)=>{
      this.klaSections = res;
    })
  }
  getCurrentNumberList(){
    if(this.date){
       this.newYear = this.date.getFullYear();
    }
    else {
      this.newYear = null;
    }
    const body = {
      assemblyId:this.assemblyId,
      sectionId:this.sectionId,
      createdDate: this.datepipe.transform(this.date, 'yyyy-MM-dd')
    }
    this.fileService.currentNumberList(body).subscribe((res:any)=>{
      this.currentList = this.tempCurrentList=res;
    })
  }

  getAssembly() {
    this.cos.getAllAssembly().subscribe((res: any) => {
      this.assemblyList = res;
    });
  }
  onSearch(){
    if (this.search) {
      this.currentList = this.tempCurrentList.filter(
        (element) =>
          (element.currentNumber &&
            element.currentNumber
              .toLowerCase()
              .includes(this.search.toLowerCase())) ||
              (element.subject &&
                element.subject
                  .toLowerCase()
                  .includes(this.search.toLowerCase()))

      );
    } else {
      this.currentList = this.tempCurrentList;
    }
  }

}
