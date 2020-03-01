import { createAction, props } from '@ngrx/store';
import { UserInfo } from '../../models/UserInfo';

export const LOGIN_ACTION = '[User login] Login';
export const LOGOUT_ACTION = '[User login] LogOut';
export const SET_DATA_ACTION = '[User set data] SetData';

export const login = createAction(LOGIN_ACTION,
    props<{ payload: string }>()
);

export const logout = createAction(LOGOUT_ACTION);

export const userData = createAction(SET_DATA_ACTION,
    props<{ payload: UserInfo }>()
);