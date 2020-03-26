// import { Template } from './template';
// import { Project } from './project';
import { User } from 'core/lib/models/UserInfo';

export class SessionHistoryResponse {
     data?: Array<SessionHistory>;
     massage?: string;
     status?: string;
}

export class SessionHistoryMappingResponse {
     data?: SessionHistory;
     massage?: string;
     status?: string;
}


export class SessionHistory {
     sessionHistoryId: number;
     userId: number;
     sessionId: number;
     fileId: string;
     insertDate: string;
     projectId: number;
     userQeSession: string;
     userActivateSession: string;
     transStatus: boolean;
     transMsg: string;
     sessionName: string;
     fileNameAlias: string;
     projectName: string;
     templateId: number;
     templateName: string;
     // sessionHistoryFiles: SessionHistoryFiles[];
     // template: Template;
     // userSession: UserSession;
     // project: Project;
     user: User;
 }


// export class SessionHistory {
//      fileId: number;
//      fileName: string;
//      filePath: string;
//      fileNameAlias: string;
//      tag: string;
//      insertDate: Date;
//      templateId: number;
//      tableName: string;
//      project: number;
//      uploadedBy: number;
//      fileType: number;
//      projectObj?: Project;
//      template?: Template;
//      user?: User;
//      rowsNum?: number;
//      columnsNum?: number;
// }