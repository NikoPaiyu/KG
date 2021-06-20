import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  currentUser: UserData;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }
}
