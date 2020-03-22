import { createAction, props } from '@ngrx/store';

export const LOAD_HISTORY_REPORT = '[Load history] Load';
export const LOAD_HISTORY_REPORT_SUCC = '[Load history suc] Load';
export const LOAD_HISTORY_REPORT_FAIL = '[Load history fail] Load';


export const load = createAction(LOAD_HISTORY_REPORT);

export const loadFail = createAction(LOAD_HISTORY_REPORT_FAIL);

export const loadSucc = createAction(LOAD_HISTORY_REPORT_SUCC,
    props<{ payload: any }>()
);




