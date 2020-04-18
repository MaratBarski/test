import { Project } from './project';
import { HierarchyLevel } from './hierarchy-level';

export class Hierarchy {
     hierarchyRootId: number;
     description: string;
     projectObj?: Project;
     hierarchyFile: string;
     hierarchyName: string;
     projectId: number;
     hierarchyFilePath: string;
     insertDate: Date;
     defaultLevelId: number;
     hierarchyChange: boolean;
     hierarchyLoadingType: string;
     hierarchyLevels?: Array<HierarchyLevel>;
     project?: Project;
}
