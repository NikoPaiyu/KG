import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { VotingService } from '../../voting/shared/services/voting.service';
import {UserDetails} from '../../voting/shared/models/userDetails';
@Component({
  selector: 'app-vote-results',
  templateUrl: './vote-results.component.html',
  styleUrls: ['./vote-results.component.scss']
})
export class VoteResultsComponent implements OnInit {
  users: UserDetails[] = [];
  allUsers: UserDetails[] = [];
 
  
  constructor(private  voteService:VotingService) { }

  ngOnInit() {
    
  this.getAllUsers();
  }

getAllUsers() {
  this.voteService.getUsers().subscribe(data => {
    this.allUsers = data;
    this.users = data;
    console.log(this.users)
  });
}

}
