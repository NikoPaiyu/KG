import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { QuestionService } from 'src/app/business-dashboard/question/shared/question.service';
import { NotificationCustomService } from 'src/app/shared/services/notification.service';
import { PortfolioService } from '../shared/services/portfolio.service';

@Component({
  selector: 'app-create-portfolio',
  templateUrl: './create-portfolio.component.html',
  styleUrls: ['./create-portfolio.component.scss']
})
export class CreatePortfolioComponent implements OnInit {
  public portfolios = [];
  public subjects = [];
  public subSubjects = [];
  subjectValue: string;
  subSubjectValue: string;
  isVisible = false;
  listOfPortfolio: any;
  selectedPortfolioId: any;
  selectedSubjectId: any;
  portfolioEditValue: string;
  portfolioValue: string;
  selectedSubSubjectId: any;
  isPortfolioOrderChanged = false;
  isSubjectOrderChanged = false;
  isSubSubjectOrderChanged = false;
  assemblyId
  type = null;
  titleMalayalam = null;
  title = null;
  portFolioDto=[];
  editId = null;
  editOrder = null
  portFolioStatus = null;
  activeAssembly
  constructor(
    private portfolioService: PortfolioService,
    private notify: NotificationCustomService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
  ) {
    this.assemblyId = this.route.snapshot.params.id
  }

  ngOnInit() {
    this.getAllAssembly()
    this.getPortfolios();
  }
  getAllAssembly() {
    this.portfolioService.getAllAssemblySession().subscribe((res: any) => {
      this.activeAssembly = res.activeAssemblySession;
    });
  }
  back(){
    window.history.back();
  }
  portfolioClick(result,status) {
    this.portFolioStatus = status;
    this._removeSelection();
    this.subjects = [];
    this.subSubjects = [];
    this.selectedPortfolioId = null;
    this.subSubjectValue = "";
    const indexedValue = this.portfolios.findIndex(element => element.value == result);
    this.portfolios[indexedValue].active = true;
    this.getMinisterSubjectsByPortfolioId(this.portfolios[indexedValue].value);
    this.selectedPortfolioId = this.portfolios[indexedValue].value;
  }
  _removeSelection() {
    this.portfolios.filter(function (item) {
      return (item.active = "");
    });
    this.subjects.filter(function (item) {
      return (item.active = "");
    });
    this.subSubjects.filter(function (item) {
      return (item.active = "");
    });
  }
  subjectClick(result) {
    this.subjects.filter(function (item) {
      return (item.active = "");
    });
    this.selectedSubjectId = null;
    this.subSubjects = [];
    const indexedValue = this.subjects.findIndex(element => element.value == result);
    this.subjects[indexedValue].active = true;
    this.selectedSubjectId = this.subjects[indexedValue];
    this.getMinisterSubSubjectsBySubjectId(this.subjects[indexedValue].value);
   
  }

  subSubjectClick(result) {
    this.subSubjects.filter(function (item) {
      return (item.active = "");
    });
    const indexedValue = this.subSubjects.findIndex(element => element.value == result);
    this.subSubjects[indexedValue].active = true;
  }

  /* addPortfolio(addPortfolio) {
    this.portfolios.push({ label: addPortfolio, value: null });
    this.portfolioValue = '';
  } */
  addPortFolio(title,titleInMalayalam){
    if (!title) {
      this.notify.showWarning("Warning", "Please Enter PortFolio");
      return;
    }
    if (this.assemblyId) {
      let data = {
        id : this.editId ? this.editId : null,
        assemblyId: this.assemblyId,
        name: title,
        nameInMalayalam : titleInMalayalam,
        priorityOrder: this.editOrder ? this.editOrder : (this.portfolios ? this.portfolios.length : 0),
        seatingOrder:null,
      };
      this.savePortFolio(data);
    }
  }
  addSubject(title,titleInMalayalam) {
    
    if (!title) {
      this.notify.showWarning("Warning", "Please Enter a Subject");
      return;
    }
    if (this.selectedPortfolioId) {
      let data = {
        id : this.editId ? this.editId : null,
        portfolioId: this.selectedPortfolioId,
        title: title,
        titleInMalayalam : titleInMalayalam,
        priorityOrder: this.editOrder ? this.editOrder :(  this.subjects ? this.subjects.length : 0)
      };
      this.saveSubject(data);
    }
  }

