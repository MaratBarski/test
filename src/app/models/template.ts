import { Project } from './project';
import { SiteEventInfo } from './site-eventInfo';

export class Template{
     templateId: number;
     templateName: string;
     templateType: string;
     templateGroup: number;
     projectId: number;
     project?: Project;
     siteEventInfos?: Array<SiteEventInfo>;
}