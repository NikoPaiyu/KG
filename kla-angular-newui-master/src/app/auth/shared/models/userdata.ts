export class UserData {
  public token: Array<any>;
  public userId: string;
  public userName: string;
  public authorities: string[] = [];
  public roleIds: number[] = [];
  public fullName: string = "";
  public malayalamFullName: string = "";
  public photoUrl: string = "";
  public firstName: string = "";
  public lastName: string = "";
  public passwordChanged: boolean = false;
  public userType: string = '';
  public menu: Array<any>;
  public rbsRoleMenu: Array<any>;
  public rbsPermissions: Array<any>;
  public rbsRole: Array<any>;
  public correspondenceCode: any;
  public userDashBoardType:any;
  public validated:boolean;
}
