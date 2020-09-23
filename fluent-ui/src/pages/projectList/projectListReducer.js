import ActionTypes from './ActionTypes'
import {fetchRootFolders, setBreadcrumbs} from './projectListActions'
import {store} from '../../index'

const initialState = {
	folders: [],
	breadcrumbs: [
		{
			text: 'Files',
			key: 'Files',
			onClick: () => {
				fetchRootFolders(store.dispatch, 'Files')
					.then(() => {
						setBreadcrumbs(store.dispatch, initialState.breadcrumbs)
					})
			}
		}
	]
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
		case ActionTypes.SET_BREADCRUMBS:
			return Object.assign({}, state, {breadcrumbs: action.payload})
		case ActionTypes.SORT_FOLDERS:
			return Object.assign({}, state, {folders: [...action.payload]})
		default:
			return state
  }
}