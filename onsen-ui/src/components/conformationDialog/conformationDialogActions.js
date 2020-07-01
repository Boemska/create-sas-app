import ActionTypes from './ActionTypes'
import adapterService from '../../adapterService/adapterService'

export async function openConformationDialog(dispatch, message, action, push) {
	dispatch({
		type: ActionTypes.OPEN_CONFIRMATION,
		payload: {
			message,
			action,
			push,
			isOpen: true,
			actionName:'Proceed'
		}
	})
}


export async function openDeleteConformationDialog(dispatch, message, uri, navigator) {
	let action = () => {
		adapterService.deleteItem(dispatch, uri)
			.then(() => {
				console.log('Delete went success');
			})
			.catch(e => {
				console.log(e.message)
			})
	}
	dispatch({
		type: ActionTypes.OPEN_CONFIRMATION,
		payload: {
			message,
			action,
			push: null,
			isOpen: true,
			additional: navigator,
			actionName:'Delete'
		}
	})
}

export async function closeConformationDialog(dispatch) {
	dispatch({
		type: ActionTypes.CLOSE_CONFIRMATION
	})
}