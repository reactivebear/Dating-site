import * as types from '../actions/types.js'

const initialState = {
	registration: false,
    login: false,
    recovery: false
}

export default function modals(modals = initialState, action = {}) {
	let key = action.key
    switch (action.type) {
        case types.TOGGLE_MODAL:
            return Object.assign({}, modals, {
                [key]: action.value
            });
        
        default:
            return modals;
    }
}