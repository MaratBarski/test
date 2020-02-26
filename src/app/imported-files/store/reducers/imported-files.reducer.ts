import * as actions from '../actions/imported-files.actions'

export function fileSource(state = {}, act: any): any {
    switch (act.type) {
        case (actions.LOAD_FILE_SOURCE_SUCC):
            return { ...act.payload };
        case (actions.LOAD_FILE_SOURCE_FAIL):
            return {...state};
        default:
            return {...state};
    }
}
