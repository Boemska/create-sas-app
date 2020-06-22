import ActionTypes from "./ActionTypes";

const initialState = {
	isOpen:false,
	edit:false,
	title:''
}

export default function projectDialogReducer(state = initialState, action) {
	switch (action.type) {

		case ActionTypes.OPEN: {
			return Object.assign({}, state, {
				isOpen: true,
				title:'Add new project'
			})
		}
		case ActionTypes.OPEN_FOR_EDIT: {
			return Object.assign({}, state, {
				isOpen: true,
				edit: true,
				title:'Edit project'
			})
		}
		case ActionTypes.CLOSE: {
			return Object.assign({}, state, {
				isOpen: false,
				edit:false
			})
		}
		default:
			return state
	}
}
