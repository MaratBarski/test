import { Template } from './template';
import { Project } from './project';
import { User } from 'core/lib/models/UserInfo';

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
     projectObj?: Project;
     template?: Template;
     user?: User;
     rowsNum?: number;
     columnsNum?: number;
}