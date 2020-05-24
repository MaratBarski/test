export class HierarchyLevel {
    hierarchyLevelId: number;
    hierarchyLevelName: string;
    sortValue: number;
    dataSample: string;
    hierarchyRootId: number;
}
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
    project_id: number;
    hierarchyLoadingType: string;
    hierarchyLevels: Array<HierarchyLevel>;
}