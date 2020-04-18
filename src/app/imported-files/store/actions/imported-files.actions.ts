import { createAction, props } from '@ngrx/store';
import { FileSourceResponse, FileSource } from '../../../models/file-source';

export const LOAD_FILE_SOURCE = '[Load file] Load';
export const LOAD_FILE_SOURCE_SUCC = '[Load file suc] Load';
export const LOAD_FILE_SOURCE_FAIL = '[Load file fail] Load';

export const DELETE_FILE_SOURCE = '[Delete file] Delete';
export const DELETE_FILE_SOURCE_SUCC = '[Delete file suc] Delete';
export const DELETE_FILE_SOURCE_FAIL = '[Delete file fail] Delete';

export const load = createAction(LOAD_FILE_SOURCE);

export const loadFail = createAction(LOAD_FILE_SOURCE_FAIL);

export const loadSucc = createAction(LOAD_FILE_SOURCE_SUCC,
    props<{ payload: FileSourceResponse }>()
);

export const deleteFile = createAction(DELETE_FILE_SOURCE,
    props<{ payload: FileSource }>()
);

export const deleteFileFail = createAction(DELETE_FILE_SOURCE_FAIL,
    props<{ payload: FileSource }>()
);

export const deleteFileSucc = createAction(DELETE_FILE_SOURCE_SUCC,
    props<{ payload: FileSource }>()
);



