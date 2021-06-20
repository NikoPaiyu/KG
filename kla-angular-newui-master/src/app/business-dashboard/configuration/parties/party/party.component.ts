import { Component, OnInit, Input} from '@angular/core';
import { AssemblyManagementService } from '../../shared/service/assembly-management.service';


@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit {
 allParties: any = [];
 tempParties: any = [];
  search=null;


  constructor(private assembly: AssemblyManagementService) {}

  getAllParty(){
    this.assembly.getAllParties().subscribe((res:any)=>{
      this.allParties = this.tempParties = res;
    })
  }
  ngOnInit() {
    this.getAllParty();
  }
  onSearch(){
    if(this.search) {
      this.allParties = this.tempParties.filter(
        (element) =>
        (element.kerelaPoliticalPartyName && 
          element.kerelaPoliticalPartyName
          .toLowerCase()
          .includes(this.search.toLowerCase()))
      )
    }
  }
}
