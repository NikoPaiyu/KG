export class AssemblyList {
  id: number;
  assemblyId: number;
  assemblySession: [];
  activeAssemblySession: activeAssemblySession;
}
export class activeAssemblySession {
  assemblyId;
  assemblyValue;
  current;
  endDate;
  id;
  sessionId;
  sessionValue;
  startDate;
}
export class SessionList {
  id: number;
  sessionId: number;
}





