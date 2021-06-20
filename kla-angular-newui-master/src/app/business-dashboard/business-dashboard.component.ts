import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/shared/services/auth.service";
import { UserData } from "../auth/shared/models";
import { NotificationCustomService } from "../shared/services/notification.service";
import { QuestionMenus } from "./question/question.menus";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
import { take } from "rxjs/operators";

@Component({
  selector: "app-business-dashboard",
  templateUrl: "./business-dashboard.component.html",
  styleUrls: ["./business-dashboard.component.scss"],
})
export class BusinessDashboardComponent implements OnInit {
  public currentUser: UserData = new UserData();
  langSelectId: any;
  langSelectName: any;
  notificationVisible = false;
  objectKeys = Object.keys;
  localizeLangList = new Array();

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private notify: NotificationCustomService,
    private questionMenus: QuestionMenus,
    private route: ActivatedRoute
  ) {
    this.authService.currentUserSubject.pipe(take(3)).subscribe(
      (user) => {
        console.log(user);
        this.currentUser = user;
        if(this.currentUser.menu){
          this.currentUser.menu = [];
          this.currentUser.menu.push(this.getAuctionMenus());
        }
      }
    );
    //sessionStorage.setItem('ls_currentuser', JSON.stringify(this.currentUser));
    this.localizeLangList['en'] = 'English';
    this.localizeLangList['mal'] = 'മലയാളം';
    // this.localizeLangList['kan'] = 'ಕನ್ನಡ';
    // this.localizeLangList['hin'] = 'हिंदी';
    // this.localizeLangList['tam'] = 'தமிழ்';
  }
  ngOnInit() {

    if (this.currentUser && this.currentUser.menu) {
      this.setOpenValue();
    }
    this.langSelectId = this.translate.getDefaultLang();
    this.langSelectName = this.localizeLangList[this.langSelectId];
    this.translate.setDefaultLang(this.langSelectId);
    this.translate.use(this.langSelectId);
    document.documentElement.lang = 'en';
  }

  getAuctionMenus(){
    const menu = {
      id : 299,
      level: 499,
      level1: true,
      name: 'Auction Process',
      type: 'PARENT',
      children : [
        {
          id : 230,
          level: 90,
          level1: true,
          name: 'Disposal Dashboard',
          type: 'BUTTON',
          menuUri : '/business-dashboard/auction/disposal'
        },
        {
          id : 231,
          level: 91,
          level1: true,
          name: 'Auction Dashboard',
          type: 'BUTTON',
          menuUri : '/business-dashboard/auction/auction'
        },
        {
          id : 232,
          level: 92,
          level1: true,
          name: 'Delivery Note Dashboard',
          type: 'BUTTON',
          menuUri : '/business-dashboard/auction/deliveryNote'
        },
        {
          id : 233,
          level: 93,
          level1: true,
          name: 'Voucher Dashboard',
          type: 'BUTTON',
          menuUri : '/business-dashboard/auction/voucher'
        },
        {
          id : 234,
          level: 94,
          level1: true,
          name: 'Auction Register Dashboard',
          type: 'BUTTON',
          menuUri : '/business-dashboard/auction/auctionRegister'
        }
      ]
    }
    return menu;
  }


  onLogOut() {
    this.notify.clearAll();
    this.authService.logout();
  }

  reroute(url) {
    console.log("http://localhost:4700/" + url);
    this.router.navigate(["http://localhost:4700/" + url]);
  }

  useLanguage(id, name) {
    this.langSelectId = id;
    this.langSelectName = name;
    this.translate.setDefaultLang(id);
    this.translate.use(id);
    let lang: any;

    if (id === 'en')
      lang = 'en';
    else if (id === 'mal')
      lang = 'ml';
    else if (id === 'kan')
      lang = 'kn';
    else if (id === 'hin')
      lang = 'hi';
    else if (id === 'tam')
      lang = 'ta';

    document.documentElement.lang = 'en';
  }
  seeAllNotification() {
    this.notificationVisible = false;
    this.router.navigate(["/dashboard/notification"]);
  }
  notificationButtonClick() {
    this.notificationVisible = true;
  }
  navigate(url) {
    this.router.navigateByUrl(this.router.createUrlTree(['home'], {
      relativeTo: this.route.parent
    }), { skipLocationChange: true });
    setTimeout(() => this.router.navigate([url], {
      relativeTo: this.route.parent
    }));

  }

  returnMenuName(menu) {
    if (this.langSelectId === 'en') {
      return menu.name;
    } else if (this.langSelectId === 'mal') {
      return menu.nameMl;
    } else if (this.langSelectId === 'kan') {
      return menu.nameKn;
    } else if (this.langSelectId === 'hin') {
      return menu.nameHi;
    } else if (this.langSelectId === 'tam') {
      return menu.nameTa;
    }
  }
  retunUserName(data) {
    if (this.langSelectId === 'en') {
      if (data.fullName.includes('Smt')) {
        return data.fullName.replace('Smt', '').replace('.', ' ');
      } else {
        return data.fullName.replace('Shri', '').replace('.', ' ');
      }
    } else {
      if (data.malayalamFullName) {
        if (data.fullName.includes('Smt')) {
          return data.malayalamFullName.replace('ശ്രീമതി', '').replace('.', ' ');
        } else {
          return data.malayalamFullName.replace('ശ്രീ', '').replace('.', ' ');
        }
      } else {
        if (data.fullName.includes('Smt')) {
          return data.fullName.replace('Smt', '').replace('.', ' ');
        } else {
          return data.fullName.replace('Shri', '').replace('.', ' ');
        }
      }
    }
  }

  setOpenValue() {
    this.currentUser.menu.forEach(menu => {
      menu.level1 = false;
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach(submenu => {
          submenu.level2 = false;
          if (submenu.children && submenu.children.length > 0) {
            submenu.children.forEach(subsubmenu => {
              subsubmenu.level3 = false;
            });
          }
        });
      }
    });
  }

  openHandler(menuId, subMenuId, subSubMenuId, level): void {
    if (level === 'level1') {
      this.currentUser.menu.forEach(menu => {
        if (menu.id !== menuId) {
          menu.level1 = false;
        }
      });
    } else if (level === 'level2') {
      this.currentUser.menu.find(menu => menu.id === menuId).children.forEach(submenu => {
        if (submenu.id !== subMenuId) {
          submenu.level2 = false;
        }
      });
    } else if (level === 'level3') {
      this.currentUser.menu.find(menu => menu.id === menuId)
      .children.find(submenu => submenu.id === subMenuId).children.forEach(subSubmenu => {
        if (subSubmenu.id !== subSubMenuId) {
          subSubmenu.level3 = false;
        }
      });
    }
  }
}
