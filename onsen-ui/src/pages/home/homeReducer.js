import ActionTypes from './ActionTypes'

const initalState = {
	test: false,
	welcomeMessage: false,
	userData: null,
	newUpdate:false
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
		case ActionTypes.SHOW_WELCOME_MESSAGE:
			return Object.assign({}, state, {
				welcomeMessage: action.isActive
			})
		case ActionTypes.UPDATE_APP:
			return Object.assign({}, state, {
				newUpdate: action.payload
			})
		default:
			return state
	}
}
