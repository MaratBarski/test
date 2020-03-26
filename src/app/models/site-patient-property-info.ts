import { Hierarchy } from "./hierarchy";
import { Site } from "./site";

export class SitePatientPropertyInfo {
    public patientPropertyFieldId: number;
    public patientPropertyName: string;
    public patientPropertyType: string;
    public hierarchyRootId: number;
    public siteId: number;
    public dataSample: string;
    public patientPk: boolean;
    public fieldDescription: string;
    public fieldDes: string;
    public eventTimeStamp: boolean;
    public priority: number;
    public site: Site;
    public hierarchy: Hierarchy;
}
