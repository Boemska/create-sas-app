import ActionTypes from './ActionTypes'

const initalState = {
	test: false,
	mainSpinner: false,
	userData: null,
	offline: false
}

export default function homeReducer(state = initalState, action) {
	switch (action.type) {
		case ActionTypes.TEST:
			return Object.assign({}, state, {
				test: action.payload
			})
		case ActionTypes.SET_USER_DATA:
			return Object.assign({}, state, {
				userData: action.payload
			})
		case ActionTypes.SET_OFFLINE:
			return Object.assign({}, state, {
				offline: action.state
			})
		default:
			return state
	}
}
