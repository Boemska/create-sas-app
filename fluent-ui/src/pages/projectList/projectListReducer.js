import ActionTypes from './ActionTypes'

const initialState = {
  folders: [],
  currentFolder: null
}

export default function projectListReducer(state = initialState, action) {
	switch (action.type) {
		case ActionTypes.FETCH_ROOT_FOLDERS:
			return Object.assign({}, state,
				{folders: action.payload})
		case ActionTypes.FETCH_FOLDER_CHILDREN:
			return Object.assign({}, state, {folders:action.payload})
		case ActionTypes.LEAVE_CURRENT_FOLDER:
			state.folders.pop();
      return Object.assign({}, state, {folders: [...state.folders]})
    case ActionTypes.SET_CURRENT_FOLDER: 
      return Object.assign({}, state, {currentFolder: action.payload})
		default:
			return state
  }
}