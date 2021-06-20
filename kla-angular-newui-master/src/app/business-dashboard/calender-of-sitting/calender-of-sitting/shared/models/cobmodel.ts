export class AssemblyList {
  id: number;
  assemblyId: number;
}
export class SessionList {
  id: number;
  sessionId: number;
}

//save CalenderOdsitting Model
export class saveCosModel {
  id: number;
  calendarOfDay: calendarOfDay[];
  businessDetail:businessDetails[];
}

export class calendarOfDay {
  id: number;
  date: Date;
  descriptionEng: string;
  descriptionMal: string;
  assemblyId:string;
  sessionId:string;
  calendarOfSittingId:string;
  calenderOfDaysId:string;
  dateList:Date;
  questionDay: boolean;
  businessDetails:businessDetails[];
}
export class businessDetails{
  id:number;
  calendarBusinessGroupsId:string;
  preTitleEng:string;
  preTitleMal:string;
  lobBusinessGroupId:string;
}

  

