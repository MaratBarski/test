import { Template } from './template';
import { Project } from './project';
import { SessionHistoryFiles } from './session-history-files';
import { UserSession } from './user-session';
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
     sessionId: number;
     insertDate: string;
     information: string;
     projectId: number;
     transStatus: boolean;
     transMsg: string;
     sessionName: string;
     fileNameAlias: string;
     projectName: string;
     login: string;
     fullName: string;
     approvalKey: number;
     researchName: string;
     researchInfo: string;
     data: string;
     downloadActive?: any;
}