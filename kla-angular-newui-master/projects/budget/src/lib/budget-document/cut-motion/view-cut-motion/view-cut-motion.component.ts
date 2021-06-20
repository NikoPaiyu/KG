import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { StmtDemandsGrantsService } from '../../../shared/services/stmt-demands-grants.service';

@Component({
  selector: 'budget-view-cut-motion',
  templateUrl: './view-cut-motion.component.html',
  styleUrls: ['./view-cut-motion.component.scss']
})
export class ViewCutMotionComponent implements OnInit {
  radioValue;
  sdfgList = [];
  sdfgId;
  cutMotions = {
    policy: '',
    economyTemplates: [],
    tempEconomy: [],
    economy: [],
    economyObj: { Amount: '', Item: '', selIndex: '' },
    token: '',
    economyCut: '',
    showEdit: false,
    savedcutMotionId: null,
    remarks: null,
    selIndex: 0
  }
  selRow; urlParams;today;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private notify: NzNotificationService,
    private sdfg: StmtDemandsGrantsService) {
    this.urlParams = this.router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.sdfgId = params["id"];
        this.today = new Date().toISOString().split("T")[0]
      }
    });
  }
  showCutMotion(lines) {
    this.selRow = lines;
    this.selRow.type = this.selRow.type ? this.selRow.type : "POLICY_CUT"
    this.cutMotions.selIndex = 0;
    this.getCutMotionByType(this.selRow.type);
    this.resetEconomyValues();
  }
  getCutMotionByType(type) {
    this.selRow.type = type;
    let body = { "sdfgLineId": this.selRow.id, "type": this.selRow.type }
    this.sdfg.getAllCutMotion(body).subscribe((cutMotion) => {
      this.showCutMotionData(cutMotion);
    })
  }
  submitCutMotion() {
    this.sdfg.submitCutMotion(this.sdfgId).subscribe((result) => {
      this.notify.create('success', 'Success', 'Submitted Successfully');
      this.router.navigate(['business-dashboard/budgets/sdfg/published']);
    });
  }
  deleteCutMotion() {
    this.sdfg.DeleteCutMotion(this.cutMotions.savedcutMotionId).subscribe((cutmotionId) => {
      this.getCutMotionByType(this.selRow.type);
    });
  }
  selectContent() {
    if (this.selRow.type === "ECONOMY_CUT") {
      return this.cutMotions.tempEconomy[this.cutMotions.economyObj.selIndex]
    }
    if (this.selRow.type === "POLICY_CUT") {
      return this.cutMotions.policy
    } else if (this.selRow.type === "TOKEN_CUT") {
      return this.cutMotions.token
    }
  }
  showCutMotionData(savedcutMotion) {
    this.resetObject();
    switch (this.selRow.type) {
      case "POLICY_CUT":
        if (savedcutMotion.length > 0) {
          this.cutMotions.savedcutMotionId = savedcutMotion[0].id;
          this.cutMotions.policy = savedcutMotion[0].notes;
          this.cutMotions.remarks = savedcutMotion[0].remarks;
          this.cutMotions.showEdit = true;
          return;
        }
        this.buildTemplateForPolicy()
        break;
      case "ECONOMY_CUT":
        if (savedcutMotion.length > 0) {
          this.cutMotions.savedcutMotionId = savedcutMotion[0].id;
          if (savedcutMotion[0].economyCutValues) {
            let economyCutValues = JSON.parse(savedcutMotion[0].economyCutValues);
            if (economyCutValues.selIndex != null) {
              let savedEconomy = '';
              savedEconomy = savedcutMotion[0].notes.replace('[Amount]', economyCutValues.Amount);
              savedEconomy = savedEconomy.replace('[Item]', economyCutValues.Item);
              this.cutMotions.economyCut = savedEconomy;
            }
          }
          this.cutMotions.remarks = savedcutMotion[0].remarks;
          this.cutMotions.showEdit = true;
          return;
        }
        this.buildTemplateForEconomy();
        break;
      case "TOKEN_CUT":
        if (savedcutMotion.length > 0) {
          this.cutMotions.savedcutMotionId = savedcutMotion[0].id;
          this.cutMotions.token = savedcutMotion[0].notes;
          this.cutMotions.showEdit = true;
          return;
        }
        this.buildTemplateForToken();
        break;
      default:
        break;
    }
  }
  resetObject() {
    this.cutMotions.showEdit = false;
    this.cutMotions.savedcutMotionId = null;
    this.cutMotions.remarks = null;
    this.resetEconomyValues();
    this.enableAllEconomy();
  }

  buildTemplateForPolicy() {
    let template = `[DemandName] എന്ന [DemandNumber] -ാം നമ്പർ ധനാഭ്യർത്ഥയുടെ പേരിൽ വകകൊള്ളിച്ചിട്ടുള്ള [DemandTotal] ക ഒരു ഉറുപ്പികയായി കുറവുചെയ്യേണ്ടതാണ്.`
    template = this.replaceTemplateVariables(template)
    this.cutMotions.policy = template;
  }
  buildTemplateForEconomy() {
    let template = ''
    this.cutMotions.economyTemplates = [];
    this.cutMotions.tempEconomy = [];
    this.cutMotions.economy = [];
    this.cutMotions.economyTemplates.push(`[DemandName] എന്ന [DemandNumber]-ാം നമ്പർ ധനാഭ്യർത്ഥയുടെ പേരിൽ വകകൊള്ളിച്ചിട്ടുള്ള [DemandTotal] കയിൽ [Amount] ഉറുപ്പിക കുറവുചെയ്യേണ്ടതാണ്.`);
    this.cutMotions.economyTemplates.push(`[DemandName] എന്ന [DemandNumber]-ാം നമ്പർ ബജറ്റ് ഹെഡിനുകീഴെ [Item] എന്ന ഇനത്തിന് വകകൊള്ളിച്ചിട്ടുള്ള [Amount] ഉറുപ്പിക നീക്കം ചെയ്യേണ്ടതാണ്.`);
    this.cutMotions.economyTemplates.push(`[DemandName] എന്ന [DemandNumber]-ാം നമ്പർ ബജറ്റ് ഹെഡിനുകീഴെ [Item] എന്ന ഇനത്തിന് വകകൊള്ളിച്ചിട്ടുള്ള [Amount] ക ഉറുപ്പികയായി കുറവുചെയ്യേണ്ടതാണ്.`);
    this.cutMotions.economyTemplates.forEach(i => {
      template = this.replaceTemplateVariables(i);
      this.cutMotions.tempEconomy.push(template);
      template = template.replace('[Amount]', `<input class="input" id="amount"  type = "number" nz-input placeholder="please enter" />`);
      template = template.replace('[Item]', `<input class="input" id="item"  type = "text" nz-input placeholder="please enter" />`);
      this.cutMotions.economy.push(template);
    });
  }
  buildTemplateForToken() {
    let template = `[DemandName] എന്ന [DemandNumber]-ാം നമ്പർ ധനഭ്യർത്ഥനയുടെ പേരിൽ വകകൊള്ളിച്ചിട്ടുള്ള [DemandTotal] കയിൽ നിന്ന് ഒരുനൂറ്‌ ഉറുപ്പിക കുറവുചെയ്യേണ്ടതാണ്`
    template = this.replaceTemplateVariables(template);
    this.cutMotions.token = template;
  }
  actionCutMotion() {
    if (this.cutMotions.showEdit) {
      this.cutMotions.showEdit = false;
      return;
    }
    if (this.selRow.type === "ECONOMY_CUT") {
      if (!this.cutMotions.economyObj.Amount) {
        this.notify.create('warning', 'Warning', 'Please Enter Amount!');
        return;
      }
      if (this.cutMotions.economyObj.selIndex) {
        if (!this.cutMotions.economyObj.Item) {
          this.notify.create('warning', 'Warning', 'Please Enter Item!');
          return;
        }
      }
    }
    if(this.selRow.type === "ECONOMY_CUT" || this.selRow.type === "POLICY_CUT") {
      if (!this.cutMotions.remarks) {
        this.notify.create('warning', 'Warning', 'Please Add Remark!');
        return;
      }
    }
    let body = {
      "notes": this.selectContent(),
      "sdfgLineId": this.selRow.id,
      "type": this.selRow.type,
      "id": this.cutMotions.savedcutMotionId,
      "remarks": this.cutMotions.remarks,
      "sdfgMasterId": this.sdfgId
    }
    if (this.selRow.type === "ECONOMY_CUT") {
      body['economyCutValues'] = JSON.stringify(this.cutMotions.economyObj);
    }
    this.sdfg.createCutMotion(body).subscribe((cutmotionId) => {
      this.cutMotions.showEdit = true;
      this.cutMotions.savedcutMotionId = cutmotionId;
      this.resetEconomyValues();
      this.notify.create('success', 'Success', 'Saved Successfully');
      this.getCutMotionByType(this.selRow.type);
    });
  }
  resetEconomyValues() {
    this.cutMotions.economyObj = { Amount: '', Item: '', selIndex: '' };
  }
  enableAllEconomy() {
    let ids = [1, 2, 3]
    ids.forEach(i => {
      var element = document.getElementById("economy_" + i);
      if (element) {
        element.classList.remove("disabledDiv");
      }
    });
  }
  onKey(index, data, event) {
    if (event.target.id && event.target.value) {
      this.setEconomyCutValues(event, index);
      this.cutMotions.economy.forEach((value, index) => {
        if (value != data) {
          var element = document.getElementById("economy_" + index);
          if (element) {
            element.classList.add("disabledDiv");
          }
        }
      });
      return;
    }
    this.enableDiv();
  }
  enableDiv() {
    this.cutMotions.economy.forEach((value, index) => {
      var element = document.getElementById("economy_" + index);
      if (element) {
        element.classList.remove("disabledDiv");
      }
    });
  }
  setEconomyCutValues(event, index) {
    if (event.target) {
      if (event.target.id === 'amount' && event.target.value) {
        this.cutMotions.economyObj.Amount = event.target.value

      }
      if (event.target.id === 'item' && event.target.value) {
        this.cutMotions.economyObj.Item = event.target.value
      }
    }
    this.cutMotions.economyObj.selIndex = index;
  }
  replaceTemplateVariables(template) {
    if (this.selRow.demandNameEng) {
      template = template.replace('[DemandName]', this.selRow.demandNameEng);
    }
    if (this.selRow.demandNumber) {
      template = template.replace('[DemandNumber]', this.selRow.demandNumber);
    }
    if (this.selRow.total) {
      template = template.replace('[DemandTotal]', this.selRow.total);
    }
    return template;
  }
  canShowCutmotions() {
    if (typeof this.selRow  === 'undefined') {
      return false;
    }
    return true;
  }
  canProceedCutmtoion() {
    if(this.selRow) {
      if(this.selRow.status === 'SUBMITTED') {
        return true;
      }
      if(this.today > this.selRow.cosDate.split("T")[0]) {
        return true;
      }
    }
    return false;
  }
}
