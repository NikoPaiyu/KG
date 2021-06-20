export interface timeAllocationData{
    businessDto: businessDto,
    fileId: number,
    governorsAddressId: number,
    ministersReplyTime: number,
    moverTime: number,
    status:string,
    timeAllocatedDate:string,
    timeAllocatedDay: number,
    timeAllocatedMasterId: 0,
    timeResponseDTO: timeResponseDTO[],
    totalTime: number
}

export interface businessDto{
    assignedTo: number,
    businessDates: [],
    forwardedDate: string,
    id: number,
    numberOfDays: number,
    referenceId: string,
    referenceNumber:string,
    referenceTitle: string,
    referenceType: string,
    status: string,
    taStatus: string,
    taTaken: boolean,
    typeCode: string
  }
export interface timeResponseDTO {
    parties: parties [],
    side: string,
    totalTime: number
  }
  export interface parties {
    partyCount: number,
    partyId: number,
    partyName: string,
    timeAllocated: string,
    timeAllocatedInMinutes: number
  }