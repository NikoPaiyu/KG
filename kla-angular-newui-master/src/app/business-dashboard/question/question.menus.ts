import { Injectable } from "@angular/core";
import { AuthService } from "src/app/auth/shared/services/auth.service";
import { UserData } from "src/app/auth/shared/models";

@Injectable({
  providedIn: "root",
})
export class QuestionMenus {
  currentUser: UserData;
  roleName = "";
  userId;
  constructor(private authService: AuthService) {
    this.authService.currentUserSubject.subscribe((user) => {
      this.currentUser = user;
      this.roleName = this.currentUser.authorities[0];
      this.userId = this.currentUser.userId;
    });
  }
  getMenus(usermenu) {
    if (!this.roleName) {
      return [];
    } else if (this.roleName == "admin") {
      return this._getAdminSubMenu(usermenu);
    } else {
      return this._getSubMenus(usermenu);
    }
  }
  getRoles() {
    return [
      "MLA",
      "assistant",
      "sectionOfficer",
      "underSecretary",
      "deputySecretary",
      "jointSecretary",
      "specialSecretary",
      "additionalSecretary",
      "secretary",
      "speaker",
      "Department",
      "officeAssistant",
    ];
  }
  _getSubMenus(menus) {
    const roles = this.getRoles();
    if (this.currentUser.authorities.indexOf("speaker") !== -1) {
      menus = this._getSpeakerSubMenu();
      return menus;
    }
    if (this.currentUser.authorities.indexOf("minister") !== -1) {
      menus = this._getMinisterSubMenu();
      return menus;
    }
    if (this.currentUser.authorities.indexOf("deputySpeaker") !== -1) {
      menus = this._getDeputySpeakerSubMenu();
      return menus;
    }
    if (this.currentUser.authorities.indexOf("MLA") !== -1) {
      menus = this._getMlaSubMenu();
      return menus;
    }
    switch (this.roleName) {
      case roles[0]:
        menus = this._getMlaSubMenu();
        break;
      case roles[1]:
        menus = this._getAssistantSubMenu();
        break;
      case roles[2]:
        menus = this._getSectionOffcerSubMenu();
        break;
      case roles[3]:
        menus = this._getUSSubMenu();
        break;
      case roles[4]:
        menus = this._getDSAndAboveSubMenu();
        break;
      case roles[5]:
        menus = this._getJSSubMenu();
        break;
      case roles[6]:
        menus = this._getDSAndAboveSubMenu();
        break;
      case roles[7]:
        menus = this._getDSAndAboveSubMenu();
        break;
      case roles[8]:
        menus = this._getSecretarySubMenu();
        break;
      case roles[10]:
        menus = this._getAnswerSectionSubMenu();
        break;
      case "minister":
        menus = this._getMlaSubMenu();
        break;
      case "speaker":
        menus = this._getSpeakerSubMenu();
        break;
      case "parliamentaryPartySecretary":
        menus = this._getPPOSubMenu();
        break;
      case "officeAssistant":
        menus = this._getOfficeAssistantSubMenu();
        break;
      case "sectionOfficer":
        menus = this._getAssistantSubMenu();
        break;
      case "deputySecretary":
        menus = this._getAssistantSubMenu();
        break;
      case "secretary":
        menus = this._getAssistantSubMenu();
        break;
      case "speaker":
        menus = this._getAssistantSubMenu();
        break;
      default:
        menus = this._getSOSubMenu();
        break;
    }
    return menus;
  }
  _getAdminSubMenu(adminmenu) {
    let newAdminMenu = [
      {
        name: "PortFolio Management",
        menuUri: ["question/question-portfolio-add"],
      },
      {
        name: "Settings",
        menuUri: ["question/question-clause-settings"],
      },
    ];
    newAdminMenu.forEach((element) => {
      adminmenu.push(element);
    });
    return adminmenu;
  }
  _getPPOSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dashboard"],
      },
      // {
      //   name: "Allotment of Days",
      //   menuUri: "",
      //   children: [
      //     { name: "Approved AOD", menuUri: ["aod/approved-aod"] }
      //   ],
      // },
      {
        name: "Calendar Of Sittings",
        menuUri: "",
        children: [
          { name: "Approved COS", menuUri: ["sitting/approved-cos"] },
        ],
      },
      {
        name: "Notice",
        menuUri: "",
        children: [
          {
            name: "Notices for Question",
            menuUri: ["question/question-create"],
          },
          { name: "Consents", menuUri: ["question/question-consent"] },
        ],
      },
      {
        name: "Configuration",
        menuUri: ["question/ppo-config"],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "Notices",
            menuUri: ["question/list-mla-ntc"],
          },
          {
            name: "Questions",
            menuUri: ["question/list-mla-qus"],
          },
          {
            name: "Short Notice Questions",
            menuUri: ["question/list-mla-snq"],
          }
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              }
            ]
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              }
            ]
          },
        ],
      }
    ];
  }
  _getUSSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      {
        name: "Allotment of Days",
        menuUri: "",
        children: [
          { name: "Allotment File List", menuUri: ["aod/aod-list"] },
          { name: "Approved AOD", menuUri: ["aod/approved-aod"] },
        ],
      },

      {
        name: "Minister groups",
        menuUri: "",
        children: [
          { name: "Minister groups", menuUri: ["aod/aod-ministergroup"] },
          { name: "Approved Minister Group", menuUri: ["aod/aod-ministergroup/approved"] }
        ],
      },

      {
        name: "Schedule Of Activity",
        menuUri: "",
        children: [
          { name: "Schedule Of Activity List", menuUri: ["soa/list"] },
          { name: "Approved SOA", menuUri: ["soa/approved"] }
        ],
      },
      {
        name: "Calendar Of Sittings",
        menuUri: "",
        children: [
          { name: "COS file list", menuUri: ["sitting/cos-list"] },
          { name: "Calendar Of Sittings", menuUri: ["sitting/approved-cos"] },
        ],
      },
      // {
      //   name: "Start Session",
      //   menuUri: "",
      //   children: [{ name: "Allotment Of Days", menuUri: ["aod/aod-create"] }],
      // },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
          {
            name: "View Admitted Notices",
            menuUri: ["question/apprv-list"],
          },
          {
            name: "Notices Withdrawn",
            menuUri: ["question/withdr-list"],
          },
          {
            name: "Disallowed Notices",
            menuUri: ["question/disallw-list"],
          },
          {
            name: "Pull Notices",
            menuUri: ["question/pull-list"],
          },
          {
            name: "All Notices",
            menuUri: ["question/all-list"],
          }
        ],
      },
      {
        name: "Ballot Related",
        menuUri: "",
        children: [
          {
            name: "Ballot Listing",
            menuUri: ["question/question-ballot-list"],
          },
          {
            name: "Perform Ballot",
            menuUri: ["question/question-perform-ballot"],
          },
          {
            name: "Starred Question Settings",
            menuUri: ["question/question-settings"],
          },
          {
            name: "Unstarred Question Settings",
            menuUri: ["question/question-unstarred"],
          },
        ],
      },
      {
        name: "Assurance",
        menuUri: "",
        children: [
          {
            name: "Draft Assurances",
            menuUri: ["question/draft-assurance"],
          },
          {
            name: "Assured List",
            menuUri: ["question/assured-list"],
          }
        ],
      },
      {
        name: "Setting Of Questions",
        menuUri: ["question/question-ballot-approve"],
      },
      {
        name: "Set to LOB",
        menuUri: ["question/question-settolob"],
      },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Short Notice Questions",
            menuUri: ["question/snq-list"],
          },
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Questions Withdrawn",
            menuUri: ["question/withdr-list-qus"],
          }
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          {
            name: "Delay Statement List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/delay-statement-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-delay-statement-list"]
              }
            ]
          },
          {
            name: "Answer Status List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/answer-status-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-answer-status-list"]
              }
            ]
          },
          {
            name: "Late Answer Bulletin",
            menuUri: "",
            children: [
              {
                name: "Bulletin For Action",
                menuUri: ["question/late-answer-bulletin"]
              },
              // {
              //   name: "Approved Bulletin",
              //   menuUri: ["question/approved-late-answer-bulletin"]
              // }
            ]
          }
        ],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              },
              {
                name: "Schedule of Activity",
                menuUri: ["question/qstn-soactivity-rpt"]
              },
            ]
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
              // { name: "Answer Status", menuUri: "" },
              // { name: "Resume of Business", menuUri: "" }
            ]
          },
        ],
      },
      {
        name: "Bulletin",
        menuUri: "",
        children: [
           {
                name: "List bulletin",
                menuUri: ["bulletin"]
           }
        ]
      },
      {
        name: "Question Booklet",
        menuUri: "",
        children: [
           {
                name: "List Booklets",
                menuUri: ["question/booklet-flow"]
           }
        ]
      }
    ];
  }
  _getDSAndAboveSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      {
        name: "Allotment of Days",
        menuUri: "",
        children: [
          { name: "Allotment File List", menuUri: ["aod/aod-list"] },
          { name: "Approved AOD", menuUri: ["aod/approved-aod"] },
        ],
      },
      {
        name: "Minister groups",
        menuUri: "",
        children: [
          { name: "Minister groups", menuUri: ["aod/aod-ministergroup"] },
          { name: "Approved Minister Group", menuUri: ["aod/aod-ministergroup/approved"] }
        ],
      },
      {
        name: "Schedule Of Activity",
        menuUri: "",
        children: [
          { name: "Schedule Of Activity List", menuUri: ["soa/list"] },
          { name: "Approved SOA", menuUri: ["soa/approved"] }
        ],
      },
      {
        name: "Calendar of sittings",
        menuUri: "",
        children: [
          { name: "COS file list", menuUri: ["sitting/cos-list"] },
          { name: "Calendar Of sittings", menuUri: ["sitting/approved-cos"] },
        ],
      },

      // {
      //   name: "Start Session",
      //   menuUri: "",
      //   children: [{ name: "Allotment Of Days", menuUri: ["aod/aod-create"] }],
      // },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
          {
            name: "View Admitted Notices",
            menuUri: ["question/apprv-list"],
          },
          {
            name: "Notices Withdrawn",
            menuUri: ["question/withdr-list"],
          },
          {
            name: "Disallowed Notices",
            menuUri: ["question/disallw-list"],
          },
          {
            name: "Pull Notices",
            menuUri: ["question/pull-list"],
          }, {
            name: "All Notices",
            menuUri: ["question/all-list"],
          }
        ],
      },
      {
        name: "Ballot Related",
        menuUri: "",
        children: [
          {
            name: "Ballot Listing",
            menuUri: ["question/question-ballot-list"],
          },
          {
            name: "Perform Ballot",
            menuUri: ["question/question-perform-ballot"],
          },
          {
            name: "Starred Question Settings",
            menuUri: ["question/question-settings"],
          },
          {
            name: "Unstarred Question Settings",
            menuUri: ["question/question-unstarred"],
          },
        ],
      },
      {
        name: "Assurance",
        menuUri: "",
        children: [
          {
            name: "Draft Assurances",
            menuUri: ["question/draft-assurance"],
          },
          {
            name: "Assured List",
            menuUri: ["question/assured-list"],
          }
        ],
      },
      {
        name: "Setting Of Questions",
        menuUri: ["question/question-ballot-approve"],
      },
      {
        name: "Send to Department",
        menuUri: ["question/question-senddept"],
      },
      {
        name: "Send Short Notice Question",
        menuUri: ["question/snq-send-dept"],
      },
      {
        name: "Set to LOB",
        menuUri: ["question/question-settolob"],
      },
      {
        name: "Transfer Date",
        menuUri: ["question/question-date-shifting"],
      },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Short Notice Questions",
            menuUri: ["question/snq-list"],
          },
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Questions Withdrawn",
            menuUri: ["question/withdr-list-qus"],
          }
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          {
            name: "Delay Statement List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/delay-statement-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-delay-statement-list"]
              },
              {
                name: "Set To LOB",
                menuUri: ["question/set-delay-statement-list"]
              }
            ]
          },
          {
            name: "Answer Status List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/answer-status-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-answer-status-list"]
              }
            ]
          },
          {
            name: "Late Answer Bulletin",
            menuUri: "",
            children: [
              {
                name: "Bulletin For Action",
                menuUri: ["question/late-answer-bulletin"]
              },
              // {
              //   name: "Approved Bulletin",
              //   menuUri: ["question/approved-late-answer-bulletin"]
              // }
            ]
          }
        ],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [

              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              },
              {
                name: "Schedule of Activity",
                menuUri: ["question/qstn-soactivity-rpt"]
              },
            ],
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              // {
              //   name: "Ballot Report",
              //   menuUri: ["question/question-ballot-report"]
              // },
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
              // { name: "Answer Status", menuUri: "" },

              // { name: "Resume of Business", menuUri: "" }
            ]
          },
        ]
      },
      {
        name: "Bulletin",
        menuUri: "",
        children: [
           {
                name: "List bulletin",
                menuUri: ["bulletin"]
           }
        ]
      },
      {
        name: "Question Booklet",
        menuUri: "",
        children: [
           {
                name: "List Booklets",
                menuUri: ["question/booklet-flow"]
           }
        ]
      }
    ];
  }
  _getSecretarySubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      {
        name: "Allotment of Days",
        menuUri: "",
        children: [{ name: "Allotment File List", menuUri: ["aod/aod-list"] },
        { name: "Approved AOD", menuUri: ["aod/approved-aod"] }
        ],
      },
      {
        name: "Minister groups",
        menuUri: "",
        children: [
          { name: "Minister groups", menuUri: ["aod/aod-ministergroup"] },
          { name: "Approved Minister Group", menuUri: ["aod/aod-ministergroup/approved"] }
        ],
      },
      {
        name: "Schedule Of Activity",
        menuUri: "",
        children: [
          { name: "Schedule Of Activity List", menuUri: ["soa/list"] },
          { name: "Approved SOA", menuUri: ["soa/approved"] }
        ],
      },
      {
        name: "Calendar of sittings",
        menuUri: "",
        children: [
          { name: "COS file List", menuUri: ["sitting/cos-list"] },
          { name: "Calendar Of Sittings", menuUri: ["sitting/approved-cos"] },
        ],
      },
      // {
      //   name: "Start Session",
      //   menuUri: "",
      //   children: [{ name: "Allotment Of Days", menuUri: ["aod/aod-create"] }],
      // },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
          {
            name: "View Admitted Notices",
            menuUri: ["question/apprv-list"],
          },
          {
            name: "Notices Withdrawn",
            menuUri: ["question/withdr-list"],
          },
          {
            name: "Disallowed Notices",
            menuUri: ["question/disallw-list"],
          },
          {
            name: "Pull Notices",
            menuUri: ["question/pull-list"],
          },
          {
            name: "All Notices",
            menuUri: ["question/all-list"],
          }
        ],
      },
      {
        name: "Ballot Related",
        menuUri: "",
        children: [
          {
            name: "Ballot Listing",
            menuUri: ["question/question-ballot-list"],
          },
        ],
      },
      {
        name: "Assurance",
        menuUri: "",
        children: [
          {
            name: "Draft Assurances",
            menuUri: ["question/draft-assurance"],
          },
          {
            name: "Assured List",
            menuUri: ["question/assured-list"],
          }
        ],
      },
      {
        name: "Setting Of Questions",
        menuUri: ["question/question-ballot-approve"],
      },
      {
        name: "Transfer Date",
        menuUri: ["question/question-date-shifting"],
      },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Short Notice Questions",
            menuUri: ["question/snq-list"],
          },
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Questions Withdrawn",
            menuUri: ["question/withdr-list-qus"],
          }
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          {
            name: "Delay Statement List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/delay-statement-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-delay-statement-list"]
              },
              {
                name: "Set To LOB",
                menuUri: ["question/set-delay-statement-list"]
              }
            ]
          },
          {
            name: "Answer Status List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/answer-status-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-answer-status-list"]
              }
            ]
          },
          {
            name: "Late Answer Bulletin",
            menuUri: "",
            children: [
              {
                name: "Bulletin For Action",
                menuUri: ["question/late-answer-bulletin"]
              },
              // {
              //   name: "Approved Bulletin",
              //   menuUri: ["question/approved-late-answer-bulletin"]
              // }
            ]
          }
        ],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [

              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              },
              {
                name: "Schedule of Activity",
                menuUri: ["question/qstn-soactivity-rpt"]
              },
            ],
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
              // {
              //   name: "Ballot Report",
              //   menuUri: ["question/question-ballot-report"]
              // }
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
              // { name: "Answer Status", menuUri: "" },
              // { name: "Resume of Business", menuUri: "" }
            ]
          },
        ]
      },
      {
        name: "Bulletin",
        menuUri: "",
        children: [
           {
                name: "List bulletin",
                menuUri: ["bulletin"]
           }
        ]
      },
      {
        name: "Question Booklet",
        menuUri: "",
        children: [
           {
                name: "List Booklets",
                menuUri: ["question/booklet-flow"]
           }
        ]
      }
    ];
  }
  _getSpeakerSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      {
        name: "Allotment of Days",
        menuUri: "",
        children: [{ name: "Allotment File List", menuUri: ["aod/aod-list"] },
        { name: "Approved AOD", menuUri: ["aod/approved-aod"] }
        ],
      },
      {
        name: "Minister groups",
        menuUri: "",
        children: [
          { name: "Minister groups", menuUri: ["aod/aod-ministergroup"] },
          { name: "Approved Minister Group", menuUri: ["aod/aod-ministergroup/approved"] }
        ],
      },
      {
        name: "Schedule Of Activity",
        menuUri: "",
        children: [
          { name: "Schedule Of Activity List", menuUri: ["soa/list"] },
          { name: "Approved SOA", menuUri: ["soa/approved"] }
        ],
      },
      {
        name: "Calendar of sittings",
        menuUri: "",
        children: [
          { name: "COS file List", menuUri: ["sitting/cos-list"] },
          { name: "Calendar Of sittings", menuUri: ["sitting/approved-cos"] },
        ],
      },
      // {
      //   name: "Start Session",
      //   menuUri: "",
      //   children: [{ name: "Allotment Of Days", menuUri: ["aod/aod-create"] }],
      // },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
          {
            name: "View Admitted Notices",
            menuUri: ["question/apprv-list"],
          },
          {
            name: "Notices Withdrawn",
            menuUri: ["question/withdr-list"],
          },
          {
            name: "Disallowed Notices",
            menuUri: ["question/disallw-list"],
          },
          {
            name: "Pull Notices",
            menuUri: ["question/pull-list"],
          },
          {
            name: "All Notices",
            menuUri: ["question/all-list"],
          }
        ],
      },
      {
        name: "Ballot Related",
        menuUri: "",
        children: [
          {
            name: "Ballot Listing",
            menuUri: ["question/question-ballot-list"],
          },
        ],
      },
      {
        name: "Assurance",
        menuUri: "",
        children: [
          {
            name: "Draft Assurances",
            menuUri: ["question/draft-assurance"],
          },
          {
            name: "Assured List",
            menuUri: ["question/assured-list"],
          }
        ],
      },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Short Notice Questions",
            menuUri: ["question/snq-list"],
          },
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Questions Withdrawn",
            menuUri: ["question/withdr-list-qus"],
          },
          {
            name: "Clubbing Requests",
            menuUri: ["question/clubbing-list"],
          },
          {
            name: "Authorization Requests",
            menuUri: ["question/authorize-list"],
          },
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          {
            name: "Delay Statement List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/delay-statement-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-delay-statement-list"]
              },
              {
                name: "Set To LOB",
                menuUri: ["question/set-delay-statement-list"]
              }
            ]
          },
          {
            name: "Answer Status List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/answer-status-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-answer-status-list"]
              }
            ]
          },
          {
            name: "Late Answer Bulletin",
            menuUri: "",
            children: [
              {
                name: "Bulletin For Action",
                menuUri: ["question/late-answer-bulletin"]
              },
              // {
              //   name: "Approved Bulletin",
              //   menuUri: ["question/approved-late-answer-bulletin"]
              // }
            ]
          }
        ],
      },
      {
        name: "Transfer Date",
        menuUri: ["question/question-date-shifting"],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [

              {
                name: "Calendar of sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              },
              {
                name: "Schedule of Activity",
                menuUri: ["question/qstn-soactivity-rpt"]
              },
            ],
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              // {
              //   name: "Ballot Report",
              //   menuUri: ["question/question-ballot-report"]
              // },
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
              // { name: "Answer Status", menuUri: "" },
              // { name: "Resume of Business", menuUri: "" }
            ]
          },
        ]
      },
      {
        name: "Bulletin",
        menuUri: "",
        children: [
           {
                name: "List bulletin",
                menuUri: ["bulletin"]
           }
        ]
      },
      {
        name: "Question Booklet",
        menuUri: "",
        children: [
           {
                name: "List Booklets",
                menuUri: ["question/booklet-flow"]
           }
        ]
      }
    ];
  }
  _getJSSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      {
        name: "Allotment of Days",
        menuUri: "",
        children: [
          { name: "Allotment File List", menuUri: ["aod/aod-list"] },
          { name: "Approved AOD", menuUri: ["aod/approved-aod"] },
        ],
      },
      {
        name: "Minister groups",
        menuUri: "",
        children: [
          { name: "Minister groups", menuUri: ["aod/aod-ministergroup"] },
          { name: "Approved Minister Group", menuUri: ["aod/aod-ministergroup/approved"] }
        ],
      },
      {
        name: "Schedule Of Activity",
        menuUri: "",
        children: [
          { name: "Schedule Of Activity List", menuUri: ["soa/list"] },
          { name: "Approved SOA", menuUri: ["soa/approved"] }
        ],
      },
      {
        name: "Calendar of sittings",
        menuUri: "",
        children: [
          { name: "COS file list", menuUri: ["sitting/cos-list"] },
          { name: "Calendar Of sittings", menuUri: ["sitting/approved-cos"] },
        ],
      },

      // {
      //   name: "Start Session",
      //   menuUri: "",
      //   children: [{ name: "Allotment Of Days", menuUri: ["aod/aod-create"] }],
      // },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
          {
            name: "View Admitted Notices",
            menuUri: ["question/apprv-list"],
          },
          {
            name: "Notices Withdrawn",
            menuUri: ["question/withdr-list"],
          },
          {
            name: "Disallowed Notices",
            menuUri: ["question/disallw-list"],
          },
          {
            name: "Pull Notices",
            menuUri: ["question/pull-list"],
          },
          {
            name: "All Notices",
            menuUri: ["question/all-list"],
          }
        ],
      },
      {
        name: "Ballot Related",
        menuUri: "",
        children: [
          {
            name: "Ballot Listing",
            menuUri: ["question/question-ballot-list"],
          },
          {
            name: "Perform Ballot",
            menuUri: ["question/question-perform-ballot"],
          },
          {
            name: "Starred Question Settings",
            menuUri: ["question/question-settings"],
          },
          {
            name: "Unstarred Question Settings",
            menuUri: ["question/question-unstarred"],
          },
        ],
      },
      {
        name: "Assurance",
        menuUri: "",
        children: [
          {
            name: "Draft Assurances",
            menuUri: ["question/draft-assurance"],
          },
          {
            name: "Assured List",
            menuUri: ["question/assured-list"],
          }
        ],
      },
      {
        name: "Setting Of Questions",
        menuUri: ["question/question-ballot-approve"],
      },
      {
        name: "Send to Department",
        menuUri: ["question/question-senddept"],
      },
      {
        name: "Send Short Notice Question",
        menuUri: ["question/snq-send-dept"],
      },
      {
        name: "Set to LOB",
        menuUri: ["question/question-settolob"],
      },
      {
        name: "Transfer Date",
        menuUri: ["question/question-date-shifting"],
      },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Short Notice Questions",
            menuUri: ["question/snq-list"],
          },
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Questions Withdrawn",
            menuUri: ["question/withdr-list-qus"],
          }
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          {
            name: "Delay Statement List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/delay-statement-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-delay-statement-list"]
              },
              {
                name: "Set To LOB",
                menuUri: ["question/set-delay-statement-list"]
              }
            ]
          },
          {
            name: "Answer Status List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/answer-status-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-answer-status-list"]
              }
            ]
          },
          {
            name: "Late Answer Bulletin",
            menuUri: "",
            children: [
              {
                name: "Bulletin For Action",
                menuUri: ["question/late-answer-bulletin"]
              },
              // {
              //   name: "Approved Bulletin",
              //   menuUri: ["question/approved-late-answer-bulletin"]
              // }
            ]
          }
        ],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              },
              {
                name: "Schedule of Activity",
                menuUri: ["question/qstn-soactivity-rpt"]
              },
            ],
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              // {
              //   name: "Ballot Report",
              //   menuUri: ["question/question-ballot-report"]
              // },
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
              // { name: "Answer Status", menuUri: "" },
              // { name: "Resume of Business", menuUri: "" }
            ]
          },
        ]
      },
      {
        name: "Bulletin",
        menuUri: "",
        children: [
           {
                name: "List bulletin",
                menuUri: ["bulletin"]
           }
        ]
      },
      {
        name: "Question Booklet",
        menuUri: "",
        children: [
           {
                name: "List Booklets",
                menuUri: ["question/booklet-flow"]
           }
        ]
      }
    ];
  }
  _getAnswerSectionSubMenu() {
    return [
      {
        name: "Questions/Answers",
        children: [
          { name: "Examine Answers", menuUri: ["question/list-dept"] },
          { name: "Short Notices For Answer", menuUri: ["question/list-snq-ans"] },

          {
            name: "Correction Of Answer",
            menuUri: ["question/tkn-list"],
          }
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          // {
          //   name: "Delay Statement List",
          //   menuUri: ["question/delay-statement-list"],
          // },
          {
            name: "Answer Status List",
            menuUri: ["question/approved-answer-status-list"],
          }
        ],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "Answer corrections",
            menuUri: ["question/ac-list"],
          },
          {
            name: "Corrections after sabha",
            menuUri: ["question/ac-aftr-list"],
          },
        ],
      },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Returned Questions",
            menuUri: ["question/returned-list"],
          },
          // {
          //   name: "Questions Withdrawn",
          //   menuUri: ["question/withdr-list-qus"],
          // },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              }
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
            ]
          }
        ],
      },
    ];
  }
  _getMlaSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dashboard"],
      },
      {
        name: "Notice",
        menuUri: "",
        children: [
          {
            name: "Notices for Question",
            menuUri: ["question/question-create"],
          },
          { name: "Add To Notice Bank", menuUri: ["question/addtobank"] },
          { name: "Consents", menuUri: ["question/question-consent"] },
        ],
      },
      // {
      //   name: "Allotment of Days",
      //   menuUri: "",
      //   children: [
      //     { name: "Approved AOD", menuUri: ["aod/approved-aod"] }
      //   ],
      // },
      {
        name: "Views",
        menuUri: "",
        children: [
          { name: "Notices", menuUri: ["question/list-mla-ntc"] },
          {
            name: "Questions",
            menuUri: ["question/list-mla-qus"],
          },
          {
            name: "Short Notice Questions",
            menuUri: ["question/list-mla-snq"],
          },
          { name: "Notice Bank", menuUri: ["question/question-bank"] },
          { name: "Search MLA", menuUri: ["question/question-mlaListing"] },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              }
            ]
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              }
            ]
          },
        ],
      }
    ];
  }
  _getMinisterSubMenu() {
    return [
      {
        name: "Views",
        menuUri: "",
        children: [
          { name: "Questions", menuUri: ["question/list-dept"] },
          { name: "Short Notices Questions", menuUri: ["question/list-snq-ans"] },
          { name: "Search MLA", menuUri: ["question/question-mlaListing"] },
        ],
      },
      // { name: "Starred Booklet", menuUri: ["question/starred-booklet"] },
      { name: "All Correction Requests", menuUri: ["question/correctn-list"] },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              }
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
            ]
          }
        ],
      },
    ];
  }
  _getDeputySpeakerSubMenu() {
    return [
      {
        name: "Views",
        menuUri: "",
        children: [
          { name: "Search MLA", menuUri: ["question/question-mlaListing"] },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              }
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
            ]
          }
        ],
      },
    ];
  }
  _getSectionOffcerSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      {
        name: "Allotment of Days",
        menuUri: "",
        children: [
          { name: "Allotment File List", menuUri: ["aod/aod-list"] },
          { name: "Approved AOD", menuUri: ["aod/approved-aod"] },
        ],
      },

      {
        name: "Minister groups",
        menuUri: "",
        children: [
          { name: "Minister groups", menuUri: ["aod/aod-ministergroup"] },
          { name: "Approved Minister Group", menuUri: ["aod/aod-ministergroup/approved"] }
        ],
      },

      {
        name: "Schedule Of Activity",
        menuUri: "",
        children: [
          { name: "Schedule Of Activity List", menuUri: ["soa/list"] },
          { name: "Approved SOA", menuUri: ["soa/approved"] }
        ],
      },
      {
        name: "Calendar of sittings",
        menuUri: "",
        children: [
          { name: "COS file list", menuUri: ["sitting/cos-list"] },
          { name: "Calendar Of sittings", menuUri: ["sitting/approved-cos"] },
        ],
      },
      // {
      //   name: "Start Session",
      //   menuUri: "",
      //   children: [
      //     { name: "Allotment Of Days", menuUri: ["aod/aod-create"] },
      //     { name: "Approved SOA", menuUri: ["soa/approved"] }
      //     // { name: "Schedule Of Activity", menuUri: ["schedule-of-activity"] }
      //   ],
      // },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
          {
            name: "View Admitted Notices",
            menuUri: ["question/apprv-list"],
          },
          {
            name: "Notices Withdrawn",
            menuUri: ["question/withdr-list"],
          },
          {
            name: "Disallowed Notices",
            menuUri: ["question/disallw-list"],
          },
          {
            name: "Pull Notices",
            menuUri: ["question/pull-list"],
          },
          {
            name: "All Notices",
            menuUri: ["question/all-list"],
          }
        ],
      },
      // {
      //   name: "Questions/Answers",
      //   menuUri: "",
      //   children: [{ name: "Examine Answers", menuUri: "" }]
      // },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Short Notice Questions",
            menuUri: ["question/snq-list"],
          },
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Questions Withdrawn",
            menuUri: ["question/withdr-list-qus"],
          }
        ],
      },
      {
        name: "Assurance",
        menuUri: "",
        children: [
          {
            name: "Draft Assurances",
            menuUri: ["question/draft-assurance"],
          },
          {
            name: "Assured List",
            menuUri: ["question/assured-list"],
          }
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          {
            name: "Delay Statement List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/delay-statement-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-delay-statement-list"]
              }
            ]
          },
          {
            name: "Answer Status List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/answer-status-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-answer-status-list"]
              }
            ]
          },
          {
            name: "Late Answer Bulletin",
            menuUri: "",
            children: [
              {
                name: "Bulletin For Action",
                menuUri: ["question/late-answer-bulletin"]
              },
              // {
              //   name: "Approved Bulletin",
              //   menuUri: ["question/approved-late-answer-bulletin"]
              // }
            ]
          }
        ],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              },
              {
                name: "Schedule of Activity",
                menuUri: ["question/qstn-soactivity-rpt"]
              },
            ]
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
              // { name: "Answer Status", menuUri: "" },
              // { name: "Resume of Business", menuUri: "" }
            ]
          }
        ],
      },
      {
        name: "Bulletin",
        menuUri: "",
        children: [
           {
                name: "List bulletin",
                menuUri: ["bulletin"]
           }
        ]
      },
      {
        name: "Question Booklet",
        menuUri: "",
        children: [
           {
                name: "List Booklets",
                menuUri: ["question/booklet-flow"]
           }
        ]
      }
    ];
  }
  _getAssistantSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      {
        name: "Allotment of Days",
        menuUri: "",
        children: [
          { name: "Allotment Of Days", menuUri: ["aod/aod-create"] },
          { name: "Allotment File List", menuUri: ["aod/aod-list"] },
          { name: "Approved AOD", menuUri: ["aod/approved-aod"] },
        ],
      },
      {
        name: "Calendar of sittings",
        menuUri: "",
        children: [
          { name: "Calendar Of sittings", menuUri: ["sitting/approved-cos"] }
        ]
      },
      {
        name: "Minister groups",
        menuUri: "",
        children: [
          { name: "Minister groups", menuUri: ["aod/aod-ministergroup"] },
          { name: "Approved Minister Group", menuUri: ["aod/aod-ministergroup/approved"] }
        ],
      },
      {
        name: "Schedule of Activity",
        menuUri: "",
        children: [
          { name: "Schedule of Activity", menuUri: ["soa/view"] },
          { name: "Schedule of Activity List", menuUri: ["soa/list"] },
          { name: "Approved SOA", menuUri: ["soa/approved"] }
        ],
      },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Notices for Question",
            menuUri: ["question/question-create"],
          },
          {
            name: "Saved Notices",
            menuUri: ["question/svd-list"],
          },
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
          {
            name: "View Admitted Notices",
            menuUri: ["question/apprv-list"],
          },
          {
            name: "Notices Withdrawn",
            menuUri: ["question/withdr-list"],
          },
          {
            name: "Disallowed Notices",
            menuUri: ["question/disallw-list"],
          },
          {
            name: "All Notices",
            menuUri: ["question/all-list"],
          }
        ],
      },
      {
        name: "Assurance",
        menuUri: "",
        children: [
          {
            name: "Culling Assurance",
            menuUri: ["question/culling-assurance"],
          },
          {
            name: "Draft Assurances",
            menuUri: ["question/draft-assurance"],
          },
          {
            name: "Assured List",
            menuUri: ["question/assured-list"],
          }
        ],
      },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Short Notice Questions",
            menuUri: ["question/snq-list"],
          },
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Questions Withdrawn",
            menuUri: ["question/withdr-list-qus"],
          }
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          {
            name: "Delay Statement List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/delay-statement-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-delay-statement-list"]
              }
            ]
          },
          {
            name: "Answer Status List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/answer-status-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-answer-status-list"]
              }
            ]
          },
          {
            name: "Late Answer Bulletin",
            menuUri: "",
            children: [
              {
                name: "Bulletin For Action",
                menuUri: ["question/late-answer-bulletin"]
              },
              // {
              //   name: "Approved Bulletin",
              //   menuUri: ["question/approved-late-answer-bulletin"]
              // }
            ]
          }
        ],
      },
      // {
      //   name: "Questions/Answers",
      //   menuUri: "",
      //   children: [{ name: "Examine Answers", menuUri: "" }]
      // },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [

              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              },
              {
                name: "Schedule of Activity",
                menuUri: ["question/qstn-soactivity-rpt"]
              },

              // { name: "Notices Sent For Clarification", menuUri: "" },
              // { name: "Answer Date Report", menuUri: "" }
            ]
          },
          //     {
          //       name: "Notice Related",
          //       menuUri: "",
          //       children: [
          //         {
          //           name: "MLA wise Notices",
          //           menuUri: ["question/question-mlawise-notices"]
          //         },
          //         {
          //           name: "Notice Abstract",
          //           menuUri: ["question/question-notice-abstract"]
          //         }
          //       ]
          //     },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
              //         {
              //           name: "Ballot Date",
              //           menuUri: ["question/question-ballot-date-report"]
              //         },
              //         {
              //           name: "Ballot Report",
              //           menuUri: ["question/question-ballot-report"]
              //         }
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
              // { name: "Answer Status", menuUri: "" },
              // { name: "Resume of Business", menuUri: "" }
            ]
          },
        ],
      },
      {
        name: "Bulletin",
        menuUri: "",
        children: [
           {
                name: "List bulletin",
                menuUri: ["bulletin"]
           }
        ]
      },
      {
        name: "Question Booklet",
        menuUri: "",
        children: [
           {
                name: "List Booklets",
                menuUri: ["question/booklet-flow"]
           }
        ]
      }
    ];
  }
  _getOfficeAssistantSubMenu() {
    return [
      {
        name: "Calendar of sittings",
        menuUri: "",
        children: [
          { name: "Draft calendar of sittings", menuUri: ["sitting/view"] },
          { name: "COS file list", menuUri: ["sitting/cos-list"] },
          { name: "Calendar Of sittings", menuUri: ["sitting/approved-cos"] }
        ],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      }
    ];
  }
  _getQSSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
        ],
      },
    ];
  }
  _getSOSubMenu() {
    return [
      {
        name: "Dashboard",
        menuUri: ["question/question-dept-dashboard"],
      },
      // {
      //   name: "Start Session",
      //   menuUri: "",
      //   children: [{ name: "Allotment Of Days", menuUri: ["aod/aod-create"] }],
      // },
      {
        name: "Schedule Of Activity",
        menuUri: "",
        children: [
          { name: "Schedule Of Activity List", menuUri: ["soa/list"] },
          { name: "Approved SOA", menuUri: ["soa/approved"] }
        ],
      },
      {
        name: "Notice Related",
        menuUri: "",
        children: [
          {
            name: "Edit Notices",
            menuUri: ["question/list-dept"],
          },
          {
            name: "View Admitted Notices",
            menuUri: ["question/apprv-list"],
          },
          {
            name: "Notices Withdrawn",
            menuUri: ["question/withdr-list"],
          },
          {
            name: "Disallowed Notices",
            menuUri: ["question/disallw-list"],
          },
        ],
      },
      {
        name: "Ballot Related",
        menuUri: "",
        children: [
          {
            name: "Ballot Listing",
            menuUri: ["question/question-ballot-list"],
          },
          {
            name: "Perform Ballot",
            menuUri: ["question/question-perform-ballot"],
          },
          {
            name: "Starred Question Settings",
            menuUri: ["question/question-settings"],
          },
          {
            name: "Unstarred Question Settings",
            menuUri: ["question/question-unstarred"],
          },
        ],
      },
      {
        name: "Assurance",
        menuUri: "",
        children: [
          {
            name: "Draft Assurances",
            menuUri: ["question/draft-assurance"],
          },
          {
            name: "Assured List",
            menuUri: ["question/assured-list"],
          }
        ],
      },
      {
        name: "Setting Of Questions",
        menuUri: ["question/question-ballot-approve"],
      },
      {
        name: "Question Related",
        menuUri: "",
        children: [
          {
            name: "Short Notice Questions",
            menuUri: ["question/snq-list"],
          },
          {
            name: "Answered Questions",
            menuUri: ["question/answd-list"],
          },
          {
            name: "Questions Withdrawn",
            menuUri: ["question/withdr-list-qus"],
          }
        ],
      },
      {
        name: "Delay Statement",
        menuUri: "",
        children: [
          {
            name: "Delay Statement List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/delay-statement-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-delay-statement-list"]
              }
            ]
          },
          {
            name: "Answer Status List",
            menuUri: "",
            children: [
              {
                name: "List For Action",
                menuUri: ["question/answer-status-list"]
              },
              {
                name: "Approved List",
                menuUri: ["question/approved-answer-status-list"]
              }
            ]
          },
          {
            name: "Late Answer Bulletin",
            menuUri: "",
            children: [
              {
                name: "Bulletin For Action",
                menuUri: ["question/late-answer-bulletin"]
              },
              // {
              //   name: "Approved Bulletin",
              //   menuUri: ["question/approved-late-answer-bulletin"]
              // }
            ]
          }
        ],
      },
      {
        name: "Balloting",
        menuUri: ["question/question-settings"],
      },
      {
        name: "Transfer Date",
        menuUri: ["question/question-date-shifting"],
      },
      {
        name: "Views",
        menuUri: "",
        children: [
          {
            name: "MLA Details",
            menuUri: ["question/question-mlaListing"],
          },
        ],
      },
      {
        name: "Reports",
        menuUri: "",
        children: [
          {
            name: "Session Related",
            menuUri: "",
            children: [
              {
                name: "Calendar of Sittings Report",
                menuUri: ["question/qstn-cos-rpt"],
              },
              {
                name: "Allotment of Days",
                menuUri: ["question/qstn-aod-rpt"]
              },
              {
                name: "Schedule of Answer",
                menuUri: ["question/qstn-soa-rpt"]
              },
              {
                name: "Schedule of Activity",
                menuUri: ["question/qstn-soactivity-rpt"]
              },
            ]
          },
          {
            name: "Ballot Related",
            menuUri: "",
            children: [
              {
                name: "Ballot Date Report",
                menuUri: ["question/question-ballot-date-report"],
              },
              {
                name: "Ballot chart",
                menuUri: ["question/qstn-ballotchart-rpt"]
              },
            ]
          },
          {
            name: "Question Related",
            menuUri: "",
            children: [
              {
                name: "Starred Question Booklet",
                menuUri: ["question/qstn-starredqstn-rpt"]
              },
              {
                name: "Unstarred Question Booklet",
                menuUri: ["question/qstn-unstarredqstn-rpt"]
              },
              {
                name: "Answer Received Statistics",
                menuUri: ["question/qstn-ans-statistics-rpt"]
              }
              // { name: "Answer Status", menuUri: "" },
              // { name: "Resume of Business", menuUri: "" }
            ]
          },
        ],
      },
      {
        name: "Bulletin",
        menuUri: "",
        children: [
           {
                name: "List bulletin",
                menuUri: ["bulletin"]
           }
        ]
      },
      {
        name: "Question Booklet",
        menuUri: "",
        children: [
           {
                name: "List Booklets",
                menuUri: ["question/booklet-flow"]
           }
        ]
      }
    ];
  }
  getDashBoardUrl() {
    if (this.roleName == "MLA") {
      return "/business-dashboard/question/question-dashboard";
    } else {
      return "/business-dashboard/question/question-dept-dashboard";
    }
  }
}