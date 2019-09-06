import { ACTIONS } from './actions';

const initialState = {
    popup: false,
};

function rootReducer(state = initialState, action) {
    if (action.type === ACTIONS.POPUP) {
        return {
            ...state,
            popup: action.popup
        }
    }
    return state;
}

export default rootReducer;