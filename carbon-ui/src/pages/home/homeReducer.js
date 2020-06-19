import ActionTypes from './ActionTypes'

const initalState = {
	test: false,
	mainSpinner: false,
	userData: null,
	dataLabels: null
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
		case ActionTypes.MAIN_SPINNER: {
			return {
				...state,
				mainSpinner: action.payload
			}
		}
		case ActionTypes.SET_DATA_LABELS: {
			return {
				...state,
				dataLabels: action.payload
			}
		}
		default:
			return state
	}
}
