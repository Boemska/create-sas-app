import ActionTypes from './ActionTypes';

const initialState = {
	projectMetadata: JSON.parse(localStorage.getItem("projectMetadata")),
	projectContent: JSON.parse(localStorage.getItem("projectContent")),
	save: JSON.parse(localStorage.getItem('save'))
}

export function projectReducer(state = initialState, action) {

	switch (action.type) {

		case ActionTypes.SELECT_PROJECT: {
			localStorage.setItem("projectMetadata", JSON.stringify(action.payload));
			return Object.assign({}, state, {projectMetadata: action.payload})
		}

		case ActionTypes.FETCH_SINGLE_PROJECT: {
			localStorage.setItem("projectContent", JSON.stringify(action.payload))
			localStorage.setItem("save", JSON.stringify(false))
			return Object.assign({}, state, {
				projectContent: action.payload,
				save: false
			})
		}

		case ActionTypes.UPDATE_PROJECT: {
      localStorage.setItem("save", JSON.stringify(true))
      localStorage.setItem('projectContent', JSON.stringify(action.payload))
			return Object.assign({}, state, {
				projectContent: action.payload,
				save: true
			})
		}

		case ActionTypes.CHANGES_SAVED: {
			localStorage.setItem('save', JSON.stringify(false));
			const newProject = {
				...state.projectContent,
				lastModified: action.payload
			}
			return Object.assign({}, state, {
				save: false,
				projectContent: newProject
			})
		}

		case ActionTypes.OVERRIDE: {
			localStorage.setItem('save', JSON.stringify(false));
			return Object.assign({}, state, {save: false})
    }
    case ActionTypes.DELETE_PROJECT: {
      localStorage.removeItem('save')
      localStorage.removeItem('projectContent');
      localStorage.removeItem('projectMetadata');
      return Object.assign({},initialState);
    }

		default:
			return state
	}
}
