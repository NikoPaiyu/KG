export class UserDetails {
  constructor(
    public userName: string = '',
    public firstName: string = '',
    public lastName: string = '',
    public fullName: string = '',
    public fullNameMalayalam: string = '',
    public email: string = '',
    public mobileNumber: string = '',
    public constituencyId: string = '',
    public constituencyName: string = '',
    public partyId: string = '',
    public klaDepartmentId: string = '',
    public klaRoleId: string = '',
    public role: string[] = [],
    public roleDisplay: string[] = [],
    public password: string = "",
    public cpassword: string = "",
    public userType: string = "",
    public profilePhoto: string = "",
    public id: string = "",
    public memberType: string = "",
    public memberGroup: string = "",
    public memberDesignationId = "",
    public keralaPartyFrontId = '',    
    public rbsRole: any = [],
    public departmentId: any = '',
    public portfolioId: any = '',
  ) {}
}
export class AttentenceDetails {
  toatalMembers: string = '';
  totalPresent: string = '';
  totalAbsent: string = '';
  attendancePercentage: string = '';
}
