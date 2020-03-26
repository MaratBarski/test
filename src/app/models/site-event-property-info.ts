import { Hierarchy } from "./hierarchy";
import { SiteEventInfo } from "./site-eventInfo";

export class SiteEventPropertyInfo {
    public eventPropertyName: string;
    public eventId: number;
    public dataSample: string;
    public eventPropertyType: string;
    public hierarchyRootId: number;
    public patientFk: boolean;
    public eventTimeStamp: boolean;
    public ageAtEvent: boolean;
    public fieldDescription: string;
    public fieldDes: string;
    public priority: number;
    public isDependentSearch: boolean;
    public hierarchy: Hierarchy;
    public siteEventInfo: SiteEventInfo;
}
