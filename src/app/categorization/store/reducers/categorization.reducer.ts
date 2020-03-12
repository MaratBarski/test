import * as actions from '../actions/categorization.actions';
import { CategoryeResponse } from '@app/categorization/models/category-reponse';
;

const GetDefaultState = (): any => {
    return {
        data: [],
        massage: '',
        status: ''
    }
}

export function categorization(state = GetDefaultState(), act: any): CategoryeResponse {
    switch (act.type) {
        case (actions.LOAD_CATEGORIZATION_SUCC):
            return { ...act.payload };
        case (actions.LOAD_CATEGORIZATION_FAIL):
            return { ...state };
        default:
            return { ...state };
    }
}
