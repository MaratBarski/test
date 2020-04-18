import { FileTypeBank } from "./file-type-bank";
import { SessionHistory } from "./session-history";

export class SessionHistoryFiles {
     public sessionHistoryFilesId: number;
     public sessionHistoryId: number;
     public fileName: string;
     public filePath: string;
     public fileTypeId: number;
     public insertDate: Date;
     public fileTypeBank: FileTypeBank;
     public sessionHistory: SessionHistory;
}
