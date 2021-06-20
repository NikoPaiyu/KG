export const AuctionConstant = {
    dashboardDisposalbreadcums : ['Disposal','Dashboard'],
    createDisposalBreadCums : ['Disposal','Dashboard','Request'],
    dashbordAuctionbreadcums : ['Auction','Dashboard'],
    createAuctionBreadcums : ['Auction','Dashboard','Request'],
    dashboardVoucherBreadCums : ['Voucher','Dashboard'],
    createVoucherBreadCums:['Auction','Store Department','Auction Voucher'],
    deliveryNoteBreadCums : ['DeliveryNote','Dashboard'],
    createDeliveryNoteBreadCums : ['DeliveryNote','Dashboard','Request']
}


export const AuctionConstantApi = {
    createDisposalRequestApi : 'disposalRequest',
    disposalDashboardApi :'disposalRequest',
    editDisposalRequestApi : 'disposalRequest',
    auctionDashboardApi:'auction',
    editAuctionRequestApi : 'auction',
    createAuctionRequestApi : 'auction',
    voucher :'voucher',
    createDashboardApiSubmit : 'disposalRequest/submit',
    deliveryNoteApi:'deliveryNote',
    auctionRegisterApi: 'register',
    bidApi: 'bid'
}


export const DisposalLabels = {
    createRequest : 'New Disposal Request',
    editRequest : 'Edit Disposal Request'
}


export const DisposalStatus = {
    awaitingApproval: 'AWAITING_APPROVAL',
    draft: 'DRAFT'
}

export const AuctionStatus = ['Draft','Active'];

export const TitleNames = {
    disposal : {
        create : 'New Disposal Request',
        edit: 'Edit Disposal Request',
        view: 'View Disposal Request',
        createSuccess : 'New Disposal Request has been succesfully created',
        editSuccess : 'Disposal Request has been succesfully edited',
        fmsSuccess : 'FMS ID'
    },
    auction: {
        create : 'New Auction Request',
        edit :'Edit Auction Request',
        view:'View Auction Request',
        createSuccess : 'New Auction Request has been succesfully created',
        editSuccess : 'Auction Request has been succesfully edited'
    },
    register: {
        create : 'New Register Request',
        edit :'Edit Register Request',
        view:'View Register Request',
        createSuccess : 'New Disposal Request has been succesfully created',
        editSuccess : 'Disposal Request has been succesfully edited'
    },
    voucher: {
        create : 'New Voucher Request',
        edit :'Edit Voucher Request',
        view:'View Voucher Request',
        createSuccess : 'New Voucher Request has been succesfully created',
        editSuccess : 'Voucher Request has been succesfully edited'
    },
    deliveryNote: {
        create : 'New DeliveryNote Request',
        edit :'Edit DeliveryNote Request',
        view:'View DeliveryNote Request',
        createSuccess : 'New Disposal Request has been succesfully created',
        editSuccess : 'Disposal Request has been succesfully edited'
    }
}


export const NoSpaceRegex = new RegExp(/^\S*$/);