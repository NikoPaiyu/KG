import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from 'src/app/auth/shared/services/auth.service';
import { Router } from "@angular/router";
import {VoteSocketService} from '../shared/services/vote-socket.service';
import {ActivatedRoute} from "@angular/router";
import { NzModalService } from "ng-zorro-antd";
@Component({
  selector: "app-voting-result",
  templateUrl: "./voting-result.component.html",
  styleUrls: ["./voting-result.component.scss"]
})
export class VotingResultComponent implements OnInit {
  @Input() votingResults;
  private seats: any[] = [];
  question: String = "";
  totalCount: number = 0;
  yesCount: number = 0;
  noCount: number = 0;
  notaCount: number = 0;
  yesPercentage: number;
  noPercentage: number;
  notaPercentage: number;
  constructor(
    public authService: AuthService,
    private router: Router,
    private modalService: NzModalService,
    //private VoteSocketService:VoteSocketService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.setVotingResultsCalculations();
  }

  ngAfterViewChecked() {
    this.setSeatColor();
  }
  setVotingResultsCalculations() {
    this.question = this.votingResults.description;
    this.totalCount = this.votingResults.totalVotes;
    this.yesCount = this.votingResults.totalYes;
    this.noCount = this.votingResults.totalNo;
    this.notaCount = this.votingResults.totalAbstain;
    this.yesPercentage = Math.round((this.yesCount / this.totalCount) * 100);
    this.noPercentage = Math.round((this.noCount / this.totalCount) * 100);
    this.notaPercentage = Math.round((this.notaCount / this.totalCount) * 100);
  }
  setSeatColor() {
    this.seats = this.votingResults.voteSeat;
    if (this.seats) {
      this.seats.forEach(obj => {
        let elt;
        elt = document.getElementById(obj.seatNumber);
        if (elt) {
          if (obj.selectedOption === "YES" && parseInt(this.authService.getCurrentUser().userId) == obj.userId)
            elt.classList.add("st12");
          else if (obj.selectedOption === "YES")
            elt.classList.add("yes");
          else if (obj.selectedOption === "NO" && parseInt(this.authService.getCurrentUser().userId) == obj.userId)
            elt.classList.add("st13");
          else if (obj.selectedOption === "NO")
            elt.classList.add("no");
          else if (obj.selectedOption === "ABSTAIN" && parseInt(this.authService.getCurrentUser().userId) == obj.userId)
            elt.classList.add("st14");
          else if (obj.selectedOption === "ABSTAIN")
            elt.classList.add("abstain");
        }
      });
    }
  }

  getallvotereport(){
    this.modalService.closeAll();

   // this.VoteSocketService.closemodal();
  //  this.router.navigate(["dashboard/vote-results"]);

    this.router.navigateByUrl(this.router.createUrlTree(['dashboard/current-business'], {
      }), { skipLocationChange: true });
      setTimeout(() => this.router.navigate(["dashboard/vote-results"], {
      relativeTo: this.route.parent
      }));
      
  }
}
