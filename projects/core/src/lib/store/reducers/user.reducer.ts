import { UserInfo, UserResponse } from '../../models/UserInfo';
import * as actions from '../actions/user.actions';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoginService } from '../../services/login.service';

const DEFAULT_STATE = () => {
    return new UserResponse();
}

export function user(state: UserResponse = DEFAULT_STATE(), act: any): UserInfo {
    switch (act.type) {
        case (actions.SET_DATA_ACTION):
            return LocalStorageService.getObject(LoginService.USER, act.payload);
        default:
            return LocalStorageService.getObject(LoginService.USER, state);
    }
}
