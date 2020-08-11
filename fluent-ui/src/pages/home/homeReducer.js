import ActionTypes from './ActionTypes'

const initalState = {
	test: false,
	mainSpinner: false,
	userData: null,
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
		default:
			return state
	}
}
