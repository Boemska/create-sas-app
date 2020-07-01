import ActionTypes from './ActionTypes';

const initialState = {
	isOpen: false,
	action: null,
	push: null,
	params: null,
	message: '',
	additional:null,
	actionName:''
}

export default function conformationDialogReducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.OPEN_CONFIRMATION: {
			return Object.assign({}, state, {...action.payload})
		}
		case ActionTypes.CLOSE_CONFIRMATION: {
			return Object.assign({}, initialState)
		}
		default:
			return state
	}
}
