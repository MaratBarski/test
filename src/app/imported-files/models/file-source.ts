import { Template } from './template';
import { Project } from './project';
import { User } from 'core/lib/models/UserInfo';
import { Hierarchy } from '@app/models/hierarchy';

export class FileSourceResponse {
     data?: Array<FileSource>;
     massage?: string;
     status?: string;
}

export class FileSourceMappingResponse {
     data?: FileSource;
     massage?: string;
     status?: string;
}

export class FileSource {
     fileId: number;
     fileName: string;
     filePath: string;
     fileNameAlias: string;
     tag: string;
     insertDate: Date;
     templateId: number;
     tableName: string;
     project: number;
     uploadedBy: number;
     fileType: number;
     fileClms?: FileClm[];
     projectObj?: Project;
     template?: Template;
     user?: User;
     rowsNum?: number;
     columnsNum?: number;
     fileStatus?: string;
}

export class FileClm {
     public fileId: number;
     public fieldName: string;
     public propertyType: number;
     public description: string;
     public dataSample: string;
     public hierarchyRootId: number;
     public isIncluded: boolean;
     public physicalColName: string;
     public defaultLevelId: number;
     public defaultValue: string;
     public fileSource?: FileSource;
     public hierarchy?: Hierarchy;
}
