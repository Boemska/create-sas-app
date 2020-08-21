import ActionTypes from './ActionTypes';

const initialState = {
	projectMetadata: JSON.parse(localStorage.getItem("projectMetadata")),
	projectContent: JSON.parse(localStorage.getItem("projectContent")),
  save: JSON.parse(localStorage.getItem('save')),
  createdByAvatar: JSON.parse(localStorage.getItem('createdBy'))
}

// Usefull function of project has more then one array properties which members change over time

// const saveChanges = (projectContent, newArray, action) => {
//   const newProject = Object.assign({}, projectContent, {
//     [action.payload.field]: newArray
//   })
//   localStorage.setItem("projectContent", JSON.stringify(newProject));
//   localStorage.setItem("save" , JSON.stringify(true))
//   return {
//       projectContent: newProject,
//       save: true
//   }
// }

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
      localStorage.setItem('projectContent', JSON.stringify(newProject));
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
      localStorage.removeItem('createdBy');
      return Object.assign({}, {projectMetadata: null, projectContent: null, save: false});
    }

    case ActionTypes.GET_CREATOR_AVATAR :{
      localStorage.setItem('createdBy', JSON.stringify(action.payload))
      return Object.assign({}, state, {createdByAvatar: action.payload})
    }
    
		default:
			return state
	}
}