  addSubSubject(title,titleInMalayalam) {
   
    if (!title) {
      this.notify.showWarning("Warning", "Please Enter a Sub Subject");
      return;
    }
    let data = {
      subjectId: this.selectedSubjectId.value,
      title: title,
      titleMalayalam : titleInMalayalam,
      priorityOrder: this.subSubjects ? this.subjects.length : 0

    };
    this.saveSubSubject(data);
  }
  savePortFolio(portfolioData) {
    this.portfolioService.savePortFolio(portfolioData).subscribe((response: any) => {
      if(response && response.length!= 0){
      // let adddeIndex = response.length -1;
      if(!portfolioData.id){
        this.portfolios = []
        this.portfolios = response.map((x) => ({
            label : x.name,
            value : x.id,
            order : x.priorityOrder,
            labelInMal : x.nameInMalayalam,
            status : x.status
        }));
        this.portfolios = this.portfolios.sort((a, b) => (a.order > b.order ? 1 : -1));
      }
      else{
      let portIndex= this.portfolios.findIndex(x=>x.value == portfolioData.id)
       if(portIndex){
        this.portfolios[portIndex].label = portfolioData.name;
        this.portfolios[portIndex].labelInMal = portfolioData.nameInMalayalam;
       }
      } 
      this.subjectValue = "";
      this.notify.showSuccess("Success", "Portfolio Added Succesfully");
      this.savePortfolioOrder(false);
      }
      // this.getMinisterSubjectsByPortfolioId(this.selectedPortfolioId);
    });
  }
  saveSubject(subjectData) {
    this.portfolioService.saveSubject(subjectData).subscribe((response: any) => {
      if(!subjectData.id){
      this.subjects.push({ 
        label: response.title, 
        value: response.id, 
        order: response.priorityOrder,
        labelInMal : response.titleInMalayalam,
       });
      }else{
        let subIndex= this.subjects.findIndex(x=>x.value == subjectData.id)
        if(subIndex){
         this.subjects[subIndex].label = subjectData.title;
         this.subjects[subIndex].labelInMal = subjectData.titleInMalayalam;
        }
      } 
      this.subjectValue = "";
      this.notify.showSuccess("Success", "Subject Added Succesfully");
      this.saveSubjectOrder(false);
      // this.getMinisterSubjectsByPortfolioId(this.selectedPortfolioId);
    });
  }

  saveSubSubject(subSubjectData) {
    this.portfolioService.saveSubSubject(subSubjectData).subscribe((response: any) => {
      if(!subSubjectData.id){
      this.subSubjects.push({ 
        label: response.title, 
        value: response.id, 
        order: response.priorityOrder,
        labelInMal : response.titleMalayalam,
       });
      }else{
        let subIndex= this.subSubjects.findIndex(x=>x.value == subSubjectData.id)
        if(subIndex){
         this.subjects[subIndex].label = subSubjectData.title;
         this.subjects[subIndex].labelInMal = subSubjectData.titleMalayalam;
        }
      }
      this.subSubjectValue = "";
      this.notify.showSuccess("Success", "Sub Subject Added Succesfully");
      this.saveSubSubjectOrder(false);
      // this.getMinisterSubSubjectsBySubjectId(this.selectedSubjectId);
    });
  }

  getPortfolios() {
    this.portFolioDto = [];
    this.portfolioService.getPortfoliosForAssembly(this.assemblyId).subscribe((res: any) => {
      this.portFolioDto = res;
      this.mapProtfolioData(res);
    });
  }
  mapProtfolioData(res) {
    this.portfolios = [];
    this.subjects = [];
    this.subSubjects = [];
    this.isSubjectOrderChanged = false;
    this.isSubSubjectOrderChanged = false;
    this.isPortfolioOrderChanged = false;
    this.selectedPortfolioId = null;
    this.selectedSubjectId = null;
    this.selectedSubSubjectId = null;
    let comboDatas = [];
    res.forEach(portfolio => {
      comboDatas.push({
        label: portfolio.name,
        value: portfolio.id,
        order: portfolio.priorityOrder,
        labelInMal : portfolio.nameInMalayalam,
        status: portfolio.status
      });
    });
    this.portfolios = comboDatas.sort((a, b) => a.order > b.order ? 1 : -1);

  }
  getMinisterSubjectsByPortfolioId(portFolioId) {
    let portfolioObj = this.portFolioDto.find(x=>x.id == portFolioId);
    if(portfolioObj){
      this.mapSubjectData(portfolioObj.subjects);
    }
    // let body = [portFolioId];
    // this.portfolioService
    //   .getMinisterSubject(body)
    //   .subscribe((res: any) => {
    //     this.mapSubjectData(res);
    //   });
  }

  mapSubjectData(res) {
    this.subjects = [];
    this.subSubjects = [];
    this.isSubjectOrderChanged = false;
    this.isSubSubjectOrderChanged = false;
    this.selectedSubjectId = null;
    this.selectedSubSubjectId = null;
    let comboDatas = [];
    res.forEach(subject => {
      comboDatas.push({
        label: subject.title,
        value: subject.id,
        order: subject.priorityOrder,
        labelInMal : subject.titleInMalayalam,
        
        // status: portfolio.status
      });
    });
    this.subjects = comboDatas.sort((a, b) => a.order > b.order ? 1 : -1);
    
    let portfolioIndex = this.portFolioDto.findIndex(x=>x.id == this.selectedPortfolioId);
    if(portfolioIndex != -1){
    this.portFolioDto[portfolioIndex].subjects = [];
    this.portFolioDto[portfolioIndex].subjects = res;
   }
  }
  getMinisterSubSubjectsBySubjectId(subjectId) {
    let portfolioObj = this.portFolioDto.find(x=>x.id == this.selectedPortfolioId);
    if(portfolioObj && portfolioObj.subjects){
      let subjectObj  = portfolioObj.subjects.find(x=>x.id == subjectId);
      if(subjectObj){
        this.mapSubSubjectData(subjectObj.ministerSubSubjects);
      }
    }
    // this.portfolioService
    //   .getMinisterSubSubjects(subjectId)
    //   .subscribe((res: any) => {
    //     this.mapSubSubjectData(res);
    //   });
  }

