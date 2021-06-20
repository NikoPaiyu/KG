import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { ElectionService } from '../../shared/services/election.service';

@Component({
  selector: 'tables-panel-list',
  templateUrl: './panel-list.component.html',
  styleUrls: ['./panel-list.component.css']
})
export class PanelListComponent implements OnInit {
  assemblyId=null;
  sessionId= null;
  assemblyList = [];
  sessionList = [];
  mainList: any = {
    panelList: []
  };
  panelList : any = [];
  panelListId : any = [];
  tempPanelList:any = [];
  assemblyValue="14";
  assembly=1;
  sessionValue: any;
  session: any;
  currentUser: any = null;
  isRequestModalVisible = false;
  isVisibleView = false;
  createPanelForm = this.fb.group({
    id: [null],
    assemblyId: [null, Validators.required],
    sessionId: [null, Validators.required]
  });
  file = {
    subject: "",
    priority: null,
    description: "",
  };
  createButton;

  constructor(private electionService: ElectionService,
              private fb: FormBuilder,
              private router: Router,
              @Inject('authService') private AuthService,
              private notification: NzNotificationService) { 
                this.currentUser = AuthService.getCurrentUser();
                this.assemblyId;
                console.log(this.currentUser);
              }

  getAssembly() {
    this.electionService.getAllAssembly().subscribe((res: any) => {
      this.assemblyList = res;
    });
  }

  getSession() {
    this.electionService.getAllSession().subscribe((res: any) => {
      this.sessionList = res;
    });
  }
  createPanel(){
    this.isRequestModalVisible = true;
    this.createPanelForm.reset();
    if(this.panelList.length === 0){
      this.createButton = 'Create file for POC';
    } else {
      this.createButton = 'Create POC';
    }
  }
  handleCancel() {
    this.isRequestModalVisible = false;
    this.isVisibleView = false;
    this.createPanelForm.reset();
  }
  getPanelListById(id){
    this.electionService.getPanelListById(id).subscribe((res:any)=>{
      this.panelListId = this.tempPanelList= res;
    })
  }
  showView(id, sessionValue, sessionId){
    this.isVisibleView = true;
    this.sessionValue= sessionValue; 
    this.session = sessionId;
    this.getPanelListById(id);
  }

  createPanelList(){
    const body = {
      assemblyId:this.assemblyId.id,
      sessionId:this.sessionId,
      status:"SAVED",
      operationType: "CREATE",
      membersList:[] , 
      fileForm: {
        assemblyId:this.assemblyId.id,
        sessionId: this.sessionId,
        subject: this.file.subject,
        description:this.file.description,
        priority: this.file.priority,
        sectionId: this.currentUser.correspondenceCode.id,
        userId: this.currentUser.userId,
        currentNumber:null,
        subTypes:['PANEL_OF_CHAIRMAN'],
        activeSubTypes: ['PANEL_OF_CHAIRMAN'],
        type: "TABLE",
      },    
    }
    this.electionService.createPanelList(body).subscribe((res:any)=>{
      this.notification.success('Success', 'Created Panel of Chairman.');
      this.isRequestModalVisible = false;
      this.getPanelList();

    });
  }
  viewFile(id){
    this.router.navigate(['business-dashboard/tables/file-view/', 'election' , id]);
    }
  getPanelList(){
    const body ={
      assemblyId:this.assemblyId.id,
      sessionId:null
    }
    this.electionService.getPanelList(body).subscribe((res: any)=>{
     this.panelList = res;
    });
  }
  
  ngOnInit() {
    this.getAssembly();
    this.getSession();
  }

}
