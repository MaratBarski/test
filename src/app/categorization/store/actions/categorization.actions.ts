import { createAction, props } from '@ngrx/store';

export const LOAD_CATEGORIZATION = '[Load Categorization] Load';
export const LOAD_CATEGORIZATION_SUCC = '[Load Categorization suc] Load';
export const LOAD_CATEGORIZATION_FAIL = '[Load Categorization fail] Load';

export const load = createAction(LOAD_CATEGORIZATION);

export const loadFail = createAction(LOAD_CATEGORIZATION_FAIL);

export const loadSucc = createAction(LOAD_CATEGORIZATION_SUCC,
    props<{ payload: any }>()
);



