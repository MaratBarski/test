export interface UsageReportParams {
    fromDate?: Date | string;
    toDate?: Date | string;
    includeAdmin?: boolean;
    users?: Array<any>;
    environmet?: any;
}