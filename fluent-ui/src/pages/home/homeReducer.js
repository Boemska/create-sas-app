import ActionTypes from './ActionTypes'

const initalState = {
	userData: null,
	leftPanel: false,
	rightPanel: false,
	width: 0
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
		case ActionTypes.SET_WINDOW_WIDTH:
				return Object.assign({}, state, {width: action.width})
		default:
			return state
	}
}
