export class CplFile {
    constructor(
        public docIds: any = null,
        public fileFormDto: {} = null,
        public assemblyId: number = null,
        public assigedTo: number = null,
        public currentNumber: number = null,
        public currentVersion: number = null,
        public description: string = '',
        public fileId: number = null,
        public fileNumber: string = '',
        public priority: string = '',
        public sectionId: number = null,
        public sessionId: number = null,
        public subject: string = '',
        public type: string = '',
        public userId: number = null,
        public workflowEngineCode: string = ''
    ) {}
}
