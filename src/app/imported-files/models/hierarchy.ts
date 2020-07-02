import { Project } from './project';
import { HierarchyLevel } from './hierarchy-level';

export class Hierarchy {
     hierarchyRootId: number;
     description: string;
     domain: string;
     hierarchyFile: string;
     hierarchyName: string;
     projectId: number;
     hierarchyFilePath: string;
     insertDate: Date;
     defaultLevelId: number;
     hierarchyLevels?: Array<HierarchyLevel>
     project?: Project;
     siteEventPropertyInfos?: any;
     hierarchyLoadingType?: any;
     hierarchyChange?: any;
     status?: any;
}