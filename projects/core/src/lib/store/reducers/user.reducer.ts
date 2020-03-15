import { UserInfo, UserResponse } from '../../models/UserInfo';
import * as actions from '../actions/user.actions';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoginService } from '../../services/login.service';

const DEFAULT_STATE = () => {
    return new UserInfo();
}

export function user(state: UserInfo = DEFAULT_STATE(), act: any): UserInfo {
    switch (act.type) {
        case (actions.SET_DATA_ACTION):
            return {...act.payload};
            //return LocalStorageService.getObject(LoginService.USER, act.payload);
        default:
            return {...state};
            //return LocalStorageService.getObject(LoginService.USER, state);
    }
}
