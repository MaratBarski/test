import { FileSourceResponse, FileSource } from '../../../models/file-source';

export const selectFileSource = (state: any): FileSourceResponse => state ? state.fileSource : undefined;
export const selectData = (state: any): Array<FileSource> => state && state.fileSource ? state.fileSource.data : undefined;
