import ActionTypes from './ActionTypes'

const initalState = {
	userData: null,
	leftPanel: false,
	rightPanel: false,
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
		case ActionTypes.SET_LEFT_PANEL:
				return Object.assign({}, state, {leftPanel: action.state})
		case ActionTypes.SET_RIGHT_PANEL:
				return Object.assign({}, state, {rightPanel: action.state})
		default:
			return state
	}
}