  mapSubSubjectData(res) {
    this.subSubjects = [];
    this.isSubSubjectOrderChanged = false;
    this.selectedSubSubjectId = null;
    let comboDatas = [];
    res.forEach(subsubject => {
      comboDatas.push({
        label: subsubject.title,
        value: subsubject.id,
        order: subsubject.priorityOrder,
        labelInMal : subsubject.titleMalayalam,
      });
    });
    this.subSubjects = comboDatas.sort((a, b) => a.order > b.order ? 1 : -1);;
    let portfolioIndex = this.portFolioDto.findIndex(x=>x.id == this.selectedPortfolioId);
    if(portfolioIndex != -1 && this.portFolioDto[portfolioIndex].subjects && this.selectedSubjectId.value){
      let subjectIndex = this.portFolioDto[portfolioIndex].subjects.findIndex(x=>x.id == this.selectedSubjectId.value);
      if(subjectIndex != -1){
        this.portFolioDto[portfolioIndex].subjects[subjectIndex].ministerSubSubjects = [];
        this.portFolioDto[portfolioIndex].subjects[subjectIndex].ministerSubSubjects = res;
      }
  }
  }
 
  onPortfolioItemDropped() {
    let d = this.portfolios.find((element, index) => element.$$id != index);
    if (d) {
      this.isPortfolioOrderChanged = true;
    }
  }
  savePortfolioOrder(showmsg) {
    this.portfolioService
      .updatePortfolioOrder(this.portfolios)
      .subscribe((res: any) => {
        if(showmsg){
          this.notify.showSuccess("Success", "Portfolio Order Updated.");
        }
        this.isPortfolioOrderChanged = false;
        this.portFolioDto
        this.mapProtfolioData(res);
      });
  }
  onSubjectItemDropped() {
    let d = this.subjects.find((element, index) => element.$$id != index);
    if (d) {
      this.isSubjectOrderChanged = true;
    }
  }
  saveSubjectOrder(showmsg) {
    this.portfolioService
      .updateMinisterSubjectOrder(this.subjects)
      .subscribe((res: any) => {
        if (showmsg) {
          this.notify.showSuccess("Success", "Subject Order Updated.");
        }

        this.isSubjectOrderChanged = false;
        this.mapSubjectData(res);
      });
  }

  onSubSubjectItemDropped() {
    let d = this.subSubjects.find((element, index) => element.$$id != index);
    if (d) {
      this.isSubSubjectOrderChanged = true;
    }
  }
  saveSubSubjectOrder(showmsg) {
    this.portfolioService
      .updateMinisterSubSubjectOrder(this.subSubjects)
      .subscribe((res: any) => {
        if (showmsg) {
          this.notify.showSuccess("Success", "Sub Subject Order Updated.");
        }
        this.isSubSubjectOrderChanged = false;
        this.mapSubSubjectData(res);

      });
  }
  addNew(type){
   
  //  if(this.type == 'portfolio'){
  
  //  }
  
   if(this.type == 'subject'){
    if (!this.selectedPortfolioId) {
      this.notify.showWarning("Warning", "Choose a Portfolio");
      this.subjectValue = "";
      return;
    }
   }
   if(this.type == 'subSubject'){
    if (!this.selectedSubjectId) {
      this.notify.showWarning("Warning", "Choose a Subject");
      this.subSubjectValue = "";
      return;
    }
   }
   this.type = type
   this.isVisible = true;
  }
  edit(data,type){
    this.type = type;
    this.title = data.label;
    this.titleMalayalam = data.labelInMal;
    this.editId = data.value;
    this.editOrder = data.order;
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
    this.title = null;
    this.titleMalayalam = null;
    this.editId = null;
    this.editOrder = null;
    this.type = null;
   }
  handleOk() { 
    if(this.title == null || this.titleMalayalam == null){
      this.notify.showWarning("Warning", "Please provide inputs");
      return;
    }
    if(this.type == 'portfolio'){
      this.addPortFolio(this.title,this.titleMalayalam)
    }
    if(this.type == 'subject'){
      this.addSubject(this.title,this.titleMalayalam)
    }
    if(this.type == 'subSubject'){
      this.addSubSubject(this.title,this.titleMalayalam)
    }
    this.handleCancel()
  }
  getType(){
    if(this.type == 'portfolio'){
      return 'Portfolio'
    }
    if(this.type == 'subject'){
      return 'Subject'
    }
    if(this.type == 'subSubject'){
      return 'Sub Subject'
    }
  }

}
