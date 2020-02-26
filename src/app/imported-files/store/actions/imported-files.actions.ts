import { createAction, props } from '@ngrx/store';

export const LOAD_FILE_SOURCE = '[Load file] Load';
export const LOAD_FILE_SOURCE_SUCC = '[Load file suc] Load';
export const LOAD_FILE_SOURCE_FAIL = '[Load file fail] Load';

export const load = createAction(LOAD_FILE_SOURCE);

export const loadFail = createAction(LOAD_FILE_SOURCE_FAIL);

export const loadSucc = createAction(LOAD_FILE_SOURCE_SUCC,
    props<{ payload: any }>()
);



