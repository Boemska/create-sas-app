import ActionTypes from './ActionTypes'

export async function openProjectDialog(dispatch) {
			dispatch({
				type: ActionTypes.OPEN
			})
}

export async function openAndEditProjectDialog(dispatch) {
			dispatch({
				type: ActionTypes.OPEN_FOR_EDIT
			})
}

export async function closeProjectDialog(dispatch) {
			dispatch({
				type: ActionTypes.CLOSE
			})
}