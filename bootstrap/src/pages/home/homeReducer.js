import ActionTypes from './ActionTypes'

const initalState = {
	test: false,
	mainSpinner: false,
	userData: null,
	globalData: {},
	questionData: null,
	language: 'en'
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
		case ActionTypes.SET_GLOBAL_DATA:
			return Object.assign({}, state, {
				globalData: action.payload
			})
		case ActionTypes.SET_QUESTION_DATA:
			return Object.assign({}, state, {
				questionData: action.payload
			})
		case ActionTypes.SET_LANGUAGE:
			return Object.assign({}, state, {
				language: action.payload
			})
		default:
			return state
	}
}
