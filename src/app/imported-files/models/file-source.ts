import { Template } from './template';
import { Project } from './project';
import { User } from 'src/app/shared/models/user';

export class FileSourceResponse {
     data?: Array<FileSource>;
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
}