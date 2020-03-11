import * as actions from '../actions/categorization.actions';
;

const GetDefaultState = (): any => {
    return {
        data: [],
        massage: '',
        status: ''
    }
}

export function categorization(state = GetDefaultState(), act: any): any {
    switch (act.type) {
        case (actions.LOAD_CATEGORIZATION_SUCC):
            return { ...act.payload };
        case (actions.LOAD_CATEGORIZATION_FAIL):
            return { ...state };
        default:
            return { ...state };
    }
}
