import ActionTypes from './ActionTypes'

const initalState = {
	test: false,
	welcomeMessage: false,
	userData: null,
	newUpdate:false,
	isSplitterOpen: false,
	isOpenLeftSplitter: false,
	tabbarIndex: 0, //home
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
		case ActionTypes.SET_SPLITTER:
			return Object.assign({}, state, {
				isSplitterOpen: action.payload
			})
		case ActionTypes.SET_LEFT_SPLITTER:
			return Object.assign({}, state, {
				isOpenLeftSplitter: action.payload
			})
		case ActionTypes.UPDATE_TABBAR_INDEX:
			return Object.assign({}, state, {
				tabbarIndex: action.payload
			})
		default:
			return state
	}
}
