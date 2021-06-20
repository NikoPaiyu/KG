interface MemberAttendanceModel{
    id:             number;
    absentCount:    number;
    presentCount:   number;
    absentMembers:  MemberModel[];
    presentMembers: MemberModel[];
}