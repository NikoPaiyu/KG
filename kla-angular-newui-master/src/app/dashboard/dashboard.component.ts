import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/shared/services/auth.service";
import { SpeakerChatComponent } from "./speaker-chat/speaker-chat.component";
import { NzDrawerService } from "ng-zorro-antd";
import { EBookComponent } from "./e-book/e-book.component";
import { UserData } from "../auth/shared/models";
import { VoteSocketService } from "./voting/shared/services/vote-socket.service";
import { SpeakerNoteService } from "./shared/services/speaker-note.service";
import { ChatSocketService } from "./shared/services/chat-socket.service";
import { ChatService } from "./shared/services/chat.service";
import { CurrentBusinessService } from "./current-business/shared/service/current-business.service";
import { NotificationCustomService } from "../shared/services/notification.service";
import { TranslateService } from "@ngx-translate/core";
import { Route, Router, ActivatedRoute } from "@angular/router";
import { AttendanceService } from "./attendance/shared/services/attendance.service";
import { SpeakerRBSService } from './shared/services/speaker-rbs.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';


@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  public userData: UserData = new UserData();
  time = new Date();
  selectedLanguage = 'Malayalam';
  neMessageFlag = false;
  messageCount = 0;
  count;
  chatSocketOpened = false;
  voteSocketOpened = false;
  speakerSocketOpened = false;
  speakerNoteOpened = false;
  handRiseCount = 0;
  temparray = [];
  handRiseNotificationBar = false;
  isGovernor = false;
  isMinister = false;
  handRiseRequestDetailList = [];
  private wasInside = false;
  buttonList: any;
  rbsPermission;
  rbsroles;
  assemblyandsession; any;

  langSelectId: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private voteSocketService: VoteSocketService,
    private drawerService: NzDrawerService,
    private speakerService: SpeakerNoteService,
    private chatService: ChatSocketService,
    private chatMessageService: ChatService,
    private currentBusinessServise: CurrentBusinessService,
    private notify: NotificationCustomService,
    private translate: TranslateService,
    private attendance: AttendanceService,
    private rbsService: SpeakerRBSService,
    private route: ActivatedRoute,

  ) {



    this.langSelectId = this.translate.getDefaultLang();
    this.authService.currentUserSubject.subscribe(user => {
      this.userData = user;


      if (user.userId && !this.chatSocketOpened) {
        this.chatSocketOpened = true;
        this.getCurrentUserUnreadMessageCount(user.userId);
        this.chatService.initializeWebSocketConnection(user.userId);
      }
      if (
        user.userId &&
        user.authorities.includes("MLA") &&
        !this.voteSocketOpened
      ) {
        this.voteSocketOpened = true;
        this.voteSocketService.initializeWebSocketConnection();
      }
      // if (
      //   user.userId &&
      //   (user.authorities.includes("speaker") ||
      //     user.authorities.includes("secretary") ||
      //     user.authorities.includes("privateSecretaryToSpeaker") ||
      //     user.authorities.includes("newActivespeaker"))&&
      //   !this.speakerSocketOpened
      // ) {
      //   this.speakerSocketOpened = true;
      //   this.speakerService.initializeWebSocketConnection();
      //   this.currentHandRiseCount();
      //   this.loadRBSPermissions();
      //    this.handRiseRequestDetails_Socket();
      // }
      if (
        user.userId &&
        user.authorities.includes("speakerNote") &&
        !this.speakerNoteOpened
      ) {
        this.speakerNoteOpened = true;
        // this.router.navigate(["dashboard/current-speakernote/live"]);
        //this.speakerService.initializeSpeakerNoteSocketConnection();
      }
      if (this.userData.authorities.includes("minister")) {
        this.isMinister = true;
      }
      if (user.userId) {
        this.rbsService.getrbsrole(user.userId).subscribe((res: any) => {
          this.rbsroles = res.find(roleName => roleName.role.name == "Speaker" || roleName.role.name == "NewActiveSpeaker" || roleName.role.name == "PrivateSecretaryToSpeaker");
          this.loadpermissions();
        })
      }
    });

    this.subscribeTomessages();
    this.governerPageLocalisation();
    this.attendance.initiateAttendance();
    this.speakerService.initializedocchangenotificationsocket();


  }

  navigate(url) {
    this.router.navigateByUrl(this.router.createUrlTree(['current-business'], {
      relativeTo: this.route.parent
    }), { skipLocationChange: true });
    setTimeout(() => this.router.navigate([url], {
      relativeTo: this.route.parent
    }));

  }
  loadpermissions() {

    if (this.rbsroles && !this.speakerSocketOpened) {
      this.speakerSocketOpened = true;
      this.speakerService.initializeWebSocketConnection();
      this.currentHandRiseCount();
      this.handRiseRequestDetails_Socket();
      this.loadRBSPermissions();

    }
  }
  loadRBSPermissions() {
    this.rbsService
      .getQuestionPermissions(this.userData.userId)
      .subscribe((response) => {
        this.rbsPermission = response;
        this.buttonList = this.rbsService.getButtonsInList();;

      })

  }

  subscribeTomessages() {

    this.chatService.messages.subscribe(messages => {
      if (messages && messages.id && this.userData.userId == messages.sendTo) {
        this.neMessageFlag = true;
        console.log(messages)
      }
    });
  }
  ngOnInit() {
    if (this.userData && this.userData.rbsRoleMenu) {
      this.setOpenValue();
    }
    this.getCurrentAssemlySession();
    (<any>window).pdfWorkerSrc = "../../assets/pdf/pdf.worker.min.js";
    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }
  showEbook(): void {
    const drawerRef = this.drawerService.create<EBookComponent, string>({
      nzContent: EBookComponent
    });
  }
  onLogOut() {
    this.authService.logout();
    this.translate.use("mal");
  }

  onVote() {
    // this.voteService.displayVotingResult();
    // this.voteService.displayCastVoteModal();
  }
  onChat(): void {
    this.neMessageFlag = false;
    const drawerRef = this.drawerService.create<
      SpeakerChatComponent,
      { characters; tempStoredCharacters },
      string
    >({
      nzTitle: this.translate.instant('dashboard.chat.chat'),
      nzContent: SpeakerChatComponent,
      nzBodyStyle: { height: "calc(100% - 55px)", overflow: "hidden" },
      nzMaskClosable: false,
      nzWidth: "450",
      nzContentParams: {
        characters: [],
        tempStoredCharacters: []
      }
    });

    drawerRef.afterOpen.subscribe(() => { });

    drawerRef.afterClose.subscribe(data => {
      this.neMessageFlag = false;
    });
  }

  ngOnDestroy() {
    this.voteSocketService.disconnect();
    this.speakerService.disconnect();
    this.chatService.disconnect();
    this.notify.clearAll();
    this.chatService.messages.next("");
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

  returnMenuName(menu) {
    this.langSelectId = this.translate.getDefaultLang();
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

  getMenuIcon(url) {
    if (url == "current-business/live-screen")
      return "../../assets/img/menu-icons/Business.svg";
    else if (url == "summary") return "../../assets/img/menu-icons/Summary.svg";
    else if (url == "budget") return "../../assets/img/menu-icons/Budget.svg";
    else if (url == "rules")
      return "../../assets/img/menu-icons/RulesandInstructions.svg";
    else if (url == "lob-view/view")
      return "../../assets/img/menu-icons/Table of Contents.svg";
    else if (url == "questions")
      return "../../assets/img/menu-icons/Questions & Answers.svg";
    else if (url == "document-reader")
      return "../../assets/img/menu-icons/File upload.svg";
    else if (url == "seat/layout")
      return "../../assets/img/menu-icons/My Things.svg";
    else if (url == "runningnote/view")
      return "../../assets/img/menu-icons/Table of Contents.svg";
    else if (url == "documents")
      return "../../assets/img/menu-icons/Document.svg";
    else if (url == "vote-results")
      "../../assets/img/menu-icons/Document.svg"
    else return "../../assets/img/menu-icons/Summary.svg";

  }

  getCurrentUserUnreadMessageCount(userId) {
    if (userId) {

      this.chatMessageService
        .getUserUnreadMessageCount(userId)
        .subscribe(res => {
          if (res && res > 0) {
            this.neMessageFlag = true;
            this.count = res;
          }
        });
    }
  }
  handRiseClick() {
    this.currentBusinessServise
      .handRiseHandler(this.userData.userId)
      .subscribe(res => {
        this.notify.showSuccess(this.translate.instant('dashboard.notification.success'),
          this.translate.instant('dashboard.notification.seekpermission'));
      });
  }

  currentHandRiseCount() {
    this.currentBusinessServise
      .handRiseRequestDetails()
      .subscribe((res: any) => {
        this.currentBusinessServise.messageBody.subscribe((res: any) => {
          this.handRiseRequestDetailList = res;
          this.handRiseCount = res.length;
          this.temparray = res;
        });
      });
  }

  handRiseRequestDetails_Socket() {
    this.speakerService.supplimentaryQustionList.subscribe(response => {
      if (response.ownerName) {
        if (
          !this.temparray.some(item => item.requestId == response.requestId)
        ) {
          this.temparray.push(response);
          this.notify.showInformation(
            "Info",
            "ബഹു: " + response.ownerName + " അനുമതി തേടിയിരിക്കുന്നു"
          );
          this.speakerService.responseSupplimentaryQuestion.next([]);
        }
        this.handRiseCount = this.temparray.length;
      }
    });
  }
  clearAllHandRiseRequest() {
    this.currentBusinessServise.clearAllHandRiseRequest().subscribe(res => {
      this.handRiseRequestDetailList = [];
      this.handRiseNotificationBar = false;
      this.currentBusinessServise.responseMessage.next(
        this.handRiseRequestDetailList
      );
    });
  }
  seeAllClick() {
    this.handRiseNotificationBar = false;
  }
  openHandRiseNotificationBar() {
    this.handRiseNotificationBar = !this.handRiseNotificationBar;
  }
  governerPageLocalisation() {
    if (this.userData.authorities.includes("governor")) {
      this.translate.use("en");
      this.isGovernor = true;
    } else {
      this.translate.use("mal");
      this.isGovernor = false;
    }
  }
  notAvailable() {
    this.notify.showInformation("Info", "ഈ സൗകര്യം ഇപ്പോൾ ലഭ്യമല്ല");
  }

  selcetLanguage() {
    if (this.selectedLanguage === 'English') {
      document.documentElement.lang = 'en';
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
    if (this.selectedLanguage === 'Malayalam') {
      document.documentElement.lang = 'ml';
      this.translate.setDefaultLang('mal');
      this.translate.use('mal');
    }
  }

  getCurrentAssemlySession() {
    this.authService.setAssemblyandSession().subscribe((Res) => {
      this.assemblyandsession = Res;
    });
  }

  setOpenValue() {
    this.userData.rbsRoleMenu.forEach(menu => {
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
      this.userData.rbsRoleMenu.forEach(menu => {
        if (menu.id !== menuId) {
          menu.level1 = false;
        }
      });
    } else if (level === 'level2') {
      this.userData.rbsRoleMenu.find(menu => menu.id === menuId).children.forEach(submenu => {
        if (submenu.id !== subMenuId) {
          submenu.level2 = false;
        }
      });
    } else if (level === 'level3') {
      this.userData.rbsRoleMenu.find(menu => menu.id === menuId)
      .children.find(submenu => submenu.id === subMenuId).children.forEach(subSubmenu => {
        if (subSubmenu.id !== subSubMenuId) {
          subSubmenu.level3 = false;
        }
      });
    }
  }
}
