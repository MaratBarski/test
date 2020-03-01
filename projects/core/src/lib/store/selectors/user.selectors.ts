import { createSelector } from '@ngrx/store';
import { UserInfo } from '../../models/UserInfo';

export const userSelector = (state: any) => state.userInfo;

export const tokenSelector = createSelector(
    userSelector,
    (user: UserInfo) => user.token
)