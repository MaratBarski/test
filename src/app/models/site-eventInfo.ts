import { Site } from './site';
import { Template } from './template';

export class SiteEventInfo {
    eventId: number;
    eventDes: string;
    eventTableAlias: string;
    eventTableName: string;
    eventType: string;
    siteId: number;
    site?: Site;
    authorities?: Array<Template>;
}