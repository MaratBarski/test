import * as actions from '../actions/imported-files.actions'
import { FileSourceResponse } from '../../models/file-source';

const GetDefaultState = (): FileSourceResponse => {
    return {
        data: [],
        massage: '',
        status: ''
    }
}

export function fileSource(state = GetDefaultState(), act: any): FileSourceResponse {
    switch (act.type) {
        case (actions.LOAD_FILE_SOURCE_SUCC):
            return { ...act.payload };
        case (actions.LOAD_FILE_SOURCE_FAIL):
            return { ...state };
        default:
            return { ...state };
    }
}
