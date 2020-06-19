import ActionTypes from './ActionTypes'

const initialState = {
	mainSpinner: false,
	update: false
}

export default function headerReducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.MAIN_SPINNER:
			return Object.assign({}, state, {
				mainSpinner: action.payload
			})
		case ActionTypes.UPDATE_AVAILABLE: {
			return Object.assign({}, state, {update: action.payload})
		}
		default:
			return state
		}
}

