import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { AuthService } from './shared/services/auth.service';
@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit {
  constructor(
    private service: AuthService,
    private router: Router) {}
  time = new Date();
  assemblyandsession: any;
  ngOnInit() {
    setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.getCurrentAssemlySession();
    this.redirectLoginPage();
    // if(!localStorage.getItem('ls_inhouse'))
    // {
    //   localStorage.setItem('ls_inhouse', 'no');
    // }
  }
  getCurrentAssemlySession() {
    this.service.setAssemblyandSession().subscribe((Res) => {
        this.assemblyandsession = Res;
      });
    }

    redirectLoginPage() {
      this.service.getSpeakerIp().pipe(catchError(err => this.router.navigate(['/auth'])))
      .subscribe((res: any) => {
        const speakerIp = res.ipAddress;
        this.getLocation(speakerIp);
      });
    }
  
    getLocation(ip) {
      const body = {
        speakerIpAddress: ip
      };
      this.service.getLoginLocation(body).pipe(catchError(err => this.router.navigate(['/auth'])))
      .subscribe((res: any) => {
            if (res.dashBoard === 'IN_HOUSE') {
              this.router.navigate(['/auth/bio']);
            } else {
              this.router.navigate(['/auth']);
            }
      });
    }
}
