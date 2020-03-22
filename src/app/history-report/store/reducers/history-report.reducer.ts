import * as actions from '../actions/history-report.actions';


const GetDefaultState = (): any => {
    return {
        data: [],
        massage: '',
        status: ''
    }
}

export function historyReport(state = GetDefaultState(), act: any): any {
    switch (act.type) {
        case (actions.LOAD_HISTORY_REPORT_SUCC):
            return { ...act.payload };
        case (actions.LOAD_HISTORY_REPORT_FAIL):
            return { ...state };
        default:
            return { ...state };
    }
}
