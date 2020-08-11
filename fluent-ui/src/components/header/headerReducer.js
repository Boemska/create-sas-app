import ActionTypes from './ActionTypes'

const initialState = {
	mainSpinner: false
}

export default function headerReducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.MAIN_SPINNER:
			return Object.assign({}, state, {
				mainSpinner: action.payload
			})
		default:
			return state
		}
}

