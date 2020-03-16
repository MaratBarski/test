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
        case (actions.DELETE_FILE_SOURCE_FAIL):
        case (actions.DELETE_FILE_SOURCE_SUCC):
            return {
                ...state,
                ...{
                    data: state.data.filter(x => x.fileId !== act.payload.fileId)
                }
            }
        default:
            return { ...state };
    }
}
