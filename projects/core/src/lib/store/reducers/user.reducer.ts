import { UserInfo } from '../../models/UserInfo';
import * as actions from '../actions/user.actions';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoginService } from '../../services/login.service';

const DEFAULT_STATE = () => {
    return new UserInfo();
}

export function user(state: UserInfo = DEFAULT_STATE(), act: any): UserInfo {
    switch (act.type) {
        case (actions.LOGIN_ACTION):
            LocalStorageService.setObject(LoginService.TOKEN, act.payload);
            return { ...act.payload };
        case (actions.LOGOUT_ACTION):
            LocalStorageService.clear();
            return LocalStorageService.getObject(LoginService.TOKEN, DEFAULT_STATE());
        case (actions.SET_DATA_ACTION):
            LocalStorageService.getObject(LoginService.USER, act.payload);
            return { ...act.payload };
        default:
            return LocalStorageService.getObject(LoginService.TOKEN, state);
    }
}
