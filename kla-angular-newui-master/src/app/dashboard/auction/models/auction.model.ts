import { UISTATE } from "./auction.types";

export class Disposal {
    id: number;
    reasonForDisposal: string;
    dateForDisposal: string;
    expectedDisposalValue: number ;
    disposalMethod: string;
    remarks: string;
    statusOfDisposal: string = 'Draft';
    attachments: Attachment[] = [];
    state: UISTATE;
}

export class Auction {
    id: number;
    auctionDate:string;
    placeOfAuction:string;
    depositAmount:number;
    description:string;
    bidSubmissionDate:string;
    auctionTime:string;
    statusOfAuction:string = 'Active';
    attachments: Attachment[] = [];
    disposalRequestId: number;
    state: UISTATE;
    bids: Bid[] = [];
}

export class Voucher {
    id: number;
    auctionFileNumber: string;
    auctionValue: string;
    buyersName: string;
    buyersPhone: string;
    dateOfAuction: string;
    paymentStatus: string;
    buyersAddress: string;
    voucherStatus: string = 'Draft';
    state: UISTATE;
}

export class DeliveryNote {
    id: number;
    auctionFileNumber: number;
    auctionValue: number;
    auctionDate: string;
    buyersName: string;
    buyersAddress: string;
    contactNumber: string;
    issueDate: string;
    deliveryStatus: string;
    paymentStatus: string;
    assetDescription: string;
    requestStatus = 'Active';
    state: UISTATE;
}

export class AuctionRegister {
    id: number = 0;
    articleName: string;
    quantity: string;
    bookRateRs: number;
    bookAmountRs: number;
    storageChangeRs: number;
    commissionRs: number;
    amountRealisedRs: number;
    lossRs: number;
    soldToAndWhen: string;
    receiptClass: string;
    remittanceChallan: string;
    entryStatus: string;
}

export class Bid {
    constructor(isChecked: boolean){
        this.isChecked = isChecked;
    }
    id: number;
    bidDetail: string = '';
    vendor: string = '';
    submissionDate: string = '';
    challanNo: string = '';
    challanDate: string = '';
    challanAmount: string = '';
    statusOfBid: string = 'N';
    auctionRequestId: string = '';
    attachments: Attachment[] = [];
    isChecked: boolean = false;
}

export class Attachment {
    refrenceId: number;
    id: number;
    constructor(public attachmentName: string, public auctionAttachment: any,public referenceFunctionality: string){}
} 

