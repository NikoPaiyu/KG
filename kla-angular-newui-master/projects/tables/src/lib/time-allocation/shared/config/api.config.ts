export const ApiConfig = {
    basePathTableVersion2: ":8075/kla/service/v2/table", //table version 2
    timeAllocation: {
        buisnessDetails : "/timeAllocation",
        save: "/timeAllocation/save",
        submit: "/timeAllocation/submit",
        generate: "/timeAllocation/generateTimeAllocation",
        getDayAndDates: "/timeAllocation/getDayAndDates",
        getByBuisnessIdAndDay: "/timeAllocation/getByBuisnessIdAndDay",
        setToLOB: " /timeAllocation/uploadToLOB",
        getByBusinessIdAndDay :"/timeAllocation/getByBusinessIdAndDay",
        getPendingBusiness: '/timeAllocation/forwardedBusiness/get/pending',
        assignToAssistant: '/timeAllocation/forwardedBusiness/assignBusinessToAssitant',
        getMemberAllocation:'/timeAllocation/getMemberAllocation',
        uploadToLOB:'/timeAllocation/uploadToLOB'
      },
}