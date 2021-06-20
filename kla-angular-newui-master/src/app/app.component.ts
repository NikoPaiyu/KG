import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/shared/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserData } from "src/app/auth/shared/models";
import { TranslateService } from "@ngx-translate/core";
import { LocationStrategy } from "@angular/common";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  currentUser: UserData;
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    public router: Router,
    private route: LocationStrategy
  ) {
    
    if (this.translate.getDefaultLang()) {
      let id = this.translate.getDefaultLang();
      let lang:any;
      this.translate.setDefaultLang(id);
      
      if(id === 'mal')
        lang = 'ml'; 
      else if(id === 'kan')
        lang = 'kn';
      else if(id === 'hin')
        lang = 'hi';
      else if(id === 'tam')
        lang = 'ta';
      
      document.documentElement.lang = lang;
    } else {
      this.translate.setDefaultLang("mal");
      document.documentElement.lang = 'ml';
    }
  }
  title = "kla";
  ngOnInit() {
    if (this.authService.getToken()) {
      this.authService.getSessionData();
    } else {
      if (!this.route.path().includes("auth")) {
        this.router.navigate(["/auth"]);
      }
    }
  }
}

